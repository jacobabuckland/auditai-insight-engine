from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.common.models import CrawlRequest, PageData
from backend.common.scraper import scrape_page
from urllib.parse import urlparse
import logging
import traceback

router = APIRouter()
logger = logging.getLogger(__name__)

def is_valid_url(url: str) -> bool:
    parsed = urlparse(url)
    return all([parsed.scheme, parsed.netloc])

@router.post("/crawl", response_model=PageData)
def crawl_page(request: CrawlRequest):
    if not is_valid_url(request.url):
        return JSONResponse(status_code=400, content={"error": "Invalid URL"})
    
    try:
        # ✅ Log shop domain to associate the crawl
        logger.info(f"🔍 Crawling for shop: {request.shop} | URL: {request.url}")

        result = scrape_page(request.url)

        # ✅ You could store or tag result here with shop for future analytics/logging
        logger.info(f"✅ Crawl completed for shop: {request.shop} | URL: {request.url}")
        return PageData(**result)
    except Exception as e:
        logger.error(f"❌ Crawl failed for shop {request.shop}: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Crawl failed: {str(e)}"}
        )

