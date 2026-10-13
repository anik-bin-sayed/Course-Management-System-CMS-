from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.core.dependencies import admin_instructor_required

from app.models.user import User

from app.schemas.module import (
    ModuleCreate,
    ModuleResponse,
)

from app.services.module import ModuleService

router = APIRouter(
    prefix="/courses",
    tags=["Modules"],
)


@router.post(
    "/{course_id}/modules",
    response_model=ModuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_module(
    course_id: int,
    data: ModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_instructor_required),
):
    return ModuleService.create(
        db=db,
        course_id=course_id,
        data=data,
        current_user=current_user,
    )
