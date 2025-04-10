
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

const API_BASE_URL = "https://auditai-insight-engine.onrender.com";

export async function crawlPage(url: string): Promise<CrawlResponse> {
  try {
    console.log("Crawling page:", url);
    
    const response = await fetch(`${API_BASE_URL}/crawl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Crawl response:", data);
    
    // Check if data has the expected PageData structure
    if (data.url && data.title) {
      return {
        success: true,
        page_type: data.page_type || "unknown",
        screenshot_path: data.screenshot_url || "",
        html: "", // The API doesn't currently return HTML
        ...data
      };
    } else {
      throw new Error("Invalid response format from crawl endpoint");
    }
  } catch (error) {
    console.error("Failed to crawl page:", error);
    toast({
      title: "Error",
      description: "Failed to crawl the page. Please try again.",
      variant: "destructive",
    });
    
    // Return a failed response
    return {
      success: false
    };
  }
}

export async function fetchSuggestions(
  data: AuditFormData,
  html?: string
): Promise<Suggestion[]> {
  try {
    console.log("Fetching suggestions for:", data.page_url);
    
    const response = await fetch(`${API_BASE_URL}/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        html: html || "",
        goal: data.goal
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Suggestions response:", result);
    
    // Format the suggestions to match our frontend model
    if (result.suggestions && Array.isArray(result.suggestions)) {
      return result.suggestions.map((s, index) => ({
        id: `suggestion-${index}`,
        title: s.text || "Suggestion",
        description: `${s.type} - ${s.impact}: ${s.target}`,
        impact: (s.impact || "medium").toLowerCase() as "high" | "medium" | "low"
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    toast({
      title: "Error",
      description: "Failed to get suggestions. Please try again.",
      variant: "destructive",
    });
    
    // Return empty array in case of error
    return [];
  }
}

export async function fetchVariants(data: VariantRequest): Promise<Suggestion> {
  try {
    console.log("Fetching variants for suggestion:", data.suggestion_id);
    
    const response = await fetch(`${API_BASE_URL}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    
    // Return a placeholder suggestion in case of error
    return {
      id: "error",
      title: "Error fetching variant",
      description: "Unable to load alternative implementation at this time.",
      impact: "low",
    };
  }
}

// Function to apply suggestions to HTML
export function applyHtmlSuggestions(html: string, acceptedSuggestions: Suggestion[]): string {
  // This is a simplified implementation 
  // In a real application, you would implement actual DOM manipulation or regex replacement
  if (!html || acceptedSuggestions.length === 0) return html;
  
  let modifiedHtml = html;
  
  // Add a simple visual indicator for each suggestion
  // This is a placeholder implementation
  acceptedSuggestions.forEach(suggestion => {
    // Highlight elements that might be affected by this suggestion
    // This is just for demonstration - would be more sophisticated in production
    const highlightText = `<div class="bg-green-200 p-2 rounded my-2">
      <strong>Applied Suggestion:</strong> ${suggestion.title}
      <p>${suggestion.description}</p>
    </div>`;
    
    // For demo purposes, add the highlight at the top of the body
    modifiedHtml = modifiedHtml.replace('<body', `<body>${highlightText}`);
  });
  
  return modifiedHtml;
}
