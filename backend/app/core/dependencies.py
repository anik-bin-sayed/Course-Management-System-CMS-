import logging

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.utils.jwt import decode_token

logger = logging.getLogger(__name__)


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("access_token")

    if not token:
        logger.info("Authentication rejected: access cookie is missing")
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    payload = decode_token(token)

    if not payload or payload.get("type") != "access" or not payload.get("sub"):
        logger.info("Authentication rejected: access token is invalid or expired")
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = UserRepository.get_by_id(
        db,
        payload["sub"],
    )

    if not user:
        logger.info("Authentication rejected: token subject no longer exists")
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


def admin_required(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user


def admin_instructor_required(
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["admin", "instructor"]:
        raise HTTPException(
            status_code=403,
            detail="Admin or instructor access required",
        )

    return current_user


def student_required(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can perform this action",
        )

    return current_user
