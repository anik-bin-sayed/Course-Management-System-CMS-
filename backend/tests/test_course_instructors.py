import asyncio
from datetime import datetime
from decimal import Decimal
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import app.models
from app.core.dependencies import admin_required
from app.db.base_class import Base
from app.models.category import Category
from app.models.course import (
    Course,
    CourseLanguage,
    CourseLevel,
    CourseStatus,
    CourseType,
)
from app.models.user import User
from app.schemas.course import CourseCreate
from app.services.course_access import CourseAccessService
from app.services.course import CourseService
from app.services.course_instructors import CourseInstructorService
from app.services.user_service import UserService


class CourseInstructorTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)

        self.admin = self._user("admin", "admin")
        self.creator = self._user("creator", "instructor")
        self.assigned = self._user("assigned", "instructor")
        self.other = self._user("other", "instructor")
        self.student = self._user("student", "student")
        category = Category(name="Development", slug="development")
        self.course = Course(
            title="Python Programming",
            slug="python-programming",
            short_description="Python basics",
            description="Learn Python",
            price=Decimal("10.00"),
            level=CourseLevel.BEGINNER,
            language=CourseLanguage.ENGLISH,
            status=CourseStatus.PUBLISHED,
            course_type=CourseType.PAID,
            category=category,
            instructor_id=self.creator.id,
            user=self.creator,
            instructors=[self.assigned],
            start_date=datetime(2026, 1, 1),
        )
        self.db.add_all(
            [
                self.admin,
                self.creator,
                self.assigned,
                self.other,
                self.student,
                category,
                self.course,
            ]
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    @staticmethod
    def _user(user_id: str, role: str) -> User:
        return User(
            id=user_id,
            name=user_id.title(),
            email=f"{user_id}@example.test",
            password="not-used",
            role=role,
        )

    def test_replacement_supports_multiple_and_zero_instructors(self):
        assigned = CourseInstructorService.replace_instructors(
            self.db,
            self.course.id,
            [self.assigned.id, self.other.id],
        )
        self.assertEqual({user.id for user in assigned}, {"assigned", "other"})

        unassigned = CourseInstructorService.replace_instructors(
            self.db,
            self.course.id,
            [],
        )
        self.assertEqual(unassigned, [])
        self.assertEqual(self.course.instructor_id, self.creator.id)

    def test_course_creation_keeps_creator_separate_from_assignments(self):
        admin_course = asyncio.run(
            CourseService.create(
                self.db,
                CourseCreate(
                    title="Admin Created Course",
                    short_description="Admin course",
                    description="Created by an admin",
                    price=Decimal("0.00"),
                    category_id=self.course.category_id,
                    start_date=datetime(2026, 1, 1),
                ),
                None,
                self.admin,
            )
        )
        self.assertEqual(admin_course.instructor_id, self.admin.id)
        self.assertEqual(admin_course.instructors, [])

        instructor_course = asyncio.run(
            CourseService.create(
                self.db,
                CourseCreate(
                    title="Instructor Created Course",
                    short_description="Instructor course",
                    description="Created by an instructor",
                    price=Decimal("0.00"),
                    category_id=self.course.category_id,
                    start_date=datetime(2026, 1, 1),
                ),
                None,
                self.other,
            )
        )
        self.assertEqual(
            [user.id for user in instructor_course.instructors],
            [self.other.id],
        )

    def test_rejects_duplicate_and_non_instructor_ids(self):
        with self.assertRaises(HTTPException) as duplicate_error:
            CourseInstructorService.replace_instructors(
                self.db,
                self.course.id,
                [self.assigned.id, self.assigned.id],
            )
        self.assertEqual(duplicate_error.exception.status_code, 400)

        with self.assertRaises(HTTPException) as role_error:
            CourseInstructorService.replace_instructors(
                self.db,
                self.course.id,
                [self.student.id],
            )
        self.assertEqual(role_error.exception.status_code, 400)

        with self.assertRaises(HTTPException) as missing_error:
            CourseInstructorService.replace_instructors(
                self.db,
                self.course.id,
                ["missing-instructor"],
            )
        self.assertEqual(missing_error.exception.status_code, 400)

    def test_only_assigned_instructors_and_admins_can_manage_course(self):
        CourseAccessService.require_instructor_assignment(
            self.db,
            self.assigned,
            self.course.id,
        )
        CourseAccessService.require_instructor_assignment(
            self.db,
            self.admin,
            self.course.id,
        )
        with self.assertRaises(HTTPException) as access_error:
            CourseAccessService.require_instructor_assignment(
                self.db,
                self.other,
                self.course.id,
            )
        self.assertEqual(access_error.exception.status_code, 403)

    def test_admin_dependency_rejects_instructor_assignment_changes(self):
        for non_admin in (self.assigned, self.student):
            with self.subTest(role=non_admin.role):
                with self.assertRaises(HTTPException) as access_error:
                    admin_required(non_admin)
                self.assertEqual(access_error.exception.status_code, 403)

    def test_changing_user_out_of_instructor_role_clears_assignments(self):
        UserService.change_role(self.db, self.assigned.id, "student")
        self.assertEqual(self.assigned.assigned_courses, [])
        self.assertEqual(self.course.instructors, [])

    def test_add_remove_assignment_and_instructor_course_lookup(self):
        with self.assertRaises(HTTPException) as duplicate_error:
            CourseInstructorService.add_instructor(
                self.db,
                self.course.id,
                self.assigned.id,
            )
        self.assertEqual(duplicate_error.exception.status_code, 409)

        CourseInstructorService.add_instructor(
            self.db,
            self.course.id,
            self.other.id,
        )
        self.assertEqual(
            [
                course.id
                for course in CourseInstructorService.get_instructor_courses(
                    self.db,
                    self.other.id,
                )
            ],
            [self.course.id],
        )
        remaining = CourseInstructorService.remove_instructor(
            self.db,
            self.course.id,
            self.other.id,
        )
        self.assertEqual([user.id for user in remaining], [self.assigned.id])


if __name__ == "__main__":
    unittest.main()
