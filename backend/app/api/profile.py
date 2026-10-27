import json
import logging

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)
from pydantic import ValidationError

from sqlalchemy.orm import Session

from app.models.user import User
from app.dependencies.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.services.cloudinary_service import CloudinaryService
from app.schemas.profile import UpdateProfileSchema
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse
from app.core.redis import redis_client
from app.services.profile_cache import invalidate_user_profile_cache

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)

logger = logging.getLogger(__name__)


@router.patch("/avatar")
async def upload_user_avatar(
    avatar: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_content_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if avatar.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed.",
        )

    try:
        image_url = await CloudinaryService.upload_avatar(
            avatar,
            current_user.id,
        )
    finally:
        await avatar.close()

    if not image_url:
        raise HTTPException(
            status_code=500,
            detail="Avatar upload failed.",
        )

    try:
        current_user.avatar = image_url

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()
        logger.exception("Failed to update user avatar")
        raise HTTPException(
            status_code=500,
            detail="Failed to update avatar.",
        )

    await invalidate_user_profile_cache(current_user.id)

    return {
        "message": "Avatar updated successfully",
        "avatar": image_url,
    }


@router.patch("/edit/{user_id}")
async def update_profile(
    user_id: str,
    data: UpdateProfileSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to edit this profile.",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field in {"website", "github", "linkedin"}:
            if value is not None:
                value = str(value)

        setattr(current_user, field, value)

    try:
        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()
        logger.exception("Failed to update user profile")
        raise HTTPException(
            status_code=500,
            detail="Failed to update profile.",
        )

    await invalidate_user_profile_cache(current_user.id)

    return {
        "message": "Profile updated successfully",
        "user": current_user,
    }


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db),
):
    cache_key = f"user:profile:{user_id}"

    try:
        cached_user = await redis_client.get(cache_key)

        if cached_user is not None:
            try:
                cached_profile = UserResponse.model_validate_json(cached_user)
            except (ValidationError, ValueError, TypeError):
                logger.warning("Malformed user profile cache entry; removing it")
                try:
                    await redis_client.delete(cache_key)
                except Exception:
                    logger.warning(
                        "Failed to remove malformed user profile cache entry",
                        exc_info=True,
                    )
            else:
                return cached_profile.model_dump(mode="json")

    except Exception:
        logger.exception("Redis cache read failed")

    user = UserRepository.get_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user_data = UserResponse.model_validate(user).model_dump(mode="json")

    try:
        await redis_client.set(
            name=cache_key,
            value=json.dumps(user_data),
            ex=settings.USER_PROFILE_CACHE_TTL_SECONDS,
        )

    except Exception:
        logger.exception("Redis cache write failed")

    return user_data
