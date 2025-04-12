from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.gpt import call_gpt, build_prompt
from backend.common.models import SuggestRequest, SuggestResponse
from starlette.concurrency import run_in_threadpool
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/suggest", response_model=SuggestResponse)
async def suggest_cro_ideas(request: SuggestRequest):
    try:
        prompt = build_prompt(request.html, request.goal)
        gpt_response = await run_in_threadpool(call_gpt, prompt)

        # Clean GPT output (in case it's wrapped in markdown)
        if gpt_response.startswith("```json"):
            gpt_response = gpt_response.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(gpt_response)
        return SuggestResponse(**parsed)

    except json.JSONDecodeError as json_err:
        logger.error(f"❌ Failed to decode GPT response: {json_err}")
        return SuggestResponse(
            rationale="GPT returned invalid JSON",
            suggestions=[]
        )

    except Exception as e:
        logger.exception("❌ Suggest endpoint failed")
        return SuggestResponse(
            rationale="GPT call failed unexpectedly",
            suggestions=[]
        )