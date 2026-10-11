from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.repositories.enrollment_repository import EnrollmentRepository


class EnrollmentService:

    @staticmethod
    def create(
        db: Session,
        student_id: str,
        course_id: int,
    ):

        # Check course
        course = db.query(Course).filter(Course.id == course_id).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        # Check existing enrollment
        existing = EnrollmentRepository.get_by_student_and_course(
            db=db,
            student_id=student_id,
            course_id=course_id,
        )

        if existing:

            if existing.status == EnrollmentStatus.ACTIVE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You are already enrolled in this course",
                )

            if existing.status == EnrollmentStatus.PENDING:
                if course.course_type.value == "free":
                    return EnrollmentService.activate(db=db, enrollment=existing)
                return existing

            if existing.status == EnrollmentStatus.COMPLETED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You have already completed this course",
                )

            # CANCELLED হলে আবার enrollment করার সুযোগ
            existing.status = EnrollmentStatus.PENDING
            existing.activated_at = None
            existing.completed_at = None

            db.commit()
            db.refresh(existing)

            if course.course_type.value == "free":
                return EnrollmentService.activate(db=db, enrollment=existing)

            return existing

        # Create new enrollment
        enrollment = EnrollmentRepository.create(
            db=db,
            student_id=student_id,
            course_id=course_id,
        )

        if course.course_type.value == "free":
            return EnrollmentService.activate(db=db, enrollment=enrollment)

        return enrollment

    @staticmethod
    def activate(
        db: Session,
        enrollment: Enrollment,
    ):

        enrollment.status = EnrollmentStatus.ACTIVE
        enrollment.activated_at = datetime.utcnow()

        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def complete(
        db: Session,
        enrollment: Enrollment,
    ):

        if enrollment.status != EnrollmentStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only active enrollment can be completed",
            )

        enrollment.status = EnrollmentStatus.COMPLETED
        enrollment.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(enrollment)

        return enrollment
