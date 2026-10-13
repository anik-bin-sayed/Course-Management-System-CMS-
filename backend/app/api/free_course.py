from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
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
from app.core.dependencies import admin_instructor_required
from app.repositories.free_course import FreeCourseRepository

router = APIRouter(
    prefix="/free-courses",
    tags=["Free Courses"],
)


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
    print("STATUS FROM POSTMAN:", status)
    print("STATUS VALUE:", status.value)

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

    return await FreeCourseService.create(
        db=db,
        data=data,
        thumbnail=thumbnail,
        current_user=current_user,
    )


@router.get("/")
def get_free_courses(
    db: Session = Depends(get_db),
):
    return FreeCourseService.get_first_eight(db)


@router.get("/all")
def get_all_free_courses(
    page: int = 1,
    limit: int = 16,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    return FreeCourseService.get_all(
        db=db,
        page=page,
        limit=limit,
        search=search,
    )


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
        tags=tags.split(",") if tags else None,
        status=status,
    )

    return await FreeCourseService.update(
        db=db,
        course_id=course_id,
        data=data,
        thumbnail=thumbnail,
        current_user=current_user,
    )


@router.delete("/{course_id}")
async def delete_free_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await FreeCourseService.delete(
        db=db,
        course_id=course_id,
        current_user=current_user,
    )


@router.get("/{slug}")
def get_course_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    course = FreeCourseRepository.get_by_slug(
        db=db,
        slug=slug,
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Free course not found",
        )

    return course
