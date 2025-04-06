from fastapi import APIRouter
router = APIRouter()

@router.post('/crawl')
async def crawl():
    return {'message': 'crawl mock'}