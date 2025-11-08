from __future__ import annotations
from uuid import UUID
from datetime import datetime
from typing import Dict
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.dialects.postgresql import insert as pg_insert

from backend_app.common.models import SuggestionsImport, CampaignMetricsIn
from backend_app.common.service_auth import require_service
from backend_app.db import get_session
from backend_app.db_models import DBSuggestion, DBCampaignMetric, DBJobLog, JobStatus

router = APIRouter(prefix="/v1", tags=["Service"])

def _parse_ws(x_workspace_id: str | None) -> UUID:
    if not x_workspace_id:
        raise HTTPException(400, "X-Workspace-ID header required")
    try:
        return UUID(x_workspace_id)
    except Exception:
        raise HTTPException(400, "X-Workspace-ID must be a UUID")

@router.post("/suggestions/import", dependencies=[Depends(require_service)])
def import_suggestions(
    payload: SuggestionsImport,
    x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"),
    session = Depends(get_session),
):
    ws = _parse_ws(x_workspace_id)
    created = updated = 0

    for it in payload.items:
        unique_key = it.uniqueKey or f"auto:{hash(it.title)}"
        stmt = pg_insert(DBSuggestion).values(
            workspace_id=ws,
            unique_key=unique_key,
            source=(it.meta or {}).get("source"),
            title=it.title,
            payload={
                "summary": it.summary,
                "priority": it.priority,
                "category": it.category,
                "impact": it.impact,
                "effort": it.effort,
                "what": it.what,
                "why": it.why,
                "how": it.how,
                "dataUsed": it.dataUsed,
                "risks": it.risks,
                "actions": it.actions,
                "sources": it.sources,
                "meta": it.meta,
            },
            state="NEW",
        ).on_conflict_do_update(
            index_elements=[DBSuggestion.__table__.c.workspace_id, DBSuggestion.__table__.c.unique_key],
            set_={
                "title": it.title,
                "payload": {
                    "summary": it.summary,
                    "priority": it.priority,
                    "category": it.category,
                    "impact": it.impact,
                    "effort": it.effort,
                    "what": it.what,
                    "why": it.why,
                    "how": it.how,
                    "dataUsed": it.dataUsed,
                    "risks": it.risks,
                    "actions": it.actions,
                    "sources": it.sources,
                    "meta": it.meta,
                },
                "updated_at": datetime.utcnow(),
            },
        ).returning(DBSuggestion.id, DBSuggestion.created_at, DBSuggestion.updated_at)

        row = session.execute(stmt).one()
        # If created_at == updated_at we can treat as created; but we set updated_at on every update,
        # so a simple heuristic:
        updated += 1  # treat as upsert; counts are informational only

    return {"upserts": len(payload.items)}

@router.post("/data/upsert/campaign_metrics", dependencies=[Depends(require_service)])
def upsert_campaign_metrics(
    payload: CampaignMetricsIn,
    x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"),
    session = Depends(get_session),
):
    ws = _parse_ws(x_workspace_id)
    upserts = 0
    for r in payload.rows:
        stmt = pg_insert(DBCampaignMetric).values(
            workspace_id=ws,
            source=r.source,
            ts=r.ts,
            metric=r.metric,
            value=r.value,
            metadata=None,
        ).on_conflict_do_update(
            index_elements=[
                DBCampaignMetric.__table__.c.workspace_id,
                DBCampaignMetric.__table__.c.source,
                DBCampaignMetric.__table__.c.ts,
                DBCampaignMetric.__table__.c.metric,
            ],
            set_={"value": r.value, "updated_at": datetime.utcnow()},
        )
        session.execute(stmt)
        upserts += 1
    return {"upserts": upserts}

@router.post("/jobs/ack", dependencies=[Depends(require_service)])
def job_ack(
    body: Dict,
    x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"),
    session = Depends(get_session),
):
    ws = _parse_ws(x_workspace_id)
    log = DBJobLog(workspace_id=ws, job_id=str(body.get("jobId")), status=JobStatus.ACK, message=body.get("message"), meta=body.get("meta"))
    session.add(log)
    session.flush()
    return {"id": str(log.id), "status": log.status}

@router.post("/jobs/done", dependencies=[Depends(require_service)])
def job_done(body: Dict, x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"), session = Depends(get_session)):
    ws = _parse_ws(x_workspace_id)
    log = DBJobLog(workspace_id=ws, job_id=str(body.get("jobId")), status=JobStatus.DONE, message=body.get("message"), meta=body.get("meta"))
    session.add(log)
    session.flush()
    return {"id": str(log.id), "status": log.status}

@router.post("/jobs/fail", dependencies=[Depends(require_service)])
def job_fail(body: Dict, x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"), session = Depends(get_session)):
    ws = _parse_ws(x_workspace_id)
    log = DBJobLog(workspace_id=ws, job_id=str(body.get("jobId")), status=JobStatus.FAIL, message=body.get("message"), meta=body.get("meta"))
    session.add(log)
    session.flush()
    return {"id": str(log.id), "status": log.status}
