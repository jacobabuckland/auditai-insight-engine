from pydantic import BaseModel
from typing import List

class SuggestRequest(BaseModel):
    input: str

class SuggestResponse(BaseModel):
    suggestions: List[str]
