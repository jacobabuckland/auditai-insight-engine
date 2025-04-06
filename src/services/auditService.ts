
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

// Mock data for testing
const MOCK_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Welcome to our store</h1>
    <div class="products">
      <div class="product">
        <img src="/product1.jpg" alt="Product 1" />
        <h2>Product 1</h2>
        <p>Description of product 1</p>
        <button>Add to Cart</button>
      </div>
      <div class="product">
        <img src="/product2.jpg" alt="Product 2" />
        <h2>Product 2</h2>
        <p>Description of product 2</p>
        <button>Add to Cart</button>
      </div>
    </div>
  </main>
  <footer>
    <p>&copy; 2025 Example Store</p>
  </footer>
</body>
</html>
`;

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    title: "Add urgency messaging",
    description: "Add 'Limited time offer' or 'Only X left in stock' near the Add to Cart button to create a sense of urgency.",
    impact: "high",
  },
  {
    id: "2",
    title: "Improve button visibility",
    description: "Make the Add to Cart button stand out more with contrasting colors and increased size.",
    impact: "medium",
  },
  {
    id: "3",
    title: "Add social proof",
    description: "Display customer reviews or ratings near products to build trust and confidence.",
    impact: "high",
  },
  {
    id: "4",
    title: "Simplify navigation",
    description: "Reduce menu options to focus user attention on products and purchasing.",
    impact: "low",
  },
];

export async function crawlPage(url: string): Promise<CrawlResponse> {
  try {
    console.log("Attempting to crawl page:", url);
    
    // Try to fetch from the API if it's available
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_url: url }),
        // Add short timeout to quickly fall back to mock data if API is unavailable
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (apiError) {
      console.log("API not available, using mock data");
      // Return mock data if the API call fails
      return {
        success: true,
        page_type: "Product Listing Page",
        screenshot_path: "/placeholder.svg",
        html: MOCK_HTML,
      };
    }
  } catch (error) {
    console.error("Failed to crawl page:", error);
    toast({
      title: "Error",
      description: "Failed to crawl the page. Using mock data instead.",
      variant: "destructive",
    });
    
    // Return mock data in case of any error
    return {
      success: true,
      page_type: "Product Listing Page",
      screenshot_path: "/placeholder.svg",
      html: MOCK_HTML,
    };
  }
}

export async function fetchSuggestions(
  data: AuditFormData,
  html?: string
): Promise<Suggestion[]> {
  try {
    console.log("Attempting to fetch suggestions for:", data.page_url);
    
    // Try to fetch from the API if it's available
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/debug-suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_url: data.page_url }),
        // Add short timeout to quickly fall back to mock data if API is unavailable
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (apiError) {
      console.log("API not available, using mock suggestions");
      // Return mock suggestions if the API call fails
      return MOCK_SUGGESTIONS;
    }
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    toast({
      title: "Information",
      description: "Using mock suggestions for demonstration.",
    });
    return MOCK_SUGGESTIONS;
  }
}

export async function fetchVariants(data: VariantRequest): Promise<Suggestion> {
  try {
    console.log("Attempting to fetch variants for suggestion:", data.suggestion_id);
    
    // Try to fetch from the API if it's available
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // Add short timeout to quickly fall back to mock data if API is unavailable
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (apiError) {
      console.log("API not available, using mock variant");
      // Return a mock variant if the API call fails
      return {
        id: "variant-1",
        title: "Alternative implementation",
        description: "This is a mock variant of the original suggestion.",
        impact: "medium",
      };
    }
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    toast({
      title: "Information",
      description: "Using mock variant for demonstration.",
    });
    
    // Return a mock variant in case of any error
    return {
      id: "variant-1",
      title: "Alternative implementation",
      description: "This is a mock variant of the original suggestion.",
      impact: "medium",
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
