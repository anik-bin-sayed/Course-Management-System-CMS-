from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enrollment import EnrollmentStatus
from app.models.payment import PaymentStatus
from app.models.course import CourseLevel


class EnrollmentCreate(BaseModel):
    course_id: int


class EnrollmentResponse(BaseModel):
    id: int
    student_id: str
    course_id: int
    status: EnrollmentStatus
    enrolled_at: datetime
    activated_at: datetime | None = None
    completed_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class EnrollmentCategorySummary(BaseModel):
    name: str


class EnrollmentInstructorSummary(BaseModel):
    name: str


class EnrollmentCourseSummary(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    short_description: str
    thumbnail: str | None = None
    price: Decimal
    discount_price: Decimal | None = None
    course_type: str
    level: CourseLevel
    start_date: datetime | None = None
    end_date: datetime | None = None
    category: EnrollmentCategorySummary
    instructor: EnrollmentInstructorSummary = Field(validation_alias="user")

    model_config = ConfigDict(from_attributes=True)


class EnrollmentPaymentSummary(BaseModel):
    id: int
    amount: Decimal
    status: PaymentStatus
    paid_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class MyEnrollmentResponse(EnrollmentResponse):
    course: EnrollmentCourseSummary
    payment: EnrollmentPaymentSummary | None = None
    completed_lessons: int = 0
    total_lessons: int = 0
    completed_videos: int = 0
    total_videos: int = 0
    progress_percentage: int = 0
