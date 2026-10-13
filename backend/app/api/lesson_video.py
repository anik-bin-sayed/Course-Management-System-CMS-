from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.dependencies.database import get_db

from app.schemas.lesson.lesson_video import (
    LessonVideoCreate,
    LessonVideoUpdate,
    LessonVideoResponse,
)

from app.services.lesson.lesson_video import (
    LessonVideoService,
)

from app.models.user import User
from app.models.lesson.lesson import Lesson

from app.core.dependencies import admin_instructor_required, get_current_user
from app.services.course_access import CourseAccessService

router = APIRouter(
    prefix="/lesson-videos",
    tags=["Lesson Videos"],
)


@router.post(
    "/",
    response_model=LessonVideoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_video(
    data: LessonVideoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):

    try:
        return LessonVideoService.create_video(
            db=db, data=data, current_user=current_user
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.get(
    "/{video_id}",
    response_model=LessonVideoResponse,
)
def get_video_by_id(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        video = LessonVideoService.get_video_by_id(
            db=db,
            video_id=video_id,
        )

        CourseAccessService.require_course_read_access(
            db=db,
            current_user=current_user,
            course_id=video.lesson.course_id,
        )

        return video

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.get(
    "/lesson/{lesson_id}",
    response_model=list[LessonVideoResponse],
)
def get_lesson_videos(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    CourseAccessService.require_course_read_access(
        db=db,
        current_user=current_user,
        course_id=lesson.course_id,
    )

    return LessonVideoService.get_lesson_videos(
        db=db,
        lesson_id=lesson_id,
    )


@router.patch(
    "/{video_id}",
    response_model=LessonVideoResponse,
)
def update_video(
    video_id: int,
    data: LessonVideoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):

    try:
        return LessonVideoService.update_video(
            db=db,
            video_id=video_id,
            data=data,
            current_user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete(
    "/{video_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):

    try:
        LessonVideoService.delete_video(
            db=db,
            video_id=video_id,
            current_user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.get(
    "/lesson/{lesson_id}/stats",
)
def get_lesson_video_stats(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    CourseAccessService.require_course_read_access(
        db=db,
        current_user=current_user,
        course_id=lesson.course_id,
    )

    return LessonVideoService.get_lesson_video_stats(
        db,
        lesson_id,
    )
