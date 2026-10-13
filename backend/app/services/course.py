from fastapi import HTTPException, UploadFile, Depends

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.course import Course, CourseStatus
from app.repositories.category_repository import CategoryRepository
from app.repositories.course_repository import CourseRepository
from app.utils.slug import generate_slug

from app.schemas.course import CourseCreate, UpdateCourse, CourseResponse
from app.utils.cloudinary import upload_image, delete_image
from app.core.dependencies import admin_instructor_required
from app.services.course_access import CourseAccessService
from app.services.course_instructors import CourseInstructorService


class CourseService:

    @staticmethod
    async def create(
        db: Session,
        data: CourseCreate,
        thumbnail: UploadFile,
        current_user: User,
    ):
        if not data.category_id:
            raise HTTPException(
                status_code=404,
                detail="Category not define.",
            )

        # Check category
        category = CategoryRepository.get_by_id(
            db,
            data.category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        # Validate discount price
        if data.discount_price is not None and data.discount_price > data.price:
            raise HTTPException(
                status_code=400,
                detail="Discount price cannot be greater than price.",
            )

        instructor_ids = data.instructor_ids
        if current_user.role == "instructor":
            if instructor_ids and set(instructor_ids) != {current_user.id}:
                raise HTTPException(
                    status_code=403,
                    detail="Instructors cannot assign other instructors",
                )
            instructor_ids = [current_user.id]

        instructors = CourseInstructorService.resolve_instructors(
            db=db,
            instructor_ids=instructor_ids,
        )

        # Generate slug
        slug = generate_slug(data.title)

        # Check duplicate course
        if CourseRepository.get_by_slug(db, slug):
            raise HTTPException(
                status_code=400,
                detail="Course already exists.",
            )

        # Upload thumbnail
        image = None

        if thumbnail:
            image = await upload_image(
                thumbnail,
                folder="courses",
            )

        # Create course
        course = Course(
            title=data.title,
            slug=slug,
            short_description=data.short_description,
            description=data.description,
            price=data.price,
            discount_price=data.discount_price,
            level=data.level,
            language=data.language,
            course_type=data.course_type,
            status=data.status,
            category_id=data.category_id,
            instructor_id=current_user.id,
            instructors=instructors,
            start_date=data.start_date,
            end_date=data.end_date,
            thumbnail=image["secure_url"] if image else None,
            thumbnail_public_id=image["public_id"] if image else None,
        )

        return CourseRepository.create(
            db,
            course,
        )

    @staticmethod
    def get_all(
        db,
        search=None,
        category_id=None,
        status=None,
        level=None,
        language=None,
        page=1,
        limit=10,
    ):

        skip = (page - 1) * limit

        courses, total = CourseRepository.get_all(
            db=db,
            search=search,
            category_id=category_id,
            status=status,
            level=level,
            language=language,
            skip=skip,
            limit=limit,
        )

        return {
            "data": courses,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
        }

    @staticmethod
    async def delete_course(
        db: Session,
        course_id: int,
        current_user: User = Depends(admin_instructor_required),
    ):
        course = CourseRepository.get_by_id(db, course_id)

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        if course.thumbnail_public_id:
            delete_image(course.thumbnail_public_id)

        CourseRepository.delete(
            db,
            course,
        )

        return {"message": "Course deleted successfully."}

    @staticmethod
    async def get_by_slug(db: Session, slug: str):
        course = CourseRepository.get_by_slug(db, slug)
        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        return course

    @staticmethod
    async def update(
        db: Session,
        course_id: int,
        data: UpdateCourse,
        thumbnail: UploadFile | None,
        current_user: User,
    ):
        course = CourseRepository.get_by_id(db, course_id)

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        CourseAccessService.require_instructor_assignment(
            db=db,
            current_user=current_user,
            course_id=course.id,
        )

        if not data.category_id:
            raise HTTPException(
                status_code=400,
                detail="Category not defined.",
            )

        category = CategoryRepository.get_by_id(
            db,
            data.category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found.",
            )

        if data.discount_price is not None and data.discount_price > data.price:
            raise HTTPException(
                status_code=400,
                detail="Discount price cannot be greater than price.",
            )

        if thumbnail:
            image = await upload_image(
                thumbnail,
                folder="courses",
            )

            course.thumbnail = image["secure_url"]
            course.thumbnail_public_id = image["public_id"]

        course.title = data.title
        course.short_description = data.short_description
        course.description = data.description
        course.price = data.price
        course.discount_price = data.discount_price
        course.level = data.level
        course.language = data.language
        course.course_type = data.course_type
        course.status = data.status
        course.category_id = data.category_id
        course.start_date = data.start_date
        course.end_date = data.end_date

        return CourseRepository.update(
            db,
            course,
        )

    @staticmethod
    def get_upcoming_courses(
        db: Session,
        page: int = 1,
        limit: int = 10,
    ):
        courses, total = CourseRepository.get_upcoming_courses(
            db=db,
            page=page,
            limit=limit,
        )

        return {
            "data": courses,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
        }

    @staticmethod
    def get_upcoming_courses(db: Session):
        return CourseRepository.get_upcoming_courses_first_eight(db)

    @staticmethod
    async def get_by_id(
        db: Session,
        course_id: int,
    ):

        # First find course
        course = CourseRepository.get_by_id(
            db,
            course_id,
        )

        # If course doesn't exist
        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found.",
            )

        # Count total lessons
        total_lessons = CourseRepository.get_total_lessons(
            db,
            course_id,
        )

        # Convert SQLAlchemy object to Pydantic response
        response = CourseResponse.model_validate(course)

        # Add total lessons
        response.total_lessons = total_lessons

        return response
