from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.user import User
from app.repositories.course_repository import CourseRepository


class CourseInstructorService:
    @staticmethod
    def resolve_instructors(db: Session, instructor_ids: list[str]) -> list[User]:
        if len(instructor_ids) != len(set(instructor_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate instructor IDs are not allowed",
            )

        if not instructor_ids:
            return []

        users = db.query(User).filter(User.id.in_(instructor_ids)).all()
        users_by_id = {user.id: user for user in users}
        missing_ids = [
            user_id for user_id in instructor_ids if user_id not in users_by_id
        ]
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Instructor IDs not found: {', '.join(missing_ids)}",
            )

        invalid_ids = [
            user_id
            for user_id in instructor_ids
            if users_by_id[user_id].role != "instructor"
        ]
        if invalid_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Users are not instructors: {', '.join(invalid_ids)}",
            )

        return [users_by_id[user_id] for user_id in instructor_ids]

    @staticmethod
    def _get_course(db: Session, course_id: int) -> Course:
        course = CourseRepository.get_by_id(db, course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        return course

    @staticmethod
    def replace_instructors(
        db: Session,
        course_id: int,
        instructor_ids: list[str],
    ) -> list[User]:
        course = CourseInstructorService._get_course(db, course_id)
        course.instructors = CourseInstructorService.resolve_instructors(
            db=db,
            instructor_ids=instructor_ids,
        )
        try:
            db.commit()
        except IntegrityError as error:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Instructor assignments changed concurrently; retry the request",
            ) from error
        db.refresh(course)
        return course.instructors

    @staticmethod
    def add_instructor(
        db: Session,
        course_id: int,
        instructor_id: str,
    ) -> list[User]:
        course = CourseInstructorService._get_course(db, course_id)
        instructor = CourseInstructorService.resolve_instructors(db, [instructor_id])[0]
        if any(user.id == instructor_id for user in course.instructors):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Instructor is already assigned to this course",
            )

        course.instructors.append(instructor)
        try:
            db.commit()
        except IntegrityError as error:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Instructor is already assigned to this course",
            ) from error
        db.refresh(course)
        return course.instructors

    @staticmethod
    def remove_instructor(
        db: Session,
        course_id: int,
        instructor_id: str,
    ) -> list[User]:
        course = CourseInstructorService._get_course(db, course_id)
        instructor = next(
            (user for user in course.instructors if user.id == instructor_id),
            None,
        )
        if instructor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor is not assigned to this course",
            )

        course.instructors.remove(instructor)
        db.commit()
        db.refresh(course)
        return course.instructors

    @staticmethod
    def get_instructors(db: Session, course_id: int) -> list[User]:
        return CourseInstructorService._get_course(db, course_id).instructors

    @staticmethod
    def get_instructor_courses(db: Session, instructor_id: str) -> list[Course]:
        instructor = db.query(User).filter(User.id == instructor_id).first()
        if not instructor or instructor.role != "instructor":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor not found",
            )
        return instructor.assigned_courses
