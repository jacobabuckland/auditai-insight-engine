from backend_app.routes import plan
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_app.routes import suggest, crawl, debug_suggest, test_gpt
from backend_app.routes import service

# ✅ Define the FastAPI app
app = FastAPI(
    title="AuditAI Insight Engine",
    version="1.0.0",
    description="Backend API for CRO suggestion and crawling"
)

# ✅ CORS middleware to allow Lovable access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://preview--auditai-insight-engine.lovable.app",  # Lovable preview domain
        "https://lovable.app",                                  # Main Lovable domain
        "https://app.lovable.dev"                               # Optional: logged-in environment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Health check route
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ✅ Include core route modules
app.include_router(service.router)
app.include_router(suggest.router)
app.include_router(crawl.router)
app.include_router(debug_suggest.router)
app.include_router(test_gpt.router)
app.include_router(plan.router)