
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type SuggestionCardProps = {
  suggestion: Suggestion;
};

const SuggestionCard = ({ suggestion: initialSuggestion }: SuggestionCardProps) => {
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editedDescription, setEditedDescription] = useState(suggestion.description);

  const impactColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const handleAccept = () => {
    setIsAccepted(!isAccepted);
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save the edited description
      setSuggestion({
        ...suggestion,
        description: editedDescription,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // Simulate API call to /variants
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestion_id: suggestion.id,
          original_text: suggestion.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // Update the suggestion with the new variant
      setSuggestion({
        ...suggestion,
        description: data.description || suggestion.description,
      });
    } catch (error) {
      console.error("Failed to regenerate suggestion:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className={`w-full transition-all ${isAccepted ? 'border-2 border-green-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            {isAccepted && (
              <span className="text-green-500">
                <Check size={16} />
              </span>
            )}
            {suggestion.title}
          </CardTitle>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              impactColors[suggestion.impact]
            }`}
          >
            {suggestion.impact} impact
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isRegenerating ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : isEditing ? (
          <textarea
            className="w-full border rounded-md p-2 text-sm text-gray-600"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={3}
          />
        ) : (
          <CardDescription className="text-sm text-gray-600">
            {suggestion.description}
          </CardDescription>
        )}
        
        <div className="flex mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isAccepted ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
            onClick={handleAccept}
          >
            <Check size={16} className="mr-1" />
            {isAccepted ? 'Accepted' : 'Accept'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCcw size={16} className={`mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
          >
            <Pencil size={16} className="mr-1" />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
