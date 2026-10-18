from datetime import datetime

from fastapi import (
    Depends,
    File,
    Form,
    UploadFile,
    Query,
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session


from app.dependencies.database import get_db

from app.models.user import User
from app.models.course import Course, CourseStatus

from app.schemas.course import (
    CourseCreate,
    CourseResponse,
    CourseListResponse,
    UpdateCourse,
    CourseInstructorSummary,
    CourseInstructorUpdate,
)
from app.schemas.module import ModuleResponse

from app.services.module import ModuleService
from app.services.course import CourseService
from app.services.course_access import CourseAccessService
from app.services.course_instructors import CourseInstructorService

from app.core.dependencies import (
    admin_instructor_required,
    admin_required,
    student_required,
    get_current_user,
)

from app.core.redis import redis_client
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


async def clear_course_cache():
    try:
        keys = await redis_client.keys("paid_course")
        if keys:
            await redis_client.delete(*keys)
            logger.info(f"Cache invalidated:{len(keys)} keys deleted")
    except Exception as e:
        logger.warning(f"Redis cache clear failed:{e}")


@router.post(
    "",
    response_model=CourseResponse,
)
async def create_course(
    title: str = Form(...),
    short_description: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    discount_price: float | None = Form(None),
    level: str = Form(...),
    language: str = Form(...),
    course_type: str = Form(...),
    status: str = Form(...),
    category_id: int = Form(...),
    instructor_ids: list[str] = Form(default=[]),
    start_date: datetime | None = Form(None),
    end_date: datetime | None = Form(None),
    thumbnail: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    data = CourseCreate(
        title=title,
        short_description=short_description,
        description=description,
        price=price,
        discount_price=discount_price,
        level=level,
        language=language,
        status=status,
        course_type=course_type,
        category_id=category_id,
        instructor_ids=instructor_ids,
        start_date=start_date,
        end_date=end_date,
    )

    result = await CourseService.create(
        db,
        data,
        thumbnail,
        current_user,
    )

    await clear_course_cache()

    return result


@router.get(
    "/instructors/{instructor_id}/courses",
    response_model=list[CourseResponse],
)
def get_instructor_courses(
    instructor_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin" and current_user.id != instructor_id:
        raise HTTPException(status_code=403, detail="Not allowed to view these courses")

    return CourseInstructorService.get_instructor_courses(db, instructor_id)


@router.get(
    "/{course_id}/instructors",
    response_model=list[CourseInstructorSummary],
)
def get_course_instructors(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    CourseAccessService.require_instructor_assignment(
        db=db,
        current_user=current_user,
        course_id=course_id,
    )
    return CourseInstructorService.get_instructors(db, course_id)


@router.put(
    "/{course_id}/instructors",
    response_model=list[CourseInstructorSummary],
)
def replace_course_instructors(
    course_id: int,
    data: CourseInstructorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return CourseInstructorService.replace_instructors(
        db=db,
        course_id=course_id,
        instructor_ids=data.instructor_ids,
    )


@router.post(
    "/{course_id}/instructors/{instructor_id}",
    response_model=list[CourseInstructorSummary],
)
def add_course_instructor(
    course_id: int,
    instructor_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return CourseInstructorService.add_instructor(
        db=db,
        course_id=course_id,
        instructor_id=instructor_id,
    )


@router.delete(
    "/{course_id}/instructors/{instructor_id}",
    response_model=list[CourseInstructorSummary],
)
def remove_course_instructor(
    course_id: int,
    instructor_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return CourseInstructorService.remove_instructor(
        db=db,
        course_id=course_id,
        instructor_id=instructor_id,
    )


#  get course data
@router.get(
    "",
    response_model=CourseListResponse,
)
async def get_courses(
    search: str | None = Query(None),
    category_id: int | None = Query(None),
    status: CourseStatus | None = Query(None),
    level: str | None = Query(None),
    language: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    cache_key_parts = [
        "paid_courses",
        search or "",
        str(category_id) if category_id else "",
        status.value if status else "",
        level or "",
        language or "",
        str(page),
        str(limit),
    ]
    cache_key = ":".join(cache_key_parts)

    try:
        cached = await redis_client.get(cache_key)
        if cached:
            logger.info(f"Cache HIT for key: {cache_key}")
            return CourseListResponse.model_validate_json(cached)
    except Exception as e:
        logger.warning(f"Redis GET failed: {e}. Falling back to DB.")

    result = CourseService.get_all(
        db=db,
        search=search,
        category_id=category_id,
        status=status,
        level=level,
        language=language,
        page=page,
        limit=limit,
    )

    try:
        if hasattr(result, "model_dump_json"):
            data_to_cache = result.model_dump_json()
        else:
            data_to_cache = json.dumps(result, default=str)
        await redis_client.set(cache_key, data_to_cache, ex=300)
        logger.info(f"Cache set for key : {cache_key}")
    except Exception as e:
        logger.warning(f"Redis set failed: {e}")

    return result


@router.get(
    "/{course_id}/modules",
    response_model=list[ModuleResponse],
)
def get_course_modules(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ModuleService.get_course_modules(
        db=db,
        course_id=course_id,
        current_user=current_user,
    )


@router.delete("/{course_id}/delete")
async def delete_paid_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    admin: User = Depends(admin_required),
):

    result = await CourseService.delete_course(
        db=db, course_id=course_id, current_user=current_user
    )

    await clear_course_cache()

    return result


@router.get("/{slug}/", response_model=CourseResponse)
async def get_course_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = await CourseService.get_by_slug(db, slug)

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Free course not found",
        )

    return course


@router.put("/{course_id}/update", response_model=CourseResponse)
async def update_course(
    course_id: int,
    title: str = Form(...),
    short_description: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    discount_price: float | None = Form(None),
    level: str = Form(...),
    language: str = Form(...),
    course_type: str = Form(...),
    status: str = Form(...),
    category_id: int = Form(...),
    start_date: datetime | None = Form(None),
    end_date: datetime | None = Form(None),
    thumbnail: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    data = UpdateCourse(
        title=title,
        short_description=short_description,
        description=description,
        price=price,
        discount_price=discount_price,
        level=level,
        language=language,
        status=status,
        course_type=course_type,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
    )

    return await CourseService.update(
        db=db,
        course_id=course_id,
        data=data,
        thumbnail=thumbnail,
        current_user=current_user,
    )


@router.get("/upcoming")
def get_upcoming_courses(
    db: Session = Depends(get_db),
):
    return CourseService.get_upcoming_courses(db)


@router.get(
    "/{course_id}",
    response_model=CourseResponse,
)
async def get_course_by_id(
    course_id: int,
    db: Session = Depends(get_db),
):
    return await CourseService.get_by_id(
        db=db,
        course_id=course_id,
    )
