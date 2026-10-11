from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db

from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentResponse,
    MyEnrollmentResponse,
)
from app.repositories.enrollment_repository import EnrollmentRepository
from app.services.enrollment_service import EnrollmentService
from app.core.dependencies import (
    student_required,
)

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"],
)


@router.get(
    "/me",
    response_model=list[MyEnrollmentResponse],
)
def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):
    return EnrollmentRepository.get_by_student(
        db=db,
        student_id=current_user.id,
    )


@router.post(
    "",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_enrollment(
    data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):

    enrollment = EnrollmentService.create(
        db=db,
        student_id=current_user.id,
        course_id=data.course_id,
    )

    return enrollment


@router.get(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
)
def get_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(student_required),
):

    from fastapi import HTTPException

    from app.repositories.enrollment import EnrollmentRepository

    enrollment = EnrollmentRepository.get_by_id(
        db=db,
        enrollment_id=enrollment_id,
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found",
        )

    if enrollment.student_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this enrollment",
        )

    return enrollment
