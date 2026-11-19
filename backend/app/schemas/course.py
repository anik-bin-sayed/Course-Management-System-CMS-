from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime

from app.models.course import CourseType

from app.models.course import (
    CourseLanguage,
    CourseLevel,
    CourseStatus,
)


def normalize_learning_outcomes(value):
    if value is None:
        return None
    if isinstance(value, str):
        value = [value]
    outcomes = [item.strip() for item in value if isinstance(item, str) and item.strip()]
    if len(outcomes) > 20:
        raise ValueError("A course can have at most 20 learning outcomes.")
    if any(len(item) > 200 for item in outcomes):
        raise ValueError("Each learning outcome must be 200 characters or fewer.")
    return outcomes


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: str
    description: str
    learning_outcomes: list[str] = Field(default_factory=list)

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

    @field_validator("learning_outcomes", mode="before")
    @classmethod
    def clean_learning_outcomes(cls, value):
        return normalize_learning_outcomes(value) or []


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
    learning_outcomes: list[str] = Field(default_factory=list)

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
    learning_outcomes: list[str] | None = None

    price: Decimal
    discount_price: Decimal | None = None

    level: CourseLevel = CourseLevel.BEGINNER
    course_type: CourseType = CourseType.FREE
    status: CourseStatus = CourseStatus.PUBLISHED
    language: CourseLanguage = CourseLanguage.BANGLA

    start_date: datetime | None = None
    end_date: datetime | None = None

    category_id: int | None = None

    @field_validator("learning_outcomes", mode="before")
    @classmethod
    def clean_learning_outcomes(cls, value):
        return normalize_learning_outcomes(value)
