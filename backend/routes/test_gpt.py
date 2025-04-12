from fastapi import APIRouter
from starlette.concurrency import run_in_threadpool
from backend.gpt import call_gpt  # Assuming correct path now
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get('/test-gpt')
async def test_gpt():
    try:
        output = await run_in_threadpool(call_gpt, [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello in one sentence."}
        ])
        logger.info("✅ GPT test successful")
        return {"success": True, "message": output.strip()}
    except Exception as e:
        logger.exception("❌ GPT test failed")
        return {"success": False, "error": str(e)}