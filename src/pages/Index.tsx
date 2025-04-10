
import React, { useState, useMemo } from "react";
import AuditForm from "@/components/AuditForm";
import SuggestionCard, { Suggestion } from "@/components/SuggestionCard";
import { fetchSuggestions, AuditFormData, crawlPage, applyHtmlSuggestions } from "@/services/auditService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import PreviewPanel from "@/components/PreviewPanel";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [editedSuggestions, setEditedSuggestions] = useState<Map<string, Suggestion>>(new Map());
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [pageType, setPageType] = useState<string | null>(null);
  const [screenshotPath, setScreenshotPath] = useState<string | null>(null);
  const [originalHtml, setOriginalHtml] = useState<string>("");
  const { toast } = useToast();

  // Use edited suggestions when available, otherwise use original suggestions
  const displayedSuggestions = useMemo(() => {
    return suggestions.map(suggestion => {
      const edited = editedSuggestions.get(suggestion.id);
      return edited || suggestion;
    });
  }, [suggestions, editedSuggestions]);

  // Calculate modified HTML based on accepted suggestions (using edited versions when available)
  const modifiedHtml = useMemo(() => {
    // Map through accepted suggestions and replace with edited versions if they exist
    const acceptedWithEdits = acceptedSuggestions.map(suggestion => {
      const edited = editedSuggestions.get(suggestion.id);
      return edited || suggestion;
    });
    
    return applyHtmlSuggestions(originalHtml, acceptedWithEdits);
  }, [originalHtml, acceptedSuggestions, editedSuggestions]);

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
    setAcceptedSuggestions([]);
    setPageType(null);
    setScreenshotPath(null);
    setOriginalHtml("");

    try {
      // First, crawl the page using the real API
      const crawlResult = await crawlPage(formData.page_url);
      
      if (!crawlResult.success) {
        throw new Error("Crawling failed");
      }
      
      setIsCrawling(false);
      setPageType(crawlResult.page_type || null);
      setScreenshotPath(crawlResult.screenshot_path || null);
      setOriginalHtml(crawlResult.html || "");
      
      // Then, fetch suggestions using the real API
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

  // Handler for when a suggestion is accepted
  const handleSuggestionAccepted = (suggestion: Suggestion, isAccepted: boolean) => {
    if (isAccepted) {
      // If the suggestion has been edited, use the edited version when accepting
      const suggestionToAdd = editedSuggestions.get(suggestion.id) || suggestion;
      setAcceptedSuggestions(prev => [...prev, suggestionToAdd]);
    } else {
      setAcceptedSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    }
  };

  // Handler for when a suggestion is edited
  const handleSuggestionEdited = (editedSuggestion: Suggestion) => {
    // Store the edited suggestion in the Map
    setEditedSuggestions(prev => {
      const newMap = new Map(prev);
      newMap.set(editedSuggestion.id, editedSuggestion);
      return newMap;
    });
    
    // If this suggestion was already accepted, update its content in the accepted list too
    if (acceptedSuggestions.some(s => s.id === editedSuggestion.id)) {
      setAcceptedSuggestions(prev => 
        prev.map(s => s.id === editedSuggestion.id ? editedSuggestion : s)
      );
    }

    toast({
      title: "Suggestion Updated",
      description: "Your changes have been saved locally.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <Navigation />
      
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

      {!isLoading && !isCrawling && originalHtml && (
        <PreviewPanel 
          originalHtml={originalHtml} 
          modifiedHtml={modifiedHtml}
          acceptedSuggestions={acceptedSuggestions}
        />
      )}

      {!isLoading && !isCrawling && suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Suggestions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {displayedSuggestions.map((suggestion) => (
              <SuggestionCard 
                key={suggestion.id} 
                suggestion={suggestion} 
                onAcceptToggle={(isAccepted) => handleSuggestionAccepted(suggestion, isAccepted)}
                onEdit={handleSuggestionEdited}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isCrawling && suggestions.length === 0 && !originalHtml && (
        <div className="text-center py-10 text-muted-foreground">
          Submit the form to get optimization suggestions
        </div>
      )}
    </div>
  );
};

export default Index;
