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
import { Loader2, FileText } from "lucide-react";

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

const MOCK_AUDIT_HISTORY = [
  {
    id: "1",
    pageType: "Home",
    url: "https://www.convertiq.shop/",
    date: "2025-04-24T15:30:00Z",
    suggestionCount: 5
  },
  {
    id: "2",
    pageType: "Product",
    url: "https://www.convertiq.shop/products/example",
    date: "2025-04-23T10:15:00Z",
    suggestionCount: 3
  },
  {
    id: "3",
    pageType: "Contact",
    url: "https://www.convertiq.shop/contact",
    date: "2025-04-22T09:45:00Z",
    suggestionCount: 2
  }
];

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
      
      setAuditResult(data);
      
      toast({
        title: "Success",
        description: "Audit completed successfully!",
      });
      
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Welcome to your CRO Assistant
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Run audits, review suggestions, and optimise your store for conversions.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                <FileText className="h-4 w-4" />
                Start New Audit
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Run Page Audit</CardTitle>
            <CardDescription>
              Select a page from your store to analyze for conversion optimization opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs">
              <Select
                value={selectedUrl}
                onValueChange={setSelectedUrl}
                disabled={isRunningAudit}
              >
                <SelectTrigger>
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
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Audit History</CardTitle>
            <CardDescription>Your recent store audits</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Type</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Suggestions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_AUDIT_HISTORY.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">{audit.pageType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {audit.url}
                    </TableCell>
                    <TableCell>{formatDate(audit.date)}</TableCell>
                    <TableCell className="text-center">{audit.suggestionCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('View suggestions for:', audit.id)}
                      >
                        View Suggestions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Latest Audit Suggestions</h2>
          
          {auditError && (
            <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-lg">
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
          
          {!auditResult && !auditError && (
            <div className="text-center py-8 text-muted-foreground">
              Run an audit to see suggestions for improving your store's conversion rate.
            </div>
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
      </div>
    </div>
  );
};

export default SuggestionReview;
