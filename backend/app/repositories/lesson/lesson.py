from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User

from app.models.lesson import Lesson, LessonVideo
from app.schemas.lesson.lesson import LessonCreate, LessonUpdate


class LessonRepository:
    @staticmethod
    def create(db: Session, data: LessonCreate, current_user: User) -> Lesson:
        lesson = Lesson(
            title=data.title,
            description=data.description,
            position=data.position,
            course_id=data.course_id,
            user_id=current_user.id,
        )

        db.add(lesson)
        db.commit()
        db.refresh(lesson)

        return lesson

    @staticmethod
    def get_by_course_id(
        db: Session,
        course_id: int,
    ) -> list[Lesson]:
        first_video_url = (
            db.query(LessonVideo.video_url)
            .filter(LessonVideo.lesson_id == Lesson.id)
            .order_by(LessonVideo.position.asc(), LessonVideo.id.asc())
            .limit(1)
            .correlate(Lesson)
            .scalar_subquery()
        )

        return (
            db.query(
                Lesson,
                func.count(LessonVideo.id).label("video_count"),
                func.coalesce(
                    func.sum(LessonVideo.duration),
                    0,
                ).label("total_seconds"),
                first_video_url.label("first_video_url"),
            )
            .outerjoin(
                LessonVideo,
                LessonVideo.lesson_id == Lesson.id,
            )
            .filter(
                Lesson.course_id == course_id,
            )
            .group_by(Lesson.id)
            .order_by(Lesson.position.asc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        lesson_id: int,
    ):
        return db.query(Lesson).filter(Lesson.id == lesson_id).first()

    @staticmethod
    def get_by_id_with_video_stats(
        db: Session,
        lesson_id: int,
    ):
        return (
            db.query(
                Lesson,
                func.count(LessonVideo.id).label("video_count"),
                func.coalesce(func.sum(LessonVideo.duration), 0).label("total_seconds"),
            )
            .outerjoin(LessonVideo, LessonVideo.lesson_id == Lesson.id)
            .filter(Lesson.id == lesson_id)
            .group_by(Lesson.id)
            .first()
        )

    @staticmethod
    def delete(db: Session, lesson: Lesson) -> None:
        db.delete(lesson)
        db.commit()

    @staticmethod
    def update(
        db: Session,
        lesson: Lesson,
        data: LessonUpdate,
    ) -> Lesson:

        update_data = data.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(
                lesson,
                field,
                value,
            )

        db.commit()
        db.refresh(lesson)

        return lesson
