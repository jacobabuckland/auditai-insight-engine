
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
};

export async function crawlPage(url: string): Promise<CrawlResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/crawl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_url: url }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to crawl page:", error);
    toast({
      title: "Error",
      description: "Failed to crawl the page. Please try again.",
      variant: "destructive",
    });
    return { success: false };
  }
}

export async function fetchSuggestions(
  data: AuditFormData,
  html?: string
): Promise<Suggestion[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, html }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    toast({
      title: "Error",
      description: "Failed to fetch suggestions. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

export async function fetchVariants(data: VariantRequest): Promise<Suggestion> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    toast({
      title: "Error",
      description: "Failed to generate a new variant. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}
