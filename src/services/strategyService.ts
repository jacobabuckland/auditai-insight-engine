
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, verifyShopDomain, createApiHeaders, handleApiError } from "./utils/apiUtils";

export interface StrategyResponse {
  success: boolean;
  error?: string;
  suggestions?: Array<{
    text?: string;
    title?: string;
    description?: string;
    rationale?: string;
    impact?: string;
    category?: string;
    type?: string;
    target?: string;
  }>;
  plan?: string;
  reasoning?: string;
  rationale?: string;
}

/**
 * Fetches a strategy plan based on a goal and shop domain
 * @param goal The business goal to create a strategy for
 * @param shopDomain The shop domain to create the strategy for
 * @returns Promise with the strategy plan response
 */
export async function fetchStrategyPlan(goal: string, shopDomain: string | null): Promise<StrategyResponse> {
  try {
    console.log("Fetching strategy plan for goal:", goal, "for shop:", shopDomain);
    
    if (!verifyShopDomain(shopDomain)) {
      return { success: false, error: "Store detection failed" };
    }

    const response = await fetch(`${API_BASE_URL}/agent/plan`, {
      method: "POST",
      headers: createApiHeaders(shopDomain),
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch strategy plan");
    }

    const data = await response.json();
    console.log("Strategy plan response:", data);
    
    return { success: true, ...data };
  } catch (error) {
    handleApiError(error, "Failed to fetch strategy plan");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch strategy plan" 
    };
  }
}
