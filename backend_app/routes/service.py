from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Dict
from backend_app.common.models import SuggestionsImport, CampaignMetricsIn
from backend_app.common.service_auth import require_service

router = APIRouter(prefix="/v1", tags=["Service"])

# In-memory stores (swap to DB later)
SUGGESTIONS: Dict[str, dict] = {}   # key: f"{workspaceId}:{uniqueKey}"
METRICS: Dict[str, dict] = {}       # key: f"{workspaceId}:{source}:{ts}:{metric}"

@router.post("/suggestions/import", dependencies=[Depends(require_service)])
def import_suggestions(
    payload: SuggestionsImport,
    x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"),
):
    if not x_workspace_id:
        raise HTTPException(400, "X-Workspace-ID header required")

    created = updated = 0
    for it in payload.items:
        key = it.uniqueKey or f"auto:{hash(it.title)}"
        store_key = f"{payload.workspaceId}:{key}"
        body = it.model_dump()
        body.setdefault("status", "pending")
        if store_key in SUGGESTIONS:
            SUGGESTIONS[store_key].update(body)
            updated += 1
        else:
            SUGGESTIONS[store_key] = body
            created += 1
    return {"created": created, "updated": updated}

@router.post("/data/upsert/campaign_metrics", dependencies=[Depends(require_service)])
def upsert_campaign_metrics(
    payload: CampaignMetricsIn,
    x_workspace_id: str | None = Header(None, alias="X-Workspace-ID"),
):
    if not x_workspace_id:
        raise HTTPException(400, "X-Workspace-ID header required")

    upserts = 0
    for r in payload.rows:
        k = f"{payload.workspaceId}:{r.source}:{r.ts.isoformat()}:{r.metric}"
        METRICS[k] = {"source": r.source, "ts": r.ts, "metric": r.metric, "value": r.value}
        upserts += 1
    return {"upserts": upserts}
