
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, verifyShopDomain, createApiHeaders, handleApiError } from "./utils/apiUtils";

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

export type SuggestResponse = {
  rationale: string;
  suggestions: Array<{
    text: string;
    type: string;
    target: string;
    impact: string;
  }>;
};

/**
 * Fetches suggestions based on form data and HTML content
 * @param data The audit form data
 * @param html The HTML content to analyze
 * @param shopDomain The shop domain making the request
 * @returns Promise with suggestions and rationale
 */
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
      headers: createApiHeaders(shopDomain),
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
    handleApiError(error, "Failed to fetch suggestions");
    return { rationale: "Error fetching suggestions", suggestions: [] };
  }
}

/**
 * Fetches variants for a suggestion
 * @param data The variant request data
 * @param shopDomain The shop domain making the request
 * @returns Promise with the variant suggestion
 */
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
      headers: createApiHeaders(shopDomain),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const variant = await response.json();
    console.log("Variant response:", variant);
    return variant;
  } catch (error) {
    handleApiError(error, "Failed to fetch variants");
    return {
      id: "error",
      title: "Error fetching variant",
      description: "Unable to load alternative implementation at this time.",
      impact: "low",
    };
  }
}
