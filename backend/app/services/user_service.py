from datetime import datetime, timedelta, timezone

from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token, create_refresh_token, decode_token
from app.utils.generate_verification_code import generate_verification_code

from app.services.email_service import send_verification_email


class UserService:

    @staticmethod
    def register(db, data):

        existing = UserRepository.get_by_email(
            db,
            data.email,
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists",
            )

        verification_code = generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        user = User(
            name=data.name,
            email=data.email,
            password=hash_password(data.password),
            is_verified=False,
            verification_code=verification_code,
            verification_code_expires_at=expires_at,
        )

        user = UserRepository.create(
            db,
            user,
        )

        send_verification_email(user.email, verification_code)

        return {"message": "Please check your email to verify", "user": user}

    @staticmethod
    def verify_email(db, data):
        user = UserRepository.get_by_email(db, data.email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.is_verified:
            raise HTTPException(
                status_code=400,
                detail="Email already verified",
            )

        if user.verification_code != data.code:
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code",
            )

        if (
            not user.verification_code_expires_at
            or user.verification_code_expires_at < datetime.utcnow()
        ):
            raise HTTPException(
                status_code=400,
                detail="Verification code expired",
            )

        user.is_verified = True
        user.verification_code = None
        user.verification_code_expires_at = None

        db.commit()
        db.refresh(user)

        access, refresh = UserService._issue_tokens(db, user)

        return {
            "message": "Email verified successfully",
            "access": access,
            "refresh": refresh,
        }

    # Login
    @staticmethod
    def login(db, data):
        user = UserRepository.get_by_email(
            db,
            data.email,
        )

        if not user:
            raise HTTPException(
                status_code=400,
                detail="User not found. Please login first!!",
            )

        if not verify_password(
            data.password,
            user.password,
        ):
            raise HTTPException(
                401,
                "Invalid email or password",
            )

        if not user.is_verified:
            raise HTTPException(
                status_code=403,
                detail="Please verify your email first",
            )

        return UserService._issue_tokens(db, user)

    @staticmethod
    def _issue_tokens(db: Session, user: User):
        access = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role,
            }
        )

        refresh = create_refresh_token(
            {
                "sub": str(user.id),
            }
        )

        UserRepository.update_refresh_token(
            db,
            user,
            refresh,
        )

        return access, refresh

    @staticmethod
    def me(db, user_id: str):
        user = UserRepository.get_by_id(db, user_id)
        print("user", user)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        return user

    @staticmethod
    def logout(
        db: Session,
        user: User,
    ):
        UserRepository.logout(
            db=db,
            user=user,
        )

    @staticmethod
    def refresh(
        db: Session,
        refresh_token: str,
    ):
        payload = decode_token(refresh_token)

        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token",
            )

        if payload["type"] != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user = UserRepository.get_by_refresh_token(
            db,
            refresh_token,
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Refresh token expired",
            )

        access_token = create_access_token(
            {"sub": str(user.id), "type": "access", "role": user.role}
        )

        new_refresh_token = create_refresh_token({"sub": str(user.id)})

        UserRepository.update_refresh_token(db, user, new_refresh_token)

        return access_token, new_refresh_token

    @staticmethod
    def change_role(db: Session, user_id: str, role: str):
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        allowed_roles = {
            "student",
            "instructor",
            "admin",
        }

        if role not in allowed_roles:
            raise HTTPException(
                status_code=400,
                detail="Invalid role. Allowed roles: student, instructor, admin",
            )

        if role != "instructor":
            user.assigned_courses.clear()

        return UserRepository.update_role(
            db=db,
            user=user,
            role=role,
        )
