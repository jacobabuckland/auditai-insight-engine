# backend/routes/suggest.py

from fastapi import APIRouter
from common.models import SuggestRequest, SuggestResponse

router = APIRouter()

@router.post("/suggest", response_model=SuggestResponse)
async def suggest_cro_ideas(request: SuggestRequest):
    mock_suggestions = [
        "Add a CTA above the fold.",
        "Highlight social proof near the pricing.",
        "Make navigation simpler."
    ]
    return SuggestResponse(suggestions=mock_suggestions)
