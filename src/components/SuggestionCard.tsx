
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw, Pencil, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVariants, VariantRequest } from "@/services/auditService";

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type SuggestionCardProps = {
  suggestion: Suggestion;
  onAcceptToggle?: (isAccepted: boolean) => void;
  onEdit?: (editedSuggestion: Suggestion) => void;
};

const SuggestionCard = ({ suggestion: initialSuggestion, onAcceptToggle, onEdit }: SuggestionCardProps) => {
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editedDescription, setEditedDescription] = useState(suggestion.description);
  const [isEditingInline, setIsEditingInline] = useState(false);

  // Update editedDescription when initialSuggestion changes
  useEffect(() => {
    setSuggestion(initialSuggestion);
    setEditedDescription(initialSuggestion.description);
  }, [initialSuggestion]);

  const impactColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const handleAccept = () => {
    const newAcceptedState = !isAccepted;
    setIsAccepted(newAcceptedState);
    
    if (onAcceptToggle) {
      onAcceptToggle(newAcceptedState);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save the edited description
      const updatedSuggestion = {
        ...suggestion,
        description: editedDescription,
      };
      setSuggestion(updatedSuggestion);
      
      // Notify parent component of the edit
      if (onEdit && editedDescription !== initialSuggestion.description) {
        onEdit(updatedSuggestion);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // Prepare the request
      const request: VariantRequest = {
        suggestion_id: suggestion.id,
        original_text: suggestion.description,
      };
      
      // Call the fetchVariants function from auditService
      const newVariant = await fetchVariants(request);
      
      // Update the suggestion with the new variant
      const updatedSuggestion = {
        ...suggestion,
        description: newVariant.description || suggestion.description,
      };
      
      setSuggestion(updatedSuggestion);
      setEditedDescription(newVariant.description || suggestion.description);
      
      // Notify parent component of the edit
      if (onEdit && newVariant.description !== initialSuggestion.description) {
        onEdit(updatedSuggestion);
      }
    } catch (error) {
      console.error("Failed to regenerate suggestion:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleInlineEditToggle = () => {
    if (isEditingInline) {
      // Save changes when exiting inline edit mode
      const updatedSuggestion = {
        ...suggestion,
        description: editedDescription,
      };
      setSuggestion(updatedSuggestion);
      
      // Notify parent component of the edit
      if (onEdit && editedDescription !== initialSuggestion.description) {
        onEdit(updatedSuggestion);
      }
    } else {
      // Start with current description when entering edit mode
      setEditedDescription(suggestion.description);
    }
    setIsEditingInline(!isEditingInline);
  };

  const handleInlineDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDescription(e.target.value);
  };

  const handleInlineCancel = () => {
    setEditedDescription(suggestion.description);
    setIsEditingInline(false);
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
        ) : isEditingInline ? (
          <div className="relative">
            <textarea
              className="w-full border rounded-md p-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              value={editedDescription}
              onChange={handleInlineDescriptionChange}
              rows={3}
              autoFocus
            />
            <div className="flex mt-2 space-x-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleInlineCancel}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleInlineEditToggle}
              >
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <CardDescription 
            className="text-sm text-gray-600 relative group"
            onClick={handleInlineEditToggle}
          >
            {suggestion.description}
            <span className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Pencil size={14} />
              </Button>
            </span>
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
