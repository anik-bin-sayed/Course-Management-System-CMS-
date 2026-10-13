from datetime import datetime
from fastapi import APIRouter, Depends

from fastapi import HTTPException, UploadFile
from slugify import slugify
from sqlalchemy.orm import Session

from app.models.free_video import (
    FreeVideo,
    CourseStatus,
)
from app.models.user import User
from app.repositories.free_course import FreeCourseRepository
from app.core.dependencies import admin_instructor_required

from app.schemas.free_video import (
    FreeCourseCreate,
    FreeCourseUpdate,
)
from app.utils.cloudinary import (
    upload_image,
    delete_image,
)


class FreeCourseService:

    @staticmethod
    async def create(
        db: Session,
        data: FreeCourseCreate,
        thumbnail: UploadFile,
        current_user: User = Depends(admin_instructor_required),
    ):

        slug = slugify(data.title)

        if FreeCourseRepository.get_by_slug(db, slug):
            raise HTTPException(
                status_code=400,
                detail="Course already exists.",
            )

        image = await upload_image(
            thumbnail,
            folder="free_courses",
        )

        course_status = data.status or CourseStatus.DRAFT

        course = FreeVideo(
            title=data.title,
            slug=slug,
            short_description=data.short_description,
            description=data.description,
            language=data.language,
            duration=data.duration,
            video_url=data.video_url,
            tags=",".join(data.tags) if data.tags else None,
            thumbnail=image["secure_url"],
            thumbnail_public_id=image["public_id"],
            created_by=current_user.id,
            status=course_status,
            published_at=(
                datetime.utcnow() if course_status == CourseStatus.PUBLISHED else None
            ),
        )

        return FreeCourseRepository.create(
            db,
            course,
        )

    @staticmethod
    async def update(
        db: Session,
        course_id: int,
        data: FreeCourseUpdate,
        thumbnail: UploadFile | None,
        current_user: User = Depends(admin_instructor_required),
    ):
        course = FreeCourseRepository.get_by_id(
            db,
            course_id,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():

            if key == "tags":
                if value:
                    value = ",".join(value)
                else:
                    value = None

            setattr(course, key, value)

        # Update thumbnail
        if thumbnail:

            if course.thumbnail_public_id:
                delete_image(course.thumbnail_public_id)

            image = await upload_image(
                thumbnail,
                folder="free_courses",
            )

            course.thumbnail = image["secure_url"]
            course.thumbnail_public_id = image["public_id"]

        return FreeCourseRepository.update(
            db=db,
            course=course,
        )

    @staticmethod
    async def delete(
        db: Session,
        course_id: int,
        current_user: User = Depends(admin_instructor_required),
    ):
        course = FreeCourseRepository.get_by_id(
            db,
            course_id,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        if course.thumbnail_public_id:
            delete_image(course.thumbnail_public_id)

        FreeCourseRepository.delete(
            db,
            course,
        )

        return {"message": "Course deleted successfully."}

    @staticmethod
    def publish(
        db: Session,
        course_id: int,
    ):
        course = FreeCourseRepository.get_by_id(
            db,
            course_id,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        course.status = CourseStatus.PUBLISHED
        course.published_at = datetime.utcnow()

        return FreeCourseRepository.update(
            db,
            course,
        )

    @staticmethod
    def draft(
        db: Session,
        course_id: int,
    ):
        course = FreeCourseRepository.get_by_id(
            db,
            course_id,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        course.status = CourseStatus.DRAFT
        course.published_at = None

        return FreeCourseRepository.update(
            db,
            course,
        )

    @staticmethod
    def archive(
        db: Session,
        course_id: int,
    ):
        course = FreeCourseRepository.get_by_id(
            db,
            course_id,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        course.status = CourseStatus.ARCHIVED

        return FreeCourseRepository.update(
            db,
            course,
        )

    @staticmethod
    def get_first_eight(
        db: Session,
        limit: int = 8,
    ):
        return (
            db.query(FreeVideo)
            .filter(FreeVideo.status == CourseStatus.PUBLISHED)
            .order_by(FreeVideo.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_all(
        db: Session,
        page: int,
        limit: int,
        search: str | None = None,
    ):
        return FreeCourseRepository.get_all(
            db=db,
            page=page,
            limit=limit,
            search=search,
        )

    @staticmethod
    def get_my_courses(
        db: Session,
        current_user: User,
    ):
        if current_user.role == UserRole.ADMIN:
            return FreeCourseRepository.get_all(
                db,
            )

        return FreeCourseRepository.get_my_courses(
            db,
            current_user.id,
        )

    @staticmethod
    def get_by_slug(
        db: Session,
        slug: str,
    ):
        course = FreeCourseRepository.get_by_slug(
            db,
            slug,
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        return course
