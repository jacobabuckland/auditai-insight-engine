
from playwright.sync_api import sync_playwright

def scrape_page(url: str) -> dict:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        html = page.content()  # ✅ Capture raw HTML
        # Extract the HTML content
        html_content = page.content()
        
        headings = [el.inner_text() for el in page.query_selector_all("h1, h2, h3")]
        ctas = [el.get_attribute("href") for el in page.query_selector_all("a, button") if el.get_attribute("href")]
        forms = [el.get_attribute("action") for el in page.query_selector_all("form") if el.get_attribute("action")]
        meta = page.title()

        browser.close()

        return {
            "url": url,
            "html": html,  # ✅ Return raw HTML
            "title": meta,
            "headings": headings,
            "ctas": ctas,
            "forms": forms,
            "page_type": "unknown",     # Optional placeholder
            "screenshot_url": ""        # Optional placeholder
            "page_type": "unknown",  # optional placeholder
            "screenshot_url": "",    # optional placeholder
            "html": html_content,    # Include the page's HTML content
        }
