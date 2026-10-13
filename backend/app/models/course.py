from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

course_instructors = Table(
    "course_instructors",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column(
        "course_id",
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    ),
    Column(
        "instructor_id",
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    ),
    Column("created_at", DateTime, default=datetime.utcnow, nullable=False),
    UniqueConstraint(
        "course_id",
        "instructor_id",
        name="uq_course_instructors_course_instructor",
    ),
)


class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class CourseLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class CourseLanguage(str, Enum):
    BANGLA = "bangla"
    ENGLISH = "english"


class CourseType(str, Enum):
    FREE = "free"
    PAID = "paid"


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    short_description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    thumbnail: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    thumbnail_public_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    discount_price: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    level: Mapped[CourseLevel] = mapped_column(
        SqlEnum(CourseLevel),
        default=CourseLevel.BEGINNER,
    )

    language: Mapped[CourseLanguage] = mapped_column(
        SqlEnum(CourseLanguage),
        default=CourseLanguage.BANGLA,
    )

    status: Mapped[CourseStatus] = mapped_column(
        SqlEnum(CourseStatus),
        default=CourseStatus.DRAFT,
    )

    course_type: Mapped[CourseType] = mapped_column(
        SqlEnum(CourseType),
        default=CourseType.FREE,
        nullable=False,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey(
            "categories.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    instructor_id: Mapped[str] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    start_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    end_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    category = relationship(
        "Category",
        back_populates="courses",
    )

    user = relationship(
        "User",
        back_populates="courses",
    )

    modules = relationship(
        "Module",
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Module.position",
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="course",
        cascade="all, delete-orphan",
    )

    lessons: Mapped[list["Lesson"]] = relationship(
        "Lesson",
        back_populates="course",
        cascade="all, delete-orphan",
    )

    instructors: Mapped[list["User"]] = relationship(
        "User",
        secondary=course_instructors,
        back_populates="assigned_courses",
    )
