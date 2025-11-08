from __future__ import annotations

from datetime import datetime
from typing import Dict, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from backend_app.common.models import (
    SuggestionsImport,
    CampaignMetricsIn,
)
from backend_app.common.service_auth import require_service

router = APIRouter(prefix="/v1", tags=["Service"])

# -----------------------
# In-memory stores (MVP)
# -----------------------
# Idempotent key: (workspaceId, uniqueKey)
SUGGESTIONS: Dict[str, dict] = {}
# Upsert key: (workspaceId, source, ts, metric)
METRICS: Dict[str, dict] = {}


# -----------------------
# Helpers
# -----------------------
def _parse_ws(x_workspace_id: Optional[str]) -> UUID:
    """Validate X-Workspace-ID header is a UUID and return it."""
    if not x_workspace_id:
        raise HTTPException(status_code=400, detail="X-Workspace-ID header required")
    try:
        return UUID(x_workspace_id)
    except Exception:
        raise HTTPException(status_code=400, detail="X-Workspace-ID must be a UUID")


class ImportResult(BaseModel):
    created: int
    updated: int


class UpsertResult(BaseModel):
    upserts: int


# -----------------------
# Endpoints
# -----------------------
@router.post(
    "/suggestions/import",
    dependencies=[Depends(require_service)],
    response_model=ImportResult,
)
def import_suggestions(
    payload: SuggestionsImport,
    x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-ID"),
):
    """
    Import suggestions idempotently using item.uniqueKey.
    """
    ws_id = _parse_ws(x_workspace_id)  # validates header
    if payload.workspaceId != ws_id:
        # Keep caller honest: header and body must refer to same workspace
        raise HTTPException(status_code=400, detail="Workspace mismatch")

    created = 0
    updated = 0

    for item in payload.items:
        key = item.uniqueKey or f"auto:{hash(item.title)}"
        store_key = f"{str(ws_id)}:{key}"

        body = item.model_dump()
        body.setdefault("status", "pending")

        if store_key in SUGGESTIONS:
            # idempotent update
            SUGGESTIONS[store_key].update(body)
            updated += 1
        else:
            SUGGESTIONS[store_key] = body
            created += 1

    return ImportResult(created=created, updated=updated)


@router.post(
    "/data/upsert/campaign_metrics",
    dependencies=[Depends(require_service)],
    response_model=UpsertResult,
)
def upsert_campaign_metrics(
    payload: CampaignMetricsIn,
    x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-ID"),
):
    """
    Upsert simple time-series campaign metrics.
    """
    ws_id = _parse_ws(x_workspace_id)
    if payload.workspaceId != ws_id:
        raise HTTPException(status_code=400, detail="Workspace mismatch")

    upserts = 0
    for r in payload.rows:
        # normalise ts to ISO string to key the dict
        ts_iso = r.ts.isoformat() if isinstance(r.ts, datetime) else str(r.ts)
        k = f"{str(ws_id)}:{r.source}:{ts_iso}:{r.metric}"
        METRICS[k] = {
            "source": r.source,
            "ts": ts_iso,
            "metric": r.metric,
            "value": r.value,
        }
        upserts += 1

    return UpsertResult(upserts=upserts)
