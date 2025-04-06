from fastapi import APIRouter
from ..gpt import call_gpt

router = APIRouter()

@router.get('/test-gpt')
async def test_gpt():
    try:
        output = call_gpt([
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello in one sentence."}
        ])
        return {"success": True, "message": output.strip()}
    except Exception as e:
        return {"success": False, "error": str(e)}