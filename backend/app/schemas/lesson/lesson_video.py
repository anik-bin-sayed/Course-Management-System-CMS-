from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.utils.youtube import normalize_youtube_video_url


class LessonVideoBase(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=255,
    )

    description: str | None = None

    video_url: str = Field(
        min_length=1,
        max_length=1000,
    )

    # Duration in seconds
    duration: int = Field(
        ge=0,
    )

    position: int = Field(
        default=0,
        ge=0,
    )


class LessonVideoCreate(LessonVideoBase):
    lesson_id: int

    @field_validator("video_url")
    @classmethod
    def validate_video_url(cls, value: str) -> str:
        return normalize_youtube_video_url(value)


class LessonVideoUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = None

    video_url: str | None = Field(
        default=None,
        min_length=1,
        max_length=1000,
    )

    duration: int | None = Field(
        default=None,
        ge=0,
    )

    position: int | None = Field(
        default=None,
        ge=0,
    )

    @field_validator("video_url")
    @classmethod
    def validate_video_url(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_youtube_video_url(value)


class LessonVideoResponse(LessonVideoBase):
    id: int
    lesson_id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
