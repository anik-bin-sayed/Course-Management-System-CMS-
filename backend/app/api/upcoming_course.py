import json
import logging

from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.core.redis import redis_client
from app.dependencies.database import get_db
from app.services.upcoming_course import CourseService

router = APIRouter(
    prefix="/upcoming-courses",
    tags=["Courses"],
)

logger = logging.getLogger(__name__)

CACHE_TTL = 300
CACHE_KEY_PREFIX = "upcoming_courses:list:"


async def invalidate_upcoming_course_cache():
    try:
        keys_to_delete = [
            key
            async for key in redis_client.scan_iter(
                match=f"{CACHE_KEY_PREFIX}*",
                count=100,
            )
        ]

        if keys_to_delete:
            await redis_client.delete(*keys_to_delete)

    except Exception:
        logger.warning("Redis upcoming-course cache invalidation failed", exc_info=True)


@router.get("/upcoming")
async def get_upcoming_courses(
    page: int = Query(
        1,
        ge=1,
        description="Page number",
    ),
    page_size: int = Query(
        8,
        ge=1,
        le=50,
        description="Number of courses per page",
    ),
    db: Session = Depends(get_db),
):
    cache_key = f"{CACHE_KEY_PREFIX}{page}:{page_size}"

    try:
        cached_courses = await redis_client.get(cache_key)

        if cached_courses is not None:
            return json.loads(cached_courses)

    except Exception:
        logger.warning("Redis upcoming-course cache read failed", exc_info=True)

    courses = CourseService.get_upcoming_courses(
        db=db,
        page=page,
        page_size=page_size,
    )

    try:
        cache_data = jsonable_encoder(courses)

        await redis_client.set(
            name=cache_key,
            value=json.dumps(cache_data),
            ex=CACHE_TTL,
        )

    except Exception:
        logger.warning("Redis upcoming-course cache write failed", exc_info=True)

    return courses
