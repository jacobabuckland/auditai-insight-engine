from fastapi import APIRouter
from backend.gpt import call_gpt, build_prompt
from backend.common.models import SuggestRequest, SuggestResponse
import json

router = APIRouter()

@router.post("/suggest", response_model=SuggestResponse)
async def suggest_cro_ideas(request: SuggestRequest):
    try:
        prompt = build_prompt(request.html, request.goal)
        gpt_response = call_gpt(prompt)

        # Clean GPT output (in case it's wrapped in markdown)
        if gpt_response.startswith("```json"):
            gpt_response = gpt_response.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(gpt_response)
        return SuggestResponse(**parsed)

    except Exception as e:
        print(f"Suggest error: {e}")
        return SuggestResponse(rationale="GPT call failed", suggestions=[])
