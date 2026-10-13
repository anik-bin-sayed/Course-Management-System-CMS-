from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from app.models.lesson.lesson import Lesson
from app.models.lesson.lesson_video import LessonVideo

from app.repositories.lesson.lesson_video import (
    LessonVideoRepository,
)


from app.models.user import User

from app.core.dependencies import admin_instructor_required

from app.schemas.lesson.lesson_video import (
    LessonVideoCreate,
    LessonVideoUpdate,
)


class LessonVideoService:

    @staticmethod
    def check_manage_access(lesson: Lesson, current_user: User) -> None:
        if current_user.role == "admin":
            return

        if lesson.course.instructor_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to manage videos for this course",
            )

    @staticmethod
    def create_video(
        db: Session,
        data: LessonVideoCreate,
        current_user: User,
    ) -> LessonVideo:

        lesson = (
            db.query(Lesson)
            .filter(
                Lesson.id == data.lesson_id,
            )
            .first()
        )

        if not lesson:
            raise ValueError("Lesson not found")

        LessonVideoService.check_manage_access(lesson, current_user)

        return LessonVideoRepository.create(
            db=db,
            data=data,
        )

    @staticmethod
    def get_video_by_id(
        db: Session,
        video_id: int,
    ) -> LessonVideo:

        video = LessonVideoRepository.get_by_id(
            db=db,
            video_id=video_id,
        )

        if not video:
            raise ValueError("Lesson video not found")

        return video

    @staticmethod
    def get_lesson_videos(
        db: Session,
        lesson_id: int,
    ) -> list[LessonVideo]:

        return LessonVideoRepository.get_by_lesson_id(
            db=db,
            lesson_id=lesson_id,
        )

    @staticmethod
    def update_video(
        db: Session,
        video_id: int,
        data: LessonVideoUpdate,
        current_user: User,
    ) -> LessonVideo:

        video = LessonVideoService.get_video_by_id(
            db=db,
            video_id=video_id,
        )
        LessonVideoService.check_manage_access(video.lesson, current_user)

        return LessonVideoRepository.update(
            db=db,
            video=video,
            data=data,
        )

    @staticmethod
    def delete_video(
        db: Session,
        video_id: int,
        current_user: User,
    ) -> None:

        video = LessonVideoService.get_video_by_id(
            db=db,
            video_id=video_id,
        )
        LessonVideoService.check_manage_access(video.lesson, current_user)

        LessonVideoRepository.delete(
            db=db,
            video=video,
        )

    @staticmethod
    def get_lesson_video_stats(
        db: Session,
        lesson_id: int,
    ):

        stats = LessonVideoRepository.get_lesson_video_stats(
            db,
            lesson_id,
        )

        total_seconds = stats["total_duration"]

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60

        if hours > 0:
            duration = f"{hours}h {minutes}m {seconds}s"
        elif minutes > 0:
            duration = f"{minutes}m {seconds}s"
        else:
            duration = f"{seconds}s"

        return {
            "video_count": stats["video_count"],
            "total_duration": duration,
            "total_seconds": total_seconds,
        }
