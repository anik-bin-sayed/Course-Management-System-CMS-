from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LessonCreate(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    description: str | None = None
    position: int = Field(default=0, ge=0)
    course_id: int


class LessonUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)

    description: str | None = None

    position: int | None = Field(
        default=None,
        ge=0,
    )


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: str | None
    position: int

    video_count: int = 0
    total_duration: str = "0s"
    first_video_url: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
