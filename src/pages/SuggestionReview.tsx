
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SuggestionCard from "@/components/SuggestionCard";
import { Suggestion } from "@/services/auditService";
import { useShop } from "@/contexts/ShopContext";
import { toast } from "@/components/ui/use-toast";

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

const PAGE_OPTIONS = [
  { label: "Home Page", value: "/" },
  { label: "Product Page", value: "/products/example-product" },
  { label: "Collection Page", value: "/collections/example-collection" },
];

const SuggestionReview = () => {
  const navigate = useNavigate();
  const { shopDomain } = useShop();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [selectedPath, setSelectedPath] = useState<string>(PAGE_OPTIONS[0].value);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleTagToggle = (suggestionId: string, tagId: string) => {
    console.log(`Toggling tag ${tagId} for suggestion ${suggestionId}`);
    // Here you would implement the logic to update the tag status
  };

  const handleSubmit = () => {
    if (!shopDomain) {
      toast({
        title: "Error",
        description: "Missing Shopify domain — please refresh the app.",
        variant: "destructive",
      });
      return;
    }
    
    // Construct the full URL using the shop domain and selected path
    const crawlUrl = `https://${shopDomain}${selectedPath}`;
    console.log("Form submitted with URL:", crawlUrl);
    
    // Here you would implement the form submission logic sending the crawlUrl
    // This would typically use the crawlPage function from auditService.ts
    // For example: crawlPage(crawlUrl, shopDomain)
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Suggestion Review</h1>
      <Button onClick={handleGoBack} className="mb-4">
        Back to Dashboard
      </Button>
      
      <div className="mb-6 max-w-xs">
        <label htmlFor="page-select" className="block text-sm font-medium mb-2">
          Select Page Type
        </label>
        <Select
          value={selectedPath}
          onValueChange={setSelectedPath}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a page type" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleSubmit} className="mb-6">
        Apply to Selected Page
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
