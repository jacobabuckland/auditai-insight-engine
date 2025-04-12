from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class Suggestion(BaseModel):
    text: str
    type: Literal["copy", "layout", "module"]
    target: str
    impact: Literal["low", "medium", "high"]

class SuggestResponse(BaseModel):
    rationale: str
    suggestions: List[Suggestion]

class SuggestRequest(BaseModel):
    html: str
    goal: str = Field(..., example="increase add to cart")

# 👇 Models used for /crawl endpoint
class CrawlRequest(BaseModel):
    url: str = Field(..., example="https://example.com")

class PageData(BaseModel):
    url: str
    title: str
    html: str
    headings: List[str]
    ctas: List[str]
    forms: List[str]
    page_type: Literal["home", "product", "category", "cart", "unknown"]
    screenshot_url: Optional[str] = None
