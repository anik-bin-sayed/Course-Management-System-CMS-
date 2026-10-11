import unittest
from pydantic import ValidationError
from sqlalchemy import String

from app.models.lesson.lesson import Lesson
from app.models.lesson.lesson_video import LessonVideo
from app.schemas.lesson.lesson_video import LessonVideoCreate, LessonVideoUpdate
from app.utils.youtube import extract_youtube_video_id


VIDEO_ID = "dQw4w9WgXcQ"
CANONICAL_URL = f"https://www.youtube.com/watch?v={VIDEO_ID}"


class YoutubeVideoUrlTests(unittest.TestCase):
    def test_create_video_normalizes_supported_youtube_urls(self):
        supported_urls = [
        CANONICAL_URL,
        f"https://youtu.be/{VIDEO_ID}",
        f"https://www.youtube.com/embed/{VIDEO_ID}",
        f"https://www.youtube.com/shorts/{VIDEO_ID}",
        ]
        for video_url in supported_urls:
            with self.subTest(video_url=video_url):
                video = LessonVideoCreate(
                    title="A YouTube lesson",
                    video_url=video_url,
                    duration=60,
                    lesson_id=1,
                )

                self.assertEqual(video.video_url, CANONICAL_URL)
                self.assertEqual(extract_youtube_video_id(video.video_url), VIDEO_ID)

    def test_create_video_rejects_invalid_youtube_urls(self):
        invalid_urls = [
        "https://youtube.com.attacker.example/watch?v=dQw4w9WgXcQ",
        "https://user@www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com:8443/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=short",
        "javascript://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://vimeo.com/123456789",
        ]
        for video_url in invalid_urls:
            with self.subTest(video_url=video_url):
                with self.assertRaises(ValidationError):
                    LessonVideoCreate(
                        title="A YouTube lesson",
                        video_url=video_url,
                        duration=60,
                        lesson_id=1,
                    )

    def test_video_less_update_does_not_require_a_video_url(self):
        self.assertIsNone(LessonVideoUpdate(title="Updated title").video_url)

    def test_update_video_normalizes_a_replacement_url(self):
        update = LessonVideoUpdate(video_url=f"https://youtu.be/{VIDEO_ID}")

        self.assertEqual(update.video_url, CANONICAL_URL)

    def test_owner_columns_match_the_existing_string_uuid_migration(self):
        self.assertIsInstance(Lesson.__table__.c.user_id.type, String)
        self.assertIsInstance(LessonVideo.__table__.c.user_id.type, String)