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
