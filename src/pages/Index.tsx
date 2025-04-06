
import React, { useState } from "react";
import AuditForm from "@/components/AuditForm";
import SuggestionCard, { Suggestion } from "@/components/SuggestionCard";
import { fetchSuggestions, AuditFormData, crawlPage } from "@/services/auditService";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [pageType, setPageType] = useState<string | null>(null);
  const [screenshotPath, setScreenshotPath] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: AuditFormData) => {
    if (!formData.page_url || !formData.goal) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCrawling(true);
    setIsLoading(true);
    setSuggestions([]);
    setPageType(null);
    setScreenshotPath(null);

    try {
      // First, crawl the page
      const crawlResult = await crawlPage(formData.page_url);
      
      if (!crawlResult.success) {
        throw new Error("Crawling failed");
      }
      
      setIsCrawling(false);
      setPageType(crawlResult.page_type || null);
      setScreenshotPath(crawlResult.screenshot_path || null);
      
      // Then, fetch suggestions using the HTML from the crawl
      const results = await fetchSuggestions(formData, crawlResult.html);
      setSuggestions(results);
    } catch (error) {
      console.error("Error during audit:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCrawling(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Audit a Page</h1>
        <p className="text-muted-foreground">
          Enter a URL and optimization goal to get CRO suggestions
        </p>
      </header>

      <div className="mb-10">
        <AuditForm onSubmit={handleSubmit} isLoading={isLoading || isCrawling} />
      </div>

      {(isLoading || isCrawling) && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">
            {isCrawling ? "Crawling page..." : "Generating suggestions..."}
          </p>
        </div>
      )}

      {pageType && (
        <div className="mb-6 flex items-center">
          <Badge variant="outline" className="text-sm py-1 px-3">
            🧭 {pageType}
          </Badge>
          
          {screenshotPath && (
            <div className="ml-4 border rounded-md overflow-hidden w-16 h-16 bg-gray-100 flex-shrink-0">
              {/* This would be a real image in production */}
              <div 
                className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"
                style={{ backgroundImage: screenshotPath ? `url(${screenshotPath})` : 'none' }}
              >
                {!screenshotPath.startsWith('http') && 'Preview'}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !isCrawling && suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Suggestions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isCrawling && suggestions.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Submit the form to get optimization suggestions
        </div>
      )}
    </div>
  );
};

export default Index;
