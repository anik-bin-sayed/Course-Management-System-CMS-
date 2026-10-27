from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.enrollment_repository import EnrollmentRepository
from app.models.course import Course, course_instructors
from app.models.user import User


class CourseAccessService:

    @staticmethod
    def require_instructor_assignment(
        db: Session,
        current_user: User,
        course_id: int,
    ) -> None:
        course_exists = db.query(Course.id).filter(Course.id == course_id).first()
        if not course_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        if current_user.role == "admin":
            return

        if current_user.role != "instructor":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Instructor access required",
            )

        assignment = (
            db.query(course_instructors.c.course_id)
            .filter(
                course_instructors.c.course_id == course_id,
                course_instructors.c.instructor_id == current_user.id,
            )
            .first()
        )
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this course",
            )

    @staticmethod
    def require_course_read_access(
        db: Session,
        current_user: User,
        course_id: int,
    ) -> None:
        if current_user.role == "admin":
            return

        if current_user.role == "instructor":
            CourseAccessService.require_instructor_assignment(
                db=db,
                current_user=current_user,
                course_id=course_id,
            )
            return

        if current_user.role == "student":
            CourseAccessService.check_access(
                db=db,
                student_id=current_user.id,
                course_id=course_id,
            )
            return

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Course access required",
        )

    @staticmethod
    def check_access(
        db: Session,
        student_id: str,
        course_id: int,
    ):
        enrollment = EnrollmentRepository.get_active_enrollment(
            db=db,
            student_id=student_id,
            course_id=course_id,
        )

        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this course",
            )

        return enrollment
