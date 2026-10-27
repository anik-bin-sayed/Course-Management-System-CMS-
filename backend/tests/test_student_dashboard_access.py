from datetime import datetime
from decimal import Decimal
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from starlette.requests import Request

import app.models
from app.db.base_class import Base
from app.core.dependencies import get_current_user
from app.models.category import Category
from app.models.course import (
    Course,
    CourseLanguage,
    CourseLevel,
    CourseStatus,
    CourseType,
)
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.payment import Payment, PaymentStatus
from app.models.user import User
from app.services.course_access import CourseAccessService


class StudentDashboardAccessTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)

        self.student = self._user("student", "student")
        self.admin = self._user("admin", "admin")
        self.instructor = self._user("instructor", "instructor")
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
            user=self.instructor,
            instructors=[self.instructor],
            start_date=datetime(2026, 1, 1),
        )
        self.db.add_all(
            [self.student, self.admin, self.instructor, category, self.course]
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
            password="test-password",
            role=role,
        )

    def _enrollment(
        self,
        status: EnrollmentStatus,
        payment_status: PaymentStatus | None = None,
    ) -> Enrollment:
        enrollment = Enrollment(
            student_id=self.student.id,
            course_id=self.course.id,
            status=status,
        )
        if payment_status:
            enrollment.payment = Payment(
                amount=Decimal("10.00"),
                status=payment_status,
            )
        self.db.add(enrollment)
        self.db.commit()
        return enrollment

    def test_active_and_completed_enrollments_allow_course_access(self):
        for status in (EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED):
            with self.subTest(status=status):
                enrollment = self._enrollment(status)
                self.assertEqual(
                    CourseAccessService.require_course_read_access(
                        self.db,
                        self.student,
                        self.course.id,
                    ),
                    None,
                )
                self.db.delete(enrollment)
                self.db.commit()

    def test_pending_and_cancelled_enrollments_do_not_allow_access(self):
        cases = (
            (EnrollmentStatus.PENDING, None),
            (EnrollmentStatus.PENDING, PaymentStatus.FAILED),
            (EnrollmentStatus.PENDING, PaymentStatus.CANCELLED),
            (EnrollmentStatus.CANCELLED, None),
        )
        for status, payment_status in cases:
            with self.subTest(status=status, payment_status=payment_status):
                enrollment = self._enrollment(status, payment_status)
                with self.assertRaises(HTTPException) as error:
                    CourseAccessService.require_course_read_access(
                        self.db,
                        self.student,
                        self.course.id,
                    )
                self.assertEqual(error.exception.status_code, 403)
                self.db.delete(enrollment)
                self.db.commit()

    def test_admin_and_assigned_instructor_access_are_preserved(self):
        CourseAccessService.require_course_read_access(
            self.db,
            self.admin,
            self.course.id,
        )
        CourseAccessService.require_course_read_access(
            self.db,
            self.instructor,
            self.course.id,
        )

    def test_unknown_roles_are_denied_course_access(self):
        user = self._user("other", "other")
        self.db.add(user)
        self.db.commit()

        with self.assertRaises(HTTPException) as error:
            CourseAccessService.require_course_read_access(
                self.db,
                user,
                self.course.id,
            )

        self.assertEqual(error.exception.status_code, 403)

    def test_missing_access_cookie_is_unauthenticated(self):
        request = Request(
            {
                "type": "http",
                "headers": [],
                "method": "GET",
                "path": "/",
            }
        )

        with self.assertRaises(HTTPException) as error:
            get_current_user(request, self.db)

        self.assertEqual(error.exception.status_code, 401)


if __name__ == "__main__":
    unittest.main()
