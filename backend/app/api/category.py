import json
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.models.user import User
from app.core.dependencies import admin_required
from app.services.category_service import CategoryService

from app.core.redis import redis_client

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)

logger = logging.getLogger(__name__)

CATEGORY_CACHE_KEY = "categories:all"
CATEGORY_CACHE_TTL = 300


async def invalidate_category_cache():
    try:
        await redis_client.delete(CATEGORY_CACHE_KEY)
    except Exception:
        logger.warning("Redis category cache invalidation failed", exc_info=True)


@router.post(
    "",
    response_model=CategoryResponse,
)
async def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    category = CategoryService.create(
        db,
        data,
    )

    await invalidate_category_cache()

    return category


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
)
async def update_category(
    data: CategoryUpdate,
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    category = CategoryService.update(
        db,
        category_id,
        data,
    )

    await invalidate_category_cache()

    return category


@router.get(
    "",
    response_model=list[CategoryResponse],
)
async def get_categories(
    db: Session = Depends(get_db),
):
    try:
        cached_categories = await redis_client.get(CATEGORY_CACHE_KEY)

        if cached_categories:
            return json.loads(cached_categories)

    except Exception:
        logger.warning("Redis category cache read failed", exc_info=True)

    categories = CategoryService.get_all(db)

    category_data = [
        CategoryResponse.model_validate(category).model_dump(mode="json")
        for category in categories
    ]

    try:
        await redis_client.set(
            name=CATEGORY_CACHE_KEY,
            value=json.dumps(category_data),
            ex=CATEGORY_CACHE_TTL,
        )
    except Exception:
        logger.warning("Redis category cache write failed", exc_info=True)

    return category_data


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    result = CategoryService.delete(
        db,
        category_id,
    )

    await invalidate_category_cache()

    return result
