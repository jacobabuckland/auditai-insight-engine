
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, verifyShopDomain, createApiHeaders, handleApiError } from "./utils/apiUtils";

export interface CrawlResponse {
  success: boolean;
  page_type?: string;
  screenshot_path?: string;
  html?: string;
  url?: string;
  title?: string;
  headings?: string[];
  ctas?: string[];
  forms?: string[];
}

/**
 * Crawls a webpage and extracts relevant information
 * @param url The URL to crawl
 * @param shopDomain The shop domain making the request
 * @returns Promise with the crawl response
 */
export async function crawlPage(url: string, shopDomain: string | null): Promise<CrawlResponse> {
  try {
    console.log("Crawling page:", url, "for shop:", shopDomain);

    if (!verifyShopDomain(shopDomain)) {
      return { success: false };
    }

    const payload = { url };

    const response = await fetch(`${API_BASE_URL}/crawl`, {
      method: "POST",
      headers: createApiHeaders(shopDomain),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Crawl response:", data);

    return {
      success: true,
      page_type: data.page_type || "unknown",
      screenshot_path: data.screenshot_url || "",
      html: data.html || "",
      ...data,
    };
  } catch (error) {
    handleApiError(error, "Failed to crawl page");
    return { success: false };
  }
}
