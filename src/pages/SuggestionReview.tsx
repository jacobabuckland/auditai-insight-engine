
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import SuggestionCard from "@/components/SuggestionCard";
import { Suggestion } from "@/services/auditService";
import { useShop } from "@/contexts/ShopContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Updated page options with real URLs
const DEFAULT_OPTIONS = [
  { label: "Home Page", value: "https://www.convertiq.shop/" },
  { label: "Product Catalogue", value: "https://www.convertiq.shop/products" },
  { label: "Contact Page", value: "https://www.convertiq.shop/pages/contact" },
];

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

// New type for audit results
type AuditResult = {
  url: string;
  title: string;
  html?: string;
  headings?: string[];
  ctas?: string[];
  forms?: string[];
  page_type?: string;
  screenshot_url?: string;
};

const SuggestionReview = () => {
  const navigate = useNavigate();
  const { shopDomain } = useShop();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [selectedUrl, setSelectedUrl] = useState<string>("https://www.convertiq.shop/");
  const [pageOptions, setPageOptions] = useState(DEFAULT_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageOptions = async () => {
      if (!shopDomain) return;

      try {
        const response = await fetch(`/api/choices`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.options && data.options.length > 0) {
          setPageOptions(data.options);
          setSelectedUrl(data.options[0].value);
        }
      } catch (error) {
        console.error("Error fetching page options:", error);
        toast({
          title: "Error",
          description: "Failed to load page options. Using defaults.",
          variant: "destructive",
        });
      }
    };

    fetchPageOptions();
  }, [shopDomain]);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleTagToggle = (suggestionId: string, tagId: string) => {
    console.log(`Toggling tag ${tagId} for suggestion ${suggestionId}`);
    // Logic to update tag status
  };

  const handleRunAudit = async () => {
    if (!shopDomain) {
      toast({
        title: "Error",
        description: "Missing Shopify domain — please refresh the app.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedUrl) {
      toast({
        title: "Error",
        description: "Please select a page to audit.",
        variant: "destructive",
      });
      return;
    }
    
    // Clear previous results and set loading state
    setAuditResult(null);
    setAuditError(null);
    setIsRunningAudit(true);
    
    try {
      const response = await fetch("https://auditai-insight-engine-1.onrender.com/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shop-Domain": shopDomain
        },
        body: JSON.stringify({
          url: selectedUrl,
          shop: shopDomain
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Audit response:", data);
      
      // Store the audit result
      setAuditResult(data);
      
      toast({
        title: "Success",
        description: "Audit completed successfully!",
      });
      
      // If the API returns suggestions directly, update them
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Failed to run audit:", error);
      setAuditError("Audit failed to return results.");
      toast({
        title: "Error",
        description: "Audit failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunningAudit(false);
    }
  };

  // Helper function to render a list of items in a card
  const renderListCard = (title: string, items: string[] = [], icon?: React.ReactNode) => {
    if (!items || items.length === 0) return null;
    
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="bg-muted/50 p-2 rounded-md text-sm">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Suggestion Review</h1>
      <Button onClick={handleGoBack} className="mb-4">
        Back to Dashboard
      </Button>
      
      <div className="mb-6 max-w-xs">
        <label htmlFor="page-select" className="block text-sm font-medium mb-2">
          Page to audit
        </label>
        <Select
          value={selectedUrl}
          onValueChange={setSelectedUrl}
          disabled={isRunningAudit}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "Loading options..." : "Select a page type"} />
          </SelectTrigger>
          <SelectContent>
            {pageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleRunAudit} 
        className="mb-6" 
        disabled={isRunningAudit || !selectedUrl}
      >
        {isRunningAudit ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running audit...
          </>
        ) : (
          "Run Audit"
        )}
      </Button>

      {auditError && (
        <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-lg mb-6">
          {auditError}
        </div>
      )}
      
      {auditResult && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
            <CardDescription>
              Results for <span className="font-bold">{auditResult.url}</span>
              {auditResult.page_type && (
                <span> (Page Type: <span className="font-bold capitalize">{auditResult.page_type}</span>)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {auditResult.screenshot_url && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Page Screenshot</h3>
                <img 
                  src={auditResult.screenshot_url} 
                  alt="Page Screenshot" 
                  className="w-full max-w-3xl rounded-lg border shadow-sm" 
                />
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-2">Page Information</h3>
            <Table className="mb-6">
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Title</TableCell>
                  <TableCell>{auditResult.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">URL</TableCell>
                  <TableCell>{auditResult.url}</TableCell>
                </TableRow>
                {auditResult.page_type && (
                  <TableRow>
                    <TableCell className="font-medium">Page Type</TableCell>
                    <TableCell className="capitalize">{auditResult.page_type}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderListCard("Headings", auditResult.headings)}
              {renderListCard("Call to Actions", auditResult.ctas)}
              {renderListCard("Forms", auditResult.forms)}
            </div>
          </CardContent>
        </Card>
      )}
      
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
