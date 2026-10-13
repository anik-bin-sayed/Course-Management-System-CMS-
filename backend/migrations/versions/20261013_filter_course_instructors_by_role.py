"""Remove non-instructor users from course assignments.

Revision ID: 20261013_filter_assignments
Revises: 20261013_course_instructors
Create Date: 2026-10-13
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20261013_filter_assignments"
down_revision: Union[str, Sequence[str], None] = "20261013_course_instructors"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            "DELETE FROM course_instructors AS assignment "
            "USING users AS assigned_user "
            "WHERE assignment.instructor_id = assigned_user.id "
            "AND assigned_user.role <> 'instructor'"
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            "INSERT INTO course_instructors (course_id, instructor_id) "
            "SELECT courses.id, courses.instructor_id "
            "FROM courses "
            "WHERE courses.instructor_id IS NOT NULL "
            "AND NOT EXISTS ("
            "SELECT 1 FROM course_instructors AS assignment "
            "WHERE assignment.course_id = courses.id "
            "AND assignment.instructor_id = courses.instructor_id"
            ")"
        )
    )