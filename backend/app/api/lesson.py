import json
import logging

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.lesson.lesson import (
    LessonCreate,
    LessonResponse,
    LessonUpdate,
)
from app.services.lesson.lesson import LessonService
from app.core.dependencies import (
    admin_instructor_required,
    get_current_user,
)
from app.models.user import User
from app.services.course_access import CourseAccessService
from app.core.redis import redis_client

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)

logger = logging.getLogger(__name__)

CACHE_TTL = 300  # 5 minutes

LESSON_COURSE_PREFIX = "lessons:course:"
LESSON_DETAIL_PREFIX = "lessons:detail:"


async def invalidate_lesson_cache():
    try:
        keys_to_delete = []

        async for key in redis_client.scan_iter(
            match=f"{LESSON_COURSE_PREFIX}*",
            count=100,
        ):
            keys_to_delete.append(key)

        async for key in redis_client.scan_iter(
            match=f"{LESSON_DETAIL_PREFIX}*",
            count=100,
        ):
            keys_to_delete.append(key)

        if keys_to_delete:
            await redis_client.delete(*keys_to_delete)

    except Exception:
        logger.warning("Redis lesson cache invalidation failed", exc_info=True)


@router.post(
    "/",
    response_model=LessonResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lesson(
    data: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    result = LessonService.create_lesson(
        db=db,
        data=data,
        current_user=current_user,
    )

    await invalidate_lesson_cache()

    return result


@router.get(
    "/course/{course_id}",
    response_model=list[LessonResponse],
)
async def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    CourseAccessService.require_course_read_access(
        db=db,
        current_user=current_user,
        course_id=course_id,
    )

    cache_key = f"{LESSON_COURSE_PREFIX}{course_id}"

    try:
        cached_lessons = await redis_client.get(cache_key)

        if cached_lessons:
            return json.loads(cached_lessons)

    except Exception:
        logger.warning("Redis lesson-list cache read failed", exc_info=True)

    lessons = LessonService.get_course_lessons(
        db,
        course_id,
    )

    try:
        cache_data = jsonable_encoder(lessons)

        await redis_client.set(
            name=cache_key,
            value=json.dumps(cache_data),
            ex=CACHE_TTL,
        )

    except Exception:
        logger.warning("Redis lesson-list cache write failed", exc_info=True)

    return lessons


@router.delete(
    "/{lesson_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    try:
        LessonService.delete_lesson(
            db=db,
            lesson_id=lesson_id,
            current_user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )

    await invalidate_lesson_cache()


@router.get(
    "/{lesson_id}",
    response_model=LessonResponse,
)
async def get_lesson_by_id(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cache_key = f"{LESSON_DETAIL_PREFIX}{lesson_id}"

    lesson = None

    try:
        cached_lesson = await redis_client.get(cache_key)

        if cached_lesson:
            lesson = json.loads(cached_lesson)

    except Exception:
        lesson = None
        logger.warning("Redis lesson-detail cache read failed", exc_info=True)

    if lesson is None:
        try:
            lesson = LessonService.get_lesson_by_id(
                db=db,
                lesson_id=lesson_id,
            )

        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error),
            )

    CourseAccessService.require_course_read_access(
        db=db,
        current_user=current_user,
        course_id=lesson["course_id"],
    )

    try:
        await redis_client.set(
            name=cache_key,
            value=json.dumps(jsonable_encoder(lesson)),
            ex=CACHE_TTL,
        )

    except Exception:
        logger.warning("Redis lesson-detail cache write failed", exc_info=True)

    return lesson


@router.put(
    "/{lesson_id}",
    response_model=LessonResponse,
)
async def update_lesson(
    lesson_id: int,
    data: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    try:
        result = LessonService.update_lesson(
            db=db,
            lesson_id=lesson_id,
            data=data,
            current_user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )

    await invalidate_lesson_cache()

    return result
