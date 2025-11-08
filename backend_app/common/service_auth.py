import os
from fastapi import Header, HTTPException

SERVICE_BEARER = os.getenv("SERVICE_BEARER")

def require_service(authorization: str = Header(None)):
    if not SERVICE_BEARER:
        raise HTTPException(status_code=500, detail="SERVICE_BEARER not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer")
    token = authorization.split(" ", 1)[1]
    if token != SERVICE_BEARER:
        raise HTTPException(status_code=403, detail="Invalid service token")
    return True
