
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import SuggestionCard, { Suggestion } from "@/components/SuggestionCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Clock } from "lucide-react";

// Mock data - replace with actual API response
const mockAuditData = {
  url: "https://adanola.com/products/black-zip",
  goal: "Boost Email Signups",
  timestamp: new Date(),
  status: "Draft",
  screenshot: "/placeholder.svg",
  suggestions: [
    {
      id: "suggestion-1",
      title: "Add a trust badge near the CTA",
      description: "Adding social proof elements near the CTA can increase conversions by building trust.",
      type: "Design",
      target: ".cta-button",
      impact: "high" as const,
    },
    {
      id: "suggestion-2",
      title: "Change email signup placeholder text",
      description: "Use more compelling placeholder text like 'Get 10% off your first order'.",
      type: "Copy",
      target: "#email-signup-form",
      impact: "medium" as const,
    },
    {
      id: "suggestion-3",
      title: "Add urgency to product descriptions",
      description: "Include limited time or limited quantity messaging to create FOMO.",
      type: "Copy",
      target: ".product-description",
      impact: "medium" as const,
    },
    {
      id: "suggestion-4",
      title: "Improve mobile checkout button visibility",
      description: "Make the checkout button sticky on mobile to improve conversion rates.",
      type: "Design",
      target: ".checkout-button",
      impact: "high" as const,
    },
  ],
  rationale: "This page has several areas for optimization based on heatmap analysis and competitor benchmarking. The suggestions focus on improving trust signals and capturing more email signups."
};

const SuggestionReview = () => {
  const location = useLocation();
  const [auditData, setAuditData] = useState(mockAuditData);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [rejectedSuggestions, setRejectedSuggestions] = useState<string[]>([]);
  const [editedSuggestions, setEditedSuggestions] = useState<Map<string, Suggestion>>(new Map());

  // Handle suggestion status change
  const handleSuggestionAccepted = (suggestionId: string, isAccepted: boolean) => {
    if (isAccepted) {
      setAcceptedSuggestions(prev => [...prev, suggestionId]);
      setRejectedSuggestions(prev => prev.filter(id => id !== suggestionId));
    } else {
      setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
    }
  };

  // Handle suggestion rejection
  const handleSuggestionRejected = (suggestionId: string, isRejected: boolean) => {
    if (isRejected) {
      setRejectedSuggestions(prev => [...prev, suggestionId]);
      setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
    } else {
      setRejectedSuggestions(prev => prev.filter(id => id !== suggestionId));
    }
  };

  // Handle suggestion edit
  const handleSuggestionEdited = (editedSuggestion: Suggestion) => {
    setEditedSuggestions(prev => {
      const newMap = new Map(prev);
      newMap.set(editedSuggestion.id, editedSuggestion);
      return newMap;
    });
  };

  // Get suggestion display status
  const getSuggestionStatus = (suggestionId: string) => {
    if (acceptedSuggestions.includes(suggestionId)) return "accepted";
    if (rejectedSuggestions.includes(suggestionId)) return "rejected";
    return "draft";
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <Navigation />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audit Suggestions</h1>
        <p className="text-muted-foreground">
          Review AI-generated ideas to optimise this page
        </p>
      </header>

      {/* Context Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-1">Audited URL</h2>
                <div className="flex items-center">
                  <a 
                    href={auditData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {auditData.url}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-1">CRO Goal</h2>
                <Badge variant="outline" className="text-sm font-normal">
                  {auditData.goal}
                </Badge>
              </div>
              
              <div className="mb-4 flex items-center gap-4">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h2>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3" />
                    {format(auditData.timestamp, "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-1">Status</h2>
                  <Badge 
                    variant={auditData.status === "Draft" ? "outline" : "default"}
                    className={`
                      text-sm font-normal
                      ${auditData.status === "Reviewed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    `}
                  >
                    {auditData.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Page Preview</h2>
              <Tabs defaultValue="before">
                <TabsList className="mb-2">
                  <TabsTrigger value="before">Before</TabsTrigger>
                  <TabsTrigger value="after">After</TabsTrigger>
                </TabsList>
                <TabsContent value="before" className="mt-0">
                  <div className="border rounded-md overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                    <img 
                      src={auditData.screenshot} 
                      alt="Before optimization"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="after" className="mt-0">
                  <div className="border rounded-md overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                    <div className="text-sm text-gray-500">
                      After preview will be generated once changes are applied
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rationale Area */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Analysis Rationale</h2>
          <p className="text-gray-700">{auditData.rationale}</p>
        </CardContent>
      </Card>

      {/* Suggestion List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Suggestions</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50">
              {acceptedSuggestions.length} Accepted
            </Badge>
            <Badge variant="outline" className="bg-red-50">
              {rejectedSuggestions.length} Rejected
            </Badge>
            <Badge variant="outline">
              {auditData.suggestions.length - acceptedSuggestions.length - rejectedSuggestions.length} Pending
            </Badge>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {auditData.suggestions.map((suggestion) => {
            const editedSuggestion = editedSuggestions.get(suggestion.id);
            const displaySuggestion = editedSuggestion || suggestion;
            const status = getSuggestionStatus(suggestion.id);
            
            return (
              <SuggestionCardWithMetadata
                key={suggestion.id}
                suggestion={displaySuggestion}
                status={status}
                type={suggestion.type}
                target={suggestion.target}
                onAcceptToggle={(isAccepted) => handleSuggestionAccepted(suggestion.id, isAccepted)}
                onRejectToggle={(isRejected) => handleSuggestionRejected(suggestion.id, isRejected)}
                onEdit={handleSuggestionEdited}
                isEdited={!!editedSuggestion}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

type SuggestionCardWithMetadataProps = {
  suggestion: Suggestion;
  status: 'draft' | 'accepted' | 'rejected';
  type: string;
  target: string;
  onAcceptToggle: (isAccepted: boolean) => void;
  onRejectToggle: (isRejected: boolean) => void;
  onEdit: (editedSuggestion: Suggestion) => void;
  isEdited: boolean;
};

const SuggestionCardWithMetadata = ({
  suggestion,
  status,
  type,
  target,
  onAcceptToggle,
  onRejectToggle,
  onEdit,
  isEdited,
}: SuggestionCardWithMetadataProps) => {
  return (
    <div className={`rounded-lg overflow-hidden transition-all ${
      status === 'accepted' ? 'ring-2 ring-green-500' :
      status === 'rejected' ? 'opacity-60' : ''
    }`}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-b">
        <Badge variant="outline" className="bg-blue-50 text-blue-800">
          {type}
        </Badge>
        <span className="text-xs text-gray-500">{target}</span>
        {isEdited && (
          <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-800">
            Edited
          </Badge>
        )}
      </div>
      
      <SuggestionCard
        suggestion={suggestion}
        onAcceptToggle={(isAccepted) => {
          onAcceptToggle(isAccepted);
          if (isAccepted) onRejectToggle(false);
        }}
        onEdit={onEdit}
        onReject={(isRejected) => {
          onRejectToggle(isRejected);
          if (isRejected) onAcceptToggle(false);
        }}
        isRejected={status === 'rejected'}
      />
    </div>
  );
};

export default SuggestionReview;
