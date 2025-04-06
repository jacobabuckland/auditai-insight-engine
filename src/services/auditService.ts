
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

export async function fetchSuggestions(
  data: AuditFormData
): Promise<Suggestion[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/suggest`, {
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
    console.error("Failed to fetch suggestions:", error);
    toast({
      title: "Error",
      description: "Failed to fetch suggestions. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}
