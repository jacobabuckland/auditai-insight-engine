from fastapi import APIRouter
router = APIRouter()

@router.post('/debug-suggest')
async def debug_suggest():
    return {'message': 'mock debug data'}
    