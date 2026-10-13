from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.course import Course, CourseStatus
from app.models.lesson import Lesson


class CourseRepository:

    @staticmethod
    def create(db: Session, course: Course):

        db.add(course)
        db.commit()
        db.refresh(course)

        return course

    @staticmethod
    def delete(
        db: Session,
        course: Course,
    ):
        db.delete(course)
        db.commit()

    @staticmethod
    def get_by_slug(db: Session, slug: str):
        return db.query(Course).filter(Course.slug == slug).first()

    @staticmethod
    def get_by_id(db: Session, course_id: int):
        return db.query(Course).filter(Course.id == course_id).first()

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        category_id: int | None = None,
        status: str | None = None,
        level: str | None = None,
        language: str | None = None,
        skip: int = 0,
        limit: int = 10,
    ):

        query = db.query(Course)

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Course.title.ilike(search_term),
                    Course.short_description.ilike(search_term),
                    Course.description.ilike(search_term),
                )
            )

        if category_id:
            query = query.filter(Course.category_id == category_id)

        if status:
            query = query.filter(Course.status == CourseStatus(status))

        if level:
            query = query.filter(Course.level == level)

        if language:
            query = query.filter(Course.language == language)

        total = query.count()

        courses = (
            query.order_by(Course.created_at.desc()).offset(skip).limit(limit).all()
        )

        return courses, total

    @staticmethod
    def update(db: Session, course: Course):
        db.add(course)
        db.commit()
        db.refresh(course)

        return course

    @staticmethod
    def get_upcoming_courses(
        db: Session,
        page: int = 1,
        limit: int = 10,
    ):
        query = (
            db.query(Course)
            .filter(
                Course.start_date.isnot(None),
                Course.start_date > datetime.now(),
            )
            .order_by(Course.start_date.asc())
        )

        total = query.count()

        courses = query.offset((page - 1) * limit).limit(limit).all()

        return courses, total

    @staticmethod
    def get_upcoming_courses_first_eight(db: Session):
        return (
            db.query(Course)
            .filter(
                Course.start_date.isnot(None),
                Course.start_date > datetime.now(),
            )
            .order_by(Course.start_date.asc())
            .limit(8)
            .all()
        )

    @staticmethod
    def get_total_lessons(
        db: Session,
        course_id: int,
    ):
        total_lessons = (
            db.query(func.count(Lesson.id))
            .filter(Lesson.course_id == course_id)
            .scalar()
        )

        return total_lessons or 0
