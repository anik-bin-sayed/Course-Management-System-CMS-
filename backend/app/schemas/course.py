from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.models.course import CourseType

from app.models.course import (
    CourseLanguage,
    CourseLevel,
    CourseStatus,
)


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: str
    description: str

    price: Decimal
    discount_price: Decimal | None = None

    level: CourseLevel = CourseLevel.BEGINNER
    course_type: CourseType = CourseType.FREE
    status: CourseStatus = CourseStatus.PUBLISHED
    language: CourseLanguage = CourseLanguage.BANGLA

    start_date: datetime | None = None
    end_date: datetime | None = None

    category_id: int | None = None
    instructor_ids: list[str] = Field(default_factory=list)


class CourseInstructorSummary(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)


class InstructorOption(BaseModel):
    id: str
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class CourseInstructorUpdate(BaseModel):
    instructor_ids: list[str] = Field(default_factory=list)


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str

    short_description: str
    description: str

    category: CategoryResponse

    thumbnail: str | None

    price: Decimal
    discount_price: Decimal | None
    course_type: str

    start_date: datetime | None
    end_date: datetime | None

    level: CourseLevel
    language: CourseLanguage
    status: CourseStatus

    instructors: list[CourseInstructorSummary] = Field(default_factory=list)

    total_lessons: int = 0


class CourseListResponse(BaseModel):

    data: list[CourseResponse]

    total: int
    page: int
    limit: int
    total_pages: int


class UpdateCourse(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: str
    description: str

    price: Decimal
    discount_price: Decimal | None = None

    level: CourseLevel = CourseLevel.BEGINNER
    course_type: CourseType = CourseType.FREE
    status: CourseStatus = CourseStatus.PUBLISHED
    language: CourseLanguage = CourseLanguage.BANGLA

    start_date: datetime | None = None
    end_date: datetime | None = None

    category_id: int | None = None
