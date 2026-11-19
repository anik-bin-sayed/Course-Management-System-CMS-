"""Add editable learning outcomes to courses.

Revision ID: 20261119_course_outcomes
Revises: 20261013_filter_assignments
Create Date: 2026-11-19
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20261119_course_outcomes"
down_revision: Union[str, Sequence[str], None] = "20261013_filter_assignments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "courses",
        sa.Column(
            "learning_outcomes",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )


def downgrade() -> None:
    op.drop_column("courses", "learning_outcomes")
