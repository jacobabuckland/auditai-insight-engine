
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.common.models import CrawlRequest, PageData
from backend.common.scraper import scrape_page
import logging
import traceback

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/crawl")
def crawl_page(request: CrawlRequest):
    try:
        logger.info(f"Starting crawl for URL: {request.url}")
        result = scrape_page(request.url)
        logger.info(f"Crawl completed for {request.url}")
        return PageData(**result)
    except Exception as e:
        logger.error(f"❌ Crawl failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Crawl failed: {str(e)}"}
        )
