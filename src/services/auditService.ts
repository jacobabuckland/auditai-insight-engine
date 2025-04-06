
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
    // Changed endpoint from /suggest to /debug-suggest
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/debug-suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Simplified request body for testing (can be empty or omit goal)
      body: JSON.stringify({ page_url: data.page_url }),
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
