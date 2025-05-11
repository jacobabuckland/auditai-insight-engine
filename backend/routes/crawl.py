from fastapi import APIRouter, Request, Header
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
async def crawl_page(
    request: Request,
    from backend.common.models import ShopSession
...
x_shop_domain: str = Header(..., alias="X-Shop-Domain")
shop_session = ShopSession(shop_domain=x_shop_domain)
...
crawl_request.shop = shop_session.shop_domain
):
    try:
        body = await request.json()
        crawl_request = CrawlRequest(**body)
        crawl_request.shop = x_shop_domain  # Inject shop into the model

        if not is_valid_url(crawl_request.url):
            return JSONResponse(status_code=400, content={"error": "Invalid URL"})

        logger.info(f"🔍 Crawling for shop: {crawl_request.shop} | URL: {crawl_request.url}")

        result = scrape_page(crawl_request.url)

        logger.info(f"✅ Crawl completed for shop: {crawl_request.shop} | URL: {crawl_request.url}")
        return PageData(**result)

    except Exception as e:
        logger.error(f"❌ Crawl failed for shop {x_shop_domain}: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Crawl failed: {str(e)}"}
        )
