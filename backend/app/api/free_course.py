import json

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.free_video import FreeCourseCreate
from app.services.free_course import FreeCourseService
from app.schemas.free_video import (
    CourseLanguage,
    FreeCourseUpdate,
)
from app.models.free_video import CourseStatus
from app.core.redis import redis_client
from app.repositories.free_course import FreeCourseRepository

router = APIRouter(
    prefix="/free-courses",
    tags=["Free Courses"],
)

CACHE_TTL = 300

FIRST_EIGHT_CACHE_KEY = "free_courses:first_eight"
ALL_COURSES_CACHE_PREFIX = "free_courses:all:"
COURSE_SLUG_CACHE_PREFIX = "free_courses:slug:"


async def invalidate_free_course_cache():
    try:
        keys_to_delete = [FIRST_EIGHT_CACHE_KEY]

        async for key in redis_client.scan_iter(
            match=f"{ALL_COURSES_CACHE_PREFIX}*",
            count=100,
        ):
            keys_to_delete.append(key)

        async for key in redis_client.scan_iter(
            match=f"{COURSE_SLUG_CACHE_PREFIX}*",
            count=100,
        ):
            keys_to_delete.append(key)

        if keys_to_delete:
            await redis_client.delete(*keys_to_delete)

    except Exception:
        pass


@router.post("/")
async def create_course(
    title: str = Form(...),
    short_description: str = Form(...),
    description: str = Form(...),
    language: str = Form(...),
    video_url: str = Form(...),
    duration: str | None = Form(None),
    tags: str | None = Form(None),
    thumbnail: UploadFile = File(...),
    db: Session = Depends(get_db),
    status: CourseStatus = Form(CourseStatus.DRAFT),
    current_user: User = Depends(get_current_user),
):
    data = FreeCourseCreate(
        title=title,
        short_description=short_description,
        description=description,
        language=language,
        video_url=video_url,
        duration=duration,
        tags=tags.split(",") if tags else [],
        status=status,
    )

    result = await FreeCourseService.create(
        db=db,
        data=data,
        thumbnail=thumbnail,
        current_user=current_user,
    )

    await invalidate_free_course_cache()

    return result


@router.get("/all")
async def get_all_free_courses(
    page: int = 1,
    limit: int = 16,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    normalized_search = (search or "").strip().casefold()

    cache_key = f"{ALL_COURSES_CACHE_PREFIX}" f"{page}:{limit}:{normalized_search}"

    try:
        cached_courses = await redis_client.get(cache_key)

        if cached_courses:
            return json.loads(cached_courses)

    except Exception:
        pass

    courses = FreeCourseService.get_all(
        db=db,
        page=page,
        limit=limit,
        search=search,
    )

    try:
        cache_data = jsonable_encoder(courses)

        await redis_client.set(
            name=cache_key,
            value=json.dumps(cache_data),
            ex=CACHE_TTL,
        )

    except Exception:
        pass

    return courses


@router.patch("/{course_id}")
async def update_free_course(
    course_id: int,
    title: str | None = Form(None),
    short_description: str | None = Form(None),
    description: str | None = Form(None),
    language: str | None = Form(None),
    video_url: str | None = Form(None),
    duration: str | None = Form(None),
    tags: str | None = Form(None),
    status: CourseStatus | None = Form(None),
    thumbnail: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = FreeCourseUpdate(
        title=title,
        short_description=short_description,
        description=description,
        language=language,
        video_url=video_url,
        duration=duration,
        tags=tags.split(",") if tags is not None else None,
        status=status,
    )

    result = await FreeCourseService.update(
        db=db,
        course_id=course_id,
        data=data,
        thumbnail=thumbnail,
        current_user=current_user,
    )

    await invalidate_free_course_cache()

    return result


@router.delete("/{course_id}")
async def delete_free_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await FreeCourseService.delete(
        db=db,
        course_id=course_id,
        current_user=current_user,
    )

    await invalidate_free_course_cache()

    return result


@router.get("/{slug}")
async def get_course_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    cache_key = f"{COURSE_SLUG_CACHE_PREFIX}{slug}"

    try:
        cached_course = await redis_client.get(cache_key)

        if cached_course:
            return json.loads(cached_course)

    except Exception:
        pass

    course = FreeCourseRepository.get_by_slug(
        db=db,
        slug=slug,
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Free course not found",
        )

    try:
        cache_data = jsonable_encoder(course)

        await redis_client.set(
            name=cache_key,
            value=json.dumps(cache_data),
            ex=CACHE_TTL,
        )

    except Exception:
        pass

    return course
