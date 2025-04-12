from fastapi import APIRouter
from backend.common.models import SuggestResponse

router = APIRouter()

@router.post('/debug-suggest', response_model=SuggestResponse)
async def debug_suggest():
    return {
        "rationale": "These suggestions are mock data for frontend testing.",
        "suggestions": [
            {
                "text": "Add urgency messaging to the product CTA.",
                "type": "copy",
                "target": "cta-button",
                "impact": "high"
            },
            {
                "text": "Move customer reviews higher on the page.",
                "type": "layout",
                "target": "reviews-section",
                "impact": "medium"
            }
        ]
    }
