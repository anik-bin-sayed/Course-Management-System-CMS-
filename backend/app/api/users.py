from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.core.dependencies import get_current_user, admin_required
from app.models.user import User
from app.repositories.user_repository import UserRepository

from app.schemas.user import UserResponse, UserRoleUpdate
from app.schemas.course import InstructorOption

from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/instructors", response_model=list[InstructorOption])
def get_instructors_for_assignment(
    search: str | None = Query(None),
    limit: int = Query(500, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    query = db.query(User).filter(User.role == "instructor")
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            User.name.ilike(search_term) | User.email.ilike(search_term)
        )
    return query.order_by(User.name.asc()).limit(limit).all()


@router.get("")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    admin: User = Depends(admin_required),
):
    offset = (page - 1) * limit

    users, total = UserRepository.get_all_users(
        db=db,
        offset=offset,
        limit=limit,
        search=search,
    )

    return {
        "users": users,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit,
        },
    }


# update user role
@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
async def change_user_role(
    user_id: str,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change role. User email is not verified.",
        )

    return UserService.change_role(
        db=db,
        user_id=user_id,
        role=data.role,
    )
