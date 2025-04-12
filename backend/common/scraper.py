from playwright.sync_api import sync_playwright

def scrape_page(url: str) -> dict:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        html_content = page.content()
        title = page.title()

        headings = [el.inner_text() for el in page.query_selector_all("h1, h2, h3")]
        ctas = [el.get_attribute("href") for el in page.query_selector_all("a, button") if el.get_attribute("href")]
        forms = [el.get_attribute("action") for el in page.query_selector_all("form") if el.get_attribute("action")]

        browser.close()

        return {
            "url": url,
            "html": html_content,
            "title": title,
            "headings": headings,
            "ctas": ctas,
            "forms": forms,
            "page_type": "unknown",       # placeholder
            "screenshot_url": ""          # placeholder
        }
        