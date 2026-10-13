"""Add many-to-many course instructor assignments.

Revision ID: 20261013_course_instructors
Revises: c07594ad812b
Create Date: 2026-10-13
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20261013_course_instructors"
down_revision: Union[str, Sequence[str], None] = "c07594ad812b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "course_instructors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("course_id", sa.Integer(), nullable=False),
        sa.Column("instructor_id", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["instructor_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint(
            "course_id",
            "instructor_id",
            name="uq_course_instructors_course_instructor",
        ),
    )
    op.create_index(
        "ix_course_instructors_course_id", "course_instructors", ["course_id"]
    )
    op.create_index(
        "ix_course_instructors_instructor_id", "course_instructors", ["instructor_id"]
    )
    op.execute(
        sa.text(
            "INSERT INTO course_instructors (course_id, instructor_id) "
            "SELECT id, instructor_id FROM courses WHERE instructor_id IS NOT NULL"
        )
    )


def downgrade() -> None:
    op.drop_index(
        "ix_course_instructors_instructor_id", table_name="course_instructors"
    )
    op.drop_index("ix_course_instructors_course_id", table_name="course_instructors")
    op.drop_table("course_instructors")
