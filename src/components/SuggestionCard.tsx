import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suggestion } from "@/services/auditService";
import { Image, Gear, Info } from "lucide-react";
import SuggestionTag from "./SuggestionTag";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onTagToggle: (suggestionId: string, tagId: string) => void;
}

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

const getSuggestionIcon = (title: string) => {
  if (title.toLowerCase().includes("image") || title.toLowerCase().includes("visual")) {
    return <Image className="h-5 w-5" />;
  }
  if (title.toLowerCase().includes("performance") || title.toLowerCase().includes("speed")) {
    return <Gear className="h-5 w-5" />;
  }
  return <Info className="h-5 w-5" />;
};

// Mock tag data (keep the same as before)
const tags = [
  { id: "tag1", label: "Tag 1", active: false },
  { id: "tag2", label: "Tag 2", active: true },
  { id: "tag3", label: "Tag 3", active: false },
];

export default function SuggestionCard({ suggestion, onTagToggle }: SuggestionCardProps) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-muted-foreground">
            {getSuggestionIcon(suggestion.title)}
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold leading-none tracking-tight">
                  {suggestion.title}
                </h3>
                <Badge variant={getImpactColor(suggestion.impact)} className="capitalize">
                  {suggestion.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <SuggestionTag
                    key={tag.id}
                    tagId={tag.id}
                    label={tag.label}
                    active={tag.active}
                    onClick={() => onTagToggle(suggestion.id, tag.id)}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => console.log("Preview fix for:", suggestion.id)}
              >
                Preview Fix
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
