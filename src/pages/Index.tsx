
import React, { useState } from "react";
import AuditForm from "@/components/AuditForm";
import SuggestionCard, { Suggestion } from "@/components/SuggestionCard";
import { fetchSuggestions, AuditFormData } from "@/services/auditService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setSuggestions([]);

    try {
      const results = await fetchSuggestions(formData);
      setSuggestions(results);
    } catch (error) {
      console.error("Error during audit:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        <AuditForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Suggestions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && suggestions.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Submit the form to get optimization suggestions
        </div>
      )}
    </div>
  );
};

export default Index;
