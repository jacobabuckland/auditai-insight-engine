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


# 👇 ADD THESE TO SUPPORT /crawl
class CrawlRequest(BaseModel):
    url: str

class PageData(BaseModel):
    url: str
    title: str
    headings: List[str]
    ctas: List[str]
    forms: List[str]
    page_type: str
    screenshot_url: str
