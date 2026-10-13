from datetime import datetime, date

from uuid import uuid4
from sqlalchemy import (
    String,
    Boolean,
    Date,
    DateTime,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid4()),
    )
    name: Mapped[str] = mapped_column(String(100))
    username: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=True,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(
        String(20),
        default="student",
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    verification_code: Mapped[str | None] = mapped_column(
        String(6),
        nullable=True,
    )
    verification_code_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    avatar: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    gender: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    date_of_birth: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    country: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    github: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    linkedin: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    courses = relationship(
        "Course",
        back_populates="user",
    )

    assigned_courses = relationship(
        "Course",
        secondary="course_instructors",
        back_populates="instructors",
    )

    refresh_token: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    free_courses = relationship(
        "FreeVideo",
        back_populates="creator",
        cascade="all, delete-orphan",
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="student",
        cascade="all, delete-orphan",
    )

    lessons: Mapped[list["Lesson"]] = relationship(
        "Lesson",
        back_populates="user",
    )
    lessons: Mapped[list["LessonVideo"]] = relationship(
        "LessonVideo",
        back_populates="user",
    )
