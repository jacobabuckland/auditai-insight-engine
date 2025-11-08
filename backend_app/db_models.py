from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import String, Enum, text, UniqueConstraint
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
import enum

Base = declarative_base()

class SuggestionState(str, enum.Enum):
    NEW = "NEW"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    SNOOZED = "SNOOZED"
    RESOLVED = "RESOLVED"

class DBSuggestion(Base):
    __tablename__ = "suggestions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    unique_key: Mapped[str] = mapped_column(String(255), nullable=False)
    source: Mapped[str | None] = mapped_column(String(64), nullable=True)
    title: Mapped[str | None] = mapped_column(String(512), nullable=True)
    payload = mapped_column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    state: Mapped[SuggestionState] = mapped_column(Enum(SuggestionState, name="suggestion_state"), nullable=False, default=SuggestionState.NEW)
    created_at = mapped_column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = mapped_column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    __table_args__ = (UniqueConstraint("workspace_id", "unique_key", name="uq_suggestions_workspace_uniquekey"),)

class DBCampaignMetric(Base):
    __tablename__ = "campaign_metrics"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(64), nullable=False)
    ts = mapped_column(TIMESTAMP(timezone=True), nullable=False, index=True)
    metric: Mapped[str] = mapped_column(String(128), nullable=False)
    value: Mapped[float]
    metadata = mapped_column(JSONB, nullable=True)
    created_at = mapped_column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = mapped_column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    __table_args__ = (UniqueConstraint("workspace_id","source","ts","metric", name="uq_campaign_metrics_unique"),)

class JobStatus(str, enum.Enum):
    ACK = "ACK"
    DONE = "DONE"
    FAIL = "FAIL"

class DBJobLog(Base):
    __tablename__ = "job_logs"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    job_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status"), nullable=False)
    message: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    meta = mapped_column(JSONB, nullable=True)
    created_at = mapped_column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
