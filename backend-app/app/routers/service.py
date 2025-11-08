# filepath: backend-app/app/routers/service.py
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.service_auth import require_service

router = APIRouter(prefix="/v1", tags=["service"], dependencies=[Depends(require_service)])


class SuggestionIn(BaseModel):
    title: str
    summary: str
    priority: str = Field(..., regex="^(High|Medium|Low)$")
    category: str = Field(..., regex="^(Marketing|Merchandising|Operations)$")
    impact: Optional[str] = Field(None, regex="^(Low|Medium|High)$")
    effort: Optional[str] = Field(None, regex="^(Low|Medium|High)$")
    what: Optional[str] = None
    why: Optional[str] = None
    how: Optional[List[str]] = None
    dataUsed: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    actions: Optional[List[str]] = None
    sources: Optional[List[str]] = None
    meta: Optional[dict] = None
    uniqueKey: Optional[str] = None


class SuggestionsImportRequest(BaseModel):
    workspaceId: UUID
    items: List[SuggestionIn]


class CampaignMetricRow(BaseModel):
    source: str
    ts: datetime
    metric: str
    value: float


class CampaignMetricsUpsertRequest(BaseModel):
    workspaceId: UUID
    rows: List[CampaignMetricRow]


@router.post("/suggestions/import")
async def import_suggestions(payload: SuggestionsImportRequest):
    created = 0
    updated = 0
    for _ in payload.items:
        created += 1
    return {"created": created, "updated": updated}


@router.post("/data/upsert/campaign_metrics")
async def upsert_campaign_metrics(payload: CampaignMetricsUpsertRequest):
    upserted = len(payload.rows)
    return {"upserted": upserted}
