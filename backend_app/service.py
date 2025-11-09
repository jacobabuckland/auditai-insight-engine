# filepath: backend_app/routes/service.py
from __future__ import annotations
from fastapi import APIRouter, Depends, Header, HTTPException, status
from uuid import UUID, uuid4
from typing import Optional
from app.common.service_auth import require_service  # local import style
from app.common.models import SuggestionIn, SuggestionsImport, CampaignMetricsUpsert
from datetime import datetime

router = APIRouter(prefix="/v1", tags=["Service"], dependencies=[Depends(require_service)])

# in-memory stores (workspace_id_str -> dict)
_suggestions_store: dict = {}
_metrics_store: dict = {}

def _parse_workspace_header(x_workspace_id: Optional[str]) -> UUID:
    if not x_workspace_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing X-Workspace-ID header")
    try:
        return UUID(x_workspace_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid X-Workspace-ID header; must be UUID")

@router.post("/suggestions/import")
async def import_suggestions(payload: SuggestionsImport, x_workspace_id: Optional[str] = Header(None)):
    """
    Import suggestions. Uses X-Workspace-ID header for the target workspace (UUID).
    Idempotency: if item.uniqueKey is provided, upsert on (workspace, uniqueKey).
    Returns counts: {created, updated}.
    """
    ws = _parse_workspace_header(x_workspace_id)
    ws_key = str(ws)

    created = 0
    updated = 0

    store = _suggestions_store.setdefault(ws_key, {})

    for item in payload.items:
        if item
set -euo pipefail
ROOT="$(pwd)"

# Ensure package layout
mkdir -p backend_app/common backend_app/routes tests

touch backend_app/__init__.py
touch backend_app/common/__init__.py
touch backend_app/routes/__init__.py

# pytest.ini
cat > pytest.ini <<'PYI'
[pytest]
pythonpath = .
PYI

# service auth dependency
cat > backend_app/common/service_auth.py <<'PY'
# filepath: backend_app/common/service_auth.py
from fastapi import Header, HTTPException, status
import os

def require_service(authorization: str = Header(None)):
    """
    FastAPI dependency that validates Authorization: Bearer <token>
    against environment variable SERVICE_BEARER.

    Returns True on success. Raises HTTPException:
      401 - missing header
      500 - SERVICE_BEARER not configured
      403 - invalid scheme or token
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    service_bearer = os.getenv("SERVICE_BEARER")
    if not service_bearer:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Service bearer not configured")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid authorization scheme")

    token = parts[1]
    if token != service_bearer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid service token")

    return True
