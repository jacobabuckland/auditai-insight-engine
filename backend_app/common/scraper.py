from playwright.sync_api import sync_playwright
import logging

logger = logging.getLogger(__name__)

def scrape_page(url: str) -> dict:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            logger.info(f"📸 Crawling: {url}")
            page.goto(url, timeout=10000)
        except Exception as e:
            logger.error(f"❌ Failed to load {url}: {e}")
            browser.close()
            raise

        html_content = page.content()
        title = page.title()

        headings = [el.inner_text() for el in page.query_selector_all("h1, h2, h3")]
        ctas = [el.get_attribute("href") for el in page.query_selector_all("a, button") if el.get_attribute("href")]
        forms = [el.get_attribute("action") for el in page.query_selector_all("form") if el.get_attribute("action")]

        context.close()
        browser.close()

        return {
            "url": url,
            "html": html_content,
            "title": title,
            "headings": headings,
            "ctas": ctas,
            "forms": forms,
            "page_type": "unknown",
            "screenshot_url": ""  # Optional: implement capture/upload later
        }
