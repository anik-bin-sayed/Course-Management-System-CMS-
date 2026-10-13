from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.lesson.lesson import LessonCreate, LessonResponse, LessonUpdate
from app.services.lesson.lesson import LessonService

from app.core.dependencies import (
    admin_instructor_required,
    admin_required,
    get_current_user,
)
from app.models.user import User
from app.services.course_access import CourseAccessService

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)


@router.post(
    "/",
    response_model=LessonResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lesson(
    data: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    return LessonService.create_lesson(db=db, data=data, current_user=current_user)


@router.get(
    "/course/{course_id}",
    response_model=list[LessonResponse],
)
def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    CourseAccessService.require_course_read_access(
        db=db,
        current_user=current_user,
        course_id=course_id,
    )

    return LessonService.get_course_lessons(
        db,
        course_id,
    )


@router.delete(
    "/{lesson_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):

    try:
        LessonService.delete_lesson(
            db=db, lesson_id=lesson_id, current_user=current_user
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.get(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def get_lesson_by_id(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        lesson = LessonService.get_lesson_by_id(
            db=db,
            lesson_id=lesson_id,
        )

        CourseAccessService.require_course_read_access(
            db=db,
            current_user=current_user,
            course_id=lesson["course_id"],
        )

        return lesson

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.put(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def update_lesson(
    lesson_id: int,
    data: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):

    try:
        return LessonService.update_lesson(
            db=db,
            lesson_id=lesson_id,
            data=data,
            current_user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )
