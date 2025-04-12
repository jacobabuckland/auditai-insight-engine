
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw, Pencil, Save, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  onReject?: (isRejected: boolean) => void;
  isRejected?: boolean;
};

const SuggestionCard = ({ 
  suggestion: initialSuggestion, 
  onAcceptToggle, 
  onEdit, 
  onReject,
  isRejected = false
}: SuggestionCardProps) => {
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editedDescription, setEditedDescription] = useState(suggestion.description);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [showRationale, setShowRationale] = useState(false);

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
    if (isRejected) return; // Can't accept if rejected
    
    const newAcceptedState = !isAccepted;
    setIsAccepted(newAcceptedState);
    
    if (onAcceptToggle) {
      onAcceptToggle(newAcceptedState);
    }
  };

  const handleReject = () => {
    if (isAccepted) return; // Can't reject if accepted
    
    const newRejectedState = !isRejected;
    
    if (onReject) {
      onReject(newRejectedState);
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

  const handleToggleRationale = () => {
    setShowRationale(!showRationale);
  };

  return (
    <Card className={`w-full transition-all hover:shadow-md ${
      isRejected ? 'border-red-200 bg-red-50' : 
      isAccepted ? 'border-green-200 bg-green-50' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            {isAccepted && (
              <span className="text-green-500">
                <Check size={16} />
              </span>
            )}
            {isRejected && (
              <span className="text-red-500">
                <X size={16} />
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
            onClick={!isRejected && !isAccepted ? handleInlineEditToggle : undefined}
          >
            {suggestion.description}
            {!isRejected && !isAccepted && (
              <span className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Pencil size={14} />
                </Button>
              </span>
            )}
          </CardDescription>
        )}
        
        <Collapsible open={showRationale} onOpenChange={setShowRationale}>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-gray-500 hover:text-gray-700">
                {showRationale ? "Hide rationale" : "Show rationale"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600">
                <div className="flex items-start mb-2">
                  <AlertCircle size={14} className="mr-2 mt-0.5 text-blue-500" />
                  <strong>Why we made this suggestion:</strong>
                </div>
                <p>This change could help improve the {suggestion.impact} impact area by addressing user behavior patterns we've observed. Testing shows similar approaches have increased conversion rates by approximately 8-12% in comparable scenarios.</p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        <div className="flex mt-4 space-x-2">
          <Button 
            variant={isAccepted ? "default" : "outline"}
            size="sm" 
            className={`${isAccepted ? 'bg-green-600 text-white hover:bg-green-700' : 'border-gray-200'} transition-colors`}
            onClick={handleAccept}
            disabled={isRejected}
          >
            <Check size={16} className="mr-1" />
            {isAccepted ? 'Accepted' : 'Accept'}
          </Button>
          <Button 
            variant={isRejected ? "default" : "outline"}
            size="sm"
            onClick={handleReject}
            disabled={isAccepted}
            className={`${isRejected ? 'bg-red-600 text-white hover:bg-red-700' : 'border-gray-200'} transition-colors`}
          >
            <X size={16} className="mr-1" />
            {isRejected ? 'Rejected' : 'Reject'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating || isRejected}
            className="border-gray-200"
          >
            <RefreshCcw size={16} className={`mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
            disabled={isRejected}
            className="border-gray-200"
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
