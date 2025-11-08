from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20251108_0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    suggestion_state = sa.Enum("NEW","ACCEPTED","REJECTED","SNOOZED","RESOLVED", name="suggestion_state")
    job_status = sa.Enum("ACK","DONE","FAIL", name="job_status")
    suggestion_state.create(op.get_bind(), checkfirst=True)
    job_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "suggestions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("unique_key", sa.String(255), nullable=False),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("title", sa.String(512), nullable=True),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("state", suggestion_state, nullable=False, server_default="NEW"),
        sa.Column("created_at", postgresql.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", postgresql.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_suggestions_workspace_id", "suggestions", ["workspace_id"])
    op.create_unique_constraint("uq_suggestions_workspace_uniquekey", "suggestions", ["workspace_id","unique_key"])

    op.create_table(
        "campaign_metrics",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("source", sa.String(64), nullable=False),
        sa.Column("ts", postgresql.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("metric", sa.String(128), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", postgresql.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", postgresql.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_campaign_metrics_workspace_id", "campaign_metrics", ["workspace_id"])
    op.create_index("ix_campaign_metrics_ts", "campaign_metrics", ["ts"])
    op.create_unique_constraint("uq_campaign_metrics_unique", "campaign_metrics", ["workspace_id","source","ts","metric"])

    op.create_table(
        "job_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("job_id", sa.String(128), nullable=False),
        sa.Column("status", job_status, nullable=False),
        sa.Column("message", sa.String(2000), nullable=True),
        sa.Column("meta", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", postgresql.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_job_logs_workspace_id", "job_logs", ["workspace_id"])
    op.create_index("ix_job_logs_job_id", "job_logs", ["job_id"])

def downgrade():
    op.drop_table("job_logs")
    op.drop_table("campaign_metrics")
    op.drop_table("suggestions")
    sa.Enum(name="job_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="suggestion_state").drop(op.get_bind(), checkfirst=True)
