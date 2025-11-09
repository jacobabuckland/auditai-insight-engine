from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend_app.routes import service  # ✅ stable
# (Leave the others commented until fixed)
# from backend_app.routes import crawl, debug_suggest, test_gpt, plan

app = FastAPI(
    title="AuditAI Insight Engine",
    version="1.0.0",
    description="Backend API for CRO suggestion and crawling",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://preview--auditai-insight-engine.lovable.app",
        "https://lovable.app",
        "https://app.lovable.dev",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(service.router)
# app.include_router(crawl.router)
# app.include_router(debug_suggest.router)
# app.include_router(test_gpt.router)
# app.include_router(plan.router)
from backend_app.routes import service, service_health
app.include_router(service.router)
app.include_router(service_health.router)

