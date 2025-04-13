
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SuggestionCard from "@/components/SuggestionCard";
import { Suggestion } from "@/services/auditService";

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    title: "Optimize Product Page Images",
    description: "Ensure all product images are high quality and optimized for fast loading.",
    impact: "high",
  },
  {
    id: "2",
    title: "Improve Mobile Responsiveness",
    description: "Make sure the website is fully responsive on all mobile devices.",
    impact: "medium",
  },
  {
    id: "3",
    title: "Add Customer Reviews Section",
    description: "Include a section for customer reviews to build trust and social proof.",
    impact: "high",
  },
];

const SuggestionReview = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleTagToggle = (suggestionId: string, tagId: string) => {
    console.log(`Toggling tag ${tagId} for suggestion ${suggestionId}`);
    // Here you would implement the logic to update the tag status
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Suggestion Review</h1>
      <Button onClick={handleGoBack} className="mb-4">
        Back to Dashboard
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onTagToggle={handleTagToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionReview;
