# filepath: backend-app/app/core/service_auth.py
from fastapi import Header, HTTPException, status
import os


def require_service(authorization: str = Header(None)):
    """
    FastAPI dependency that enforces Authorization: Bearer <token>
    against env SERVICE_BEARER.

    Raises:
      401 - missing header
      500 - SERVICE_BEARER not configured
      403 - invalid scheme or token
    Returns True on success (suitable as a dependency).
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    service_bearer = os.getenv("SERVICE_BEARER")
    if not service_bearer:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Service bearer not configured",
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid authorization scheme")

    token = parts[1]
    if token != service_bearer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid service token")

    return True
