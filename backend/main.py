from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import suggest, crawl, debug_suggest, test_gpt

app = FastAPI(
    title="AuditAI Insight Engine",
    version="1.0.0",
    description="Backend API for CRO suggestion and crawling"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(suggest.router)
app.include_router(crawl.router)
app.include_router(debug_suggest.router)
app.include_router(test_gpt.router)
