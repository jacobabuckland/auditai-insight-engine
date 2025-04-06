from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import suggest, crawl, debug_suggest, test_gpt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suggest.router)
app.include_router(crawl.router)
app.include_router(debug_suggest.router)
app.include_router(test_gpt.router)