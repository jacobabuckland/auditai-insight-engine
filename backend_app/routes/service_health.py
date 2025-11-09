# backend_app/routes/service_health.py
from fastapi import APIRouter, Depends
from backend_app.common.service_auth import require_service

router = APIRouter(prefix="/v1/service", tags=["Service"])

@router.get("/ping", dependencies=[Depends(require_service)])
def service_ping():
    return {"ok": True}
