# --- service endpoints and CORS (added) ---
import os
from fastapi.middleware.cors import CORSMiddleware

# try-safe import of new router
try:
    from app.routers import service as _service_router
except Exception:
    _service_router = None

# add CORS middleware if not already present (idempotent append)
try:
    origins = [
        os.getenv("LOVABLE_PREVIEW_ORIGIN", "https://preview.lovable.app"),
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
except Exception:
    pass

# include service router if available
try:
    if _service_router:
        app.include_router(_service_router.router)
except Exception:
    pass

# add a minimal /health endpoint if missing
if not any(getattr(r, "path", None) == "/health" for r in getattr(app, "routes", [])):
    @app.get("/health", tags=["health"])
    async def health():
        return {"status": "ok"}
# --- end added block ---
