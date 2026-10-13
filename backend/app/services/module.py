from fastapi import HTTPException, status

from sqlalchemy.orm import Session

from app.models.module import Module

from app.repositories.module import ModuleRepository
from app.services.course_access import CourseAccessService
from app.repositories.course_repository import CourseRepository
from app.services.course_access import CourseAccessService
from app.models.user import User


class ModuleService:

    @staticmethod
    def create(db: Session, course_id: int, data, current_user: User):
        course = CourseRepository.get_by_id(db, course_id)

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        CourseAccessService.require_instructor_assignment(
            db=db,
            current_user=current_user,
            course_id=course_id,
        )

        module = Module(
            title=data.title,
            description=data.description,
            position=data.position,
            course_id=course_id,
        )

        return ModuleRepository.create(
            db,
            module,
        )

    @staticmethod
    def get_course_modules(
        db: Session,
        course_id: int,
        current_user: User,
    ):
        CourseAccessService.require_course_read_access(
            db=db,
            current_user=current_user,
            course_id=course_id,
        )

        return ModuleRepository.get_by_course(
            db=db,
            course_id=course_id,
        )
