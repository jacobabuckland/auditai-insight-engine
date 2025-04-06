from fastapi import APIrouter
router = APIrouter()

@router.post('/debug-suggest')
async def debug_suggest():
    return {'message': 'mock debug data'}
    