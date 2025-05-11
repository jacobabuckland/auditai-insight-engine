import { toast } from "@/components/ui/use-toast";

export type AuditFormData = {
  page_url: string;
  goal: string;
};

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

export type VariantRequest = {
  suggestion_id: string;
  original_text: string;
};

export type CrawlResponse = {
  success: boolean;
  page_type?: string;
  screenshot_path?: string;
  html?: string;
  url?: string;
  title?: string;
  headings?: string[];
  ctas?: string[];
  forms?: string[];
};

export type SuggestResponse = {
  rationale: string;
  suggestions: Array<{
    text: string;
    type: string;
    target: string;
    impact: string;
  }>;
};

const API_BASE_URL = "https://auditai-insight-engine-1.onrender.com";

const verifyShopDomain = (shopDomain: string | null): boolean => {
  if (!shopDomain) {
    toast({
      title: "Error",
      description: "Unable to detect store. Please refresh or contact support.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export async function crawlPage(url: string, shopDomain: string | null): Promise<CrawlResponse> {
  try {
    console.log("Crawling page:", url, "for shop:", shopDomain);

    if (!verifyShopDomain(shopDomain)) {
      return { success: false };
    }

    const payload = { url };

    const response = await fetch(`${API_BASE_URL}/crawl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(shopDomain && { "X-Shop-Domain": shopDomain }),
      },
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
    console.error("Failed to crawl page:", error);
    toast({
      title: "Error",
      description: "Failed to crawl the page. Please try again later or contact support.",
      variant: "destructive",
    });

    return { success: false };
  }
}

export async function fetchSuggestions(
  data: AuditFormData,
  html: string | undefined,
  shopDomain: string | null
): Promise<{ rationale: string; suggestions: Suggestion[] }> {
  try {
    console.log("Fetching suggestions for:", data.page_url, "for shop:", shopDomain);

    if (!verifyShopDomain(shopDomain)) {
      return { rationale: "Store detection failed", suggestions: [] };
    }

    const response = await fetch(`${API_BASE_URL}/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(shopDomain && { "X-Shop-Domain": shopDomain }),
      },
      body: JSON.stringify({
        html: html || "",
        goal: data.goal,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json() as SuggestResponse;
    console.log("Suggestions response:", result);

    if (result.suggestions && Array.isArray(result.suggestions)) {
      return {
        rationale: result.rationale || "No rationale provided",
        suggestions: result.suggestions.map((s, index) => ({
          id: `suggestion-${index}`,
          title: s.text || "Suggestion",
          description: `${s.type} - ${s.target}`,
          impact: (s.impact || "medium").toLowerCase() as "high" | "medium" | "low"
        })),
      };
    }

    return { rationale: "No rationale provided", suggestions: [] };
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    toast({
      title: "Error",
      description: "Failed to get suggestions. Please try again.",
      variant: "destructive",
    });

    return { rationale: "Error fetching suggestions", suggestions: [] };
  }
}

export async function fetchVariants(data: VariantRequest, shopDomain: string | null): Promise<Suggestion> {
  try {
    console.log("Fetching variants for suggestion:", data.suggestion_id, "for shop:", shopDomain);

    if (!verifyShopDomain(shopDomain)) {
      return {
        id: "error",
        title: "Store detection failed",
        description: "Unable to detect connected store.",
        impact: "low",
      };
    }

    const payload = { ...data };

    const response = await fetch(`${API_BASE_URL}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(shopDomain && { "X-Shop-Domain": shopDomain }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const variant = await response.json();
    console.log("Variant response:", variant);
    return variant;
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    toast({
      title: "Error",
      description: "Failed to get suggestion variants. Please try again.",
      variant: "destructive",
    });

    return {
      id: "error",
      title: "Error fetching variant",
      description: "Unable to load alternative implementation at this time.",
      impact: "low",
    };
  }
}

export function applyHtmlSuggestions(html: string, acceptedSuggestions: Suggestion[]): string {
  if (!html || acceptedSuggestions.length === 0) return html;

  let modifiedHtml = html;

  acceptedSuggestions.forEach(suggestion => {
    const highlightText = `<div class="bg-green-200 p-2 rounded my-2">
      <strong>Applied Suggestion:</strong> ${suggestion.title}
      <p>${suggestion.description}</p>
    </div>`;

    modifiedHtml = modifiedHtml.replace('<body', `<body>${highlightText}`);
  });

  return modifiedHtml;
}
