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
    shop: str = Field(..., example="mystore.myshopify.com")  # ✅ Added shop context

# 👇 Models used for /crawl endpoint
class CrawlRequest(BaseModel):
    url: str = Field(..., example="https://example.com")
    shop: str = Field(..., example="mystore.myshopify.com")  # ✅ Added shop context

class PageData(BaseModel):
    url: str
    title: str
    html: str
    headings: List[str]
    ctas: List[str]
    forms: List[str]
    page_type: Literal["home", "product", "category", "cart", "unknown"]
    screenshot_url: Optional[str] = None
# Used for internal context passing (e.g. agents, utilities)
class ShopSession(BaseModel):
    shop_domain: str
    access_token: Optional[str] = None
# --- CartPilot service DTOs (for n8n) ---
from pydantic import BaseModel, Field
from typing import Optional, List, Literal, Dict
from uuid import UUID
from datetime import datetime

Priority = Literal["High","Medium","Low"]
Category = Literal["Marketing","Merchandising","Operations"]
Level = Literal["Low","Medium","High"]

class SuggestionIn(BaseModel):
    title: str
    summary: Optional[str] = None
    priority: Priority = "Medium"
    category: Category = "Operations"
    impact: Optional[Level] = None
    effort: Optional[Level] = None
    what: Optional[str] = None
    why: Optional[str] = None
    how: Optional[List[str]] = None
    dataUsed: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    actions: Optional[List[str]] = None
    sources: Optional[List[str]] = None
    meta: Optional[Dict] = None
    uniqueKey: Optional[str] = Field(default=None, description="Idempotency key")

class SuggestionsImport(BaseModel):
    workspaceId: UUID
    items: List[SuggestionIn]

class MetricRow(BaseModel):
    source: str
    ts: datetime
    metric: str
    value: float

class CampaignMetricsIn(BaseModel):
    workspaceId: UUID
    rows: List[MetricRow]
