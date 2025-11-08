# filepath: backend_app/common/models.py
from __future__ import annotations
from pydantic import BaseModel
from typing import Literal
from uuid import UUID
from datetime import datetime

class SuggestionIn(BaseModel):
    title: str
    summary: str | None = None
    priority: Literal["High","Medium","Low"] = "Medium"
    category: Literal["Marketing","Merchandising","Operations"] = "Operations"
    impact: Literal["Low","Medium","High"] | None = None
    effort: Literal["Low","Medium","High"] | None = None
    what: str | None = None
    why: str | None = None
    how: list[str] | None = None
    dataUsed: list[str] | None = None
    risks: list[str] | None = None
    actions: list[str] | None = None
    sources: list[str] | None = None
    meta: dict | None = None
    uniqueKey: str | None = None

class SuggestionsImport(BaseModel):
    workspaceId: UUID
    items: list[SuggestionIn]

class CampaignMetricRow(BaseModel):
    source: str
    ts: datetime
    metric: str
    value: float

class CampaignMetricsUpsert(BaseModel):
    workspaceId: UUID
    rows: list[CampaignMetricRow]
