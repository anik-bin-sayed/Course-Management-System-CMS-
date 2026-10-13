from sqlalchemy import or_
from sqlalchemy.orm import Session

from math import ceil

from app.models.free_video import FreeVideo, CourseStatus


class FreeCourseRepository:
    @staticmethod
    def create(db: Session, course: FreeVideo):
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def get_all(
        db: Session,
        page: int = 1,
        limit: int = 9,
        search: str | None = None,
    ):
        query = db.query(FreeVideo).filter(FreeVideo.status == CourseStatus.PUBLISHED)

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    FreeVideo.title.ilike(search_term),
                    FreeVideo.short_description.ilike(search_term),
                    FreeVideo.description.ilike(search_term),
                    FreeVideo.tags.ilike(search_term),
                )
            )

        total = query.count()

        courses = (
            query.order_by(FreeVideo.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return {
            "data": courses,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": ceil(total / limit),
            "has_next": page < ceil(total / limit),
            "has_previous": page > 1,
        }

    @staticmethod
    def get_all_published(
        db: Session,
        skip: int = 0,
        limit: int = 10,
    ):
        return (
            db.query(FreeVideo)
            .filter(FreeVideo.status == CourseStatus.PUBLISHED)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        course_id: int,
    ):
        return db.query(FreeVideo).filter(FreeVideo.id == course_id).first()

    @staticmethod
    def get_by_slug(
        db: Session,
        slug: str,
    ):
        return db.query(FreeVideo).filter(FreeVideo.slug == slug).first()

    @staticmethod
    def get_by_title(
        db: Session,
        title: str,
    ):
        return db.query(FreeVideo).filter(FreeVideo.title == title).first()

    @staticmethod
    def get_my_courses(
        db: Session,
        user_id: str,
    ):
        return db.query(FreeVideo).filter(FreeVideo.created_by == user_id).all()

    @staticmethod
    def update(
        db: Session,
        course: FreeVideo,
    ):
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def delete(
        db: Session,
        course: FreeVideo,
    ):
        db.delete(course)
        db.commit()

    @staticmethod
    def publish(
        db: Session,
        course: FreeVideo,
    ):
        course.status = CourseStatus.PUBLISHED

        db.commit()
        db.refresh(course)

        return course

    @staticmethod
    def draft(
        db: Session,
        course: FreeVideo,
    ):
        course.status = CourseStatus.DRAFT

        db.commit()
        db.refresh(course)

        return course

    @staticmethod
    def archive(
        db: Session,
        course: FreeVideo,
    ):
        course.status = CourseStatus.ARCHIVED

        db.commit()
        db.refresh(course)

        return course
