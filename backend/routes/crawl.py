from fastapi import APIrouter
router = APIrouter()

@router.post('/crawl')
async def crawl():
    return {'message': 'crawl mock'}