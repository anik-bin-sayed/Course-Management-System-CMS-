from fastapi import APIRouter, BackgroundTasks, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from fastapi import Response


from app.dependencies.database import get_db
from app.schemas.user import *
from app.models.user import User
from app.services.user_service import UserService
from app.utils.cookies import set_auth_cookies
from app.core.dependencies import get_current_user
from app.repositories.user_repository import UserRepository
from app.services.profile_cache import invalidate_user_profile_cache

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
)
def register(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    return UserService.register(
        db,
        data,
    )


@router.post("/verify-email")
def verify_email(
    data: VerifyEmailRequest,
    response: Response,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    result = UserService.verify_email(
        db,
        data,
    )

    background_tasks.add_task(invalidate_user_profile_cache, result["user_id"])
    set_auth_cookies(
        response,
        result["access"],
        result["refresh"],
    )

    return {"message": result["message"]}


@router.post("/check-email")
def check_email(data: CheckEmailSchema, db: Session = Depends(get_db)):
    user = UserRepository.get_by_email(
        db,
        data.email,
    )

    if not user:
        return {"exists": False, "message": "No account found with this email."}

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email first",
        )

    return {"exists": True, "message": "Email exists."}


@router.post("/login")
def login(
    data: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    access, refresh = UserService.login(
        db,
        data,
    )

    set_auth_cookies(
        response,
        access,
        refresh,
    )

    return {
        "message": "Login successful",
    }


@router.get(
    "/me",
    response_model=MeResponse,
)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/logout")
def logout(
    response: Response,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    UserService.logout(
        db=db,
        user=current_user,
    )
    background_tasks.add_task(invalidate_user_profile_cache, current_user.id)

    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
    )

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        samesite="lax",
    )

    return {"message": "Logout successful"}


@router.post("/refresh")
def refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token missing",
        )

    access_token, new_refresh_token = UserService.refresh(
        db,
        refresh_token,
    )

    set_auth_cookies(response, access_token, new_refresh_token)

    return {
        "message": "Access token refreshed",
    }
