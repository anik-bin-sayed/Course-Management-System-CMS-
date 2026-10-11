from datetime import datetime
from decimal import Decimal
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import app.models
from app.db.base_class import Base
from app.models.category import Category
from app.models.course import (
    Course,
    CourseLanguage,
    CourseLevel,
    CourseStatus,
    CourseType,
)
from app.models.lesson.lesson import Lesson
from app.models.lesson.lesson_video import LessonVideo
from app.models.user import User
from app.repositories.lesson.lesson import LessonRepository
from app.services.lesson.lesson import LessonService


class LessonPlaylistQueryTests(unittest.TestCase):
    def test_course_lessons_include_ordered_first_video_without_extra_queries(self):
        engine = create_engine("sqlite://")
        Base.metadata.create_all(engine)
        session = Session(engine)
        try:
            instructor = User(
                id="instructor-1",
                name="Instructor",
                email="instructor@example.test",
                password="not-used",
                role="instructor",
            )
            category = Category(name="Development", slug="development")
            course = Course(
                title="React Foundations",
                slug="react-foundations",
                short_description="React basics",
                description="Learn React basics",
                price=Decimal("0.00"),
                level=CourseLevel.BEGINNER,
                language=CourseLanguage.ENGLISH,
                status=CourseStatus.PUBLISHED,
                course_type=CourseType.FREE,
                category=category,
                user=instructor,
                start_date=datetime(2026, 1, 1),
            )
            lesson_without_video = Lesson(title="Setup", position=0, course=course)
            lesson_with_videos = Lesson(title="Components", position=1, course=course)
            first_video = LessonVideo(
                title="Composition",
                video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                duration=120,
                position=0,
                lesson=lesson_with_videos,
            )
            later_video = LessonVideo(
                title="Props",
                video_url="https://www.youtube.com/watch?v=9bZkp7q19f0",
                duration=180,
                position=1,
                lesson=lesson_with_videos,
            )
            session.add_all(
                [
                    instructor,
                    category,
                    course,
                    lesson_without_video,
                    lesson_with_videos,
                    first_video,
                    later_video,
                ]
            )
            session.flush()

            rows = LessonRepository.get_by_course_id(session, course.id)

            self.assertEqual([row[0].title for row in rows], ["Setup", "Components"])
            self.assertIsNone(rows[0][3])
            self.assertEqual(rows[1][1], 2)
            self.assertEqual(rows[1][2], 300)
            self.assertEqual(rows[1][3], first_video.video_url)
        finally:
            session.close()
            engine.dispose()

    def test_lesson_detail_returns_course_and_video_statistics(self):
        engine = create_engine("sqlite://")
        Base.metadata.create_all(engine)
        session = Session(engine)
        try:
            instructor = User(
                id="instructor-2",
                name="Instructor",
                email="instructor2@example.test",
                password="not-used",
                role="instructor",
            )
            category = Category(name="Design", slug="design")
            course = Course(
                title="Design Systems",
                slug="design-systems",
                short_description="Design basics",
                description="Learn design systems",
                price=Decimal("0.00"),
                level=CourseLevel.BEGINNER,
                language=CourseLanguage.ENGLISH,
                status=CourseStatus.PUBLISHED,
                course_type=CourseType.FREE,
                category=category,
                user=instructor,
                start_date=datetime(2026, 1, 1),
            )
            lesson = Lesson(title="Tokens", position=0, course=course)
            session.add_all([instructor, category, course, lesson])
            session.flush()
            session.add(
                LessonVideo(
                    title="Color tokens",
                    video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    duration=125,
                    position=0,
                    lesson=lesson,
                )
            )
            session.commit()

            result = LessonService.get_lesson_by_id(session, lesson.id)

            self.assertEqual(result["id"], lesson.id)
            self.assertEqual(result["course_id"], course.id)
            self.assertEqual(result["video_count"], 1)
            self.assertEqual(result["total_seconds"], 125)
            self.assertEqual(result["total_duration"], "2m 5s")
        finally:
            session.close()
            engine.dispose()


if __name__ == "__main__":
    unittest.main()
