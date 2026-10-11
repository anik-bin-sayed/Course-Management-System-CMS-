from collections import defaultdict

from sqlalchemy import and_, case, func
from sqlalchemy.orm import Session, selectinload

from app.models.course import Course
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.lesson.lesson import Lesson
from app.models.lesson.lesson_video import LessonVideo
from app.models.lesson.progress import LessonVideoProgress


class EnrollmentRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        enrollment_id: int,
    ):
        return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

    @staticmethod
    def get_by_student_and_course(
        db: Session,
        student_id: str,
        course_id: int,
    ):
        return (
            db.query(Enrollment)
            .filter(
                Enrollment.student_id == student_id,
                Enrollment.course_id == course_id,
            )
            .first()
        )

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: str,
    ):
        enrollments = (
            db.query(Enrollment)
            .options(
                selectinload(Enrollment.course),
                selectinload(Enrollment.course).selectinload(Course.category),
                selectinload(Enrollment.course).selectinload(Course.user),
                selectinload(Enrollment.payment),
            )
            .filter(Enrollment.student_id == student_id)
            .order_by(Enrollment.enrolled_at.desc())
            .all()
        )

        course_ids = [enrollment.course_id for enrollment in enrollments]
        progress_by_course = defaultdict(
            lambda: {
                "completed_lessons": 0,
                "total_lessons": 0,
                "completed_videos": 0,
                "total_videos": 0,
            }
        )

        if course_ids:
            lesson_progress = (
                db.query(
                    Lesson.id,
                    Lesson.course_id,
                    func.count(LessonVideo.id).label("total_videos"),
                    func.coalesce(
                        func.sum(
                            case(
                                (LessonVideoProgress.is_completed.is_(True), 1),
                                else_=0,
                            )
                        ),
                        0,
                    ).label("completed_videos"),
                )
                .outerjoin(LessonVideo, LessonVideo.lesson_id == Lesson.id)
                .outerjoin(
                    LessonVideoProgress,
                    and_(
                        LessonVideoProgress.video_id == LessonVideo.id,
                        LessonVideoProgress.user_id == student_id,
                    ),
                )
                .filter(Lesson.course_id.in_(course_ids))
                .group_by(Lesson.id, Lesson.course_id)
                .all()
            )

            for _, course_id, total_videos, completed_videos in lesson_progress:
                course_progress = progress_by_course[course_id]
                course_progress["total_lessons"] += 1
                course_progress["total_videos"] += total_videos
                course_progress["completed_videos"] += completed_videos
                if total_videos and total_videos == completed_videos:
                    course_progress["completed_lessons"] += 1

        results = []
        for enrollment in enrollments:
            progress = progress_by_course[enrollment.course_id]
            total_lessons = progress["total_lessons"]
            results.append(
                {
                    "id": enrollment.id,
                    "student_id": enrollment.student_id,
                    "course_id": enrollment.course_id,
                    "status": enrollment.status,
                    "enrolled_at": enrollment.enrolled_at,
                    "activated_at": enrollment.activated_at,
                    "completed_at": enrollment.completed_at,
                    "course": enrollment.course,
                    "payment": enrollment.payment,
                    "completed_lessons": progress["completed_lessons"],
                    "total_lessons": total_lessons,
                    "completed_videos": progress["completed_videos"],
                    "total_videos": progress["total_videos"],
                    "progress_percentage": (
                        round(progress["completed_lessons"] / total_lessons * 100)
                        if total_lessons
                        else 0
                    ),
                }
            )

        return results

    @staticmethod
    def get_active_enrollment(
        db: Session,
        student_id: str,
        course_id: int,
    ):
        return (
            db.query(Enrollment)
            .filter(
                Enrollment.student_id == student_id,
                Enrollment.course_id == course_id,
                Enrollment.status.in_(
                    [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED]
                ),
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        student_id: str,
        course_id: int,
    ):
        enrollment = Enrollment(
            student_id=student_id,
            course_id=course_id,
            status=EnrollmentStatus.PENDING,
        )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def update_status(
        db: Session,
        enrollment: Enrollment,
        status: EnrollmentStatus,
    ):
        enrollment.status = status

        db.commit()
        db.refresh(enrollment)

        return enrollment
