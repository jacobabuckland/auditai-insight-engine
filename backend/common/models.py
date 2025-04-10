from pydantic import BaseModel
from typing import List

class Suggestion(BaseModel):
    text: str
    type: str
    target: str
    impact: str

class SuggestResponse(BaseModel):
    rationale: str
    suggestions: List[Suggestion]

class SuggestRequest(BaseModel):
    html: str
    goal: str

# 👇 Models used for /crawl endpoint
class CrawlRequest(BaseModel):
    url: str

class PageData(BaseModel):
    url: str
    title: str
    html: str                  # ✅ Added this line
    headings: List[str]
    ctas: List[str]
    forms: List[str]
    page_type: str
    screenshot_url: str
