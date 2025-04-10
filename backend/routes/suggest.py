from fastapi import APIRouter
from common.models import SuggestRequest, SuggestResponse
from gpt import call_gpt, build_prompt
import json

router = APIRouter()

@router.post("/suggest", response_model=SuggestResponse)
async def suggest_cro_ideas(request: SuggestRequest):
    try:
        prompt = build_prompt(request.html, request.goal)
        gpt_response = call_gpt(prompt)

        # Extract JSON from GPT response (strip markdown if needed)
        if gpt_response.startswith("```json"):
            gpt_response = gpt_response.strip("```json").strip("```").strip()

        parsed = json.loads(gpt_response)
        return SuggestResponse(**parsed)

    except Exception as e:
        print(f"Suggest error: {e}")
        return SuggestResponse(rationale="GPT call failed", suggestions=[])