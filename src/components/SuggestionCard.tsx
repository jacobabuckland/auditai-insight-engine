
import React from "react";
import { Card } from "@/components/ui/card";
import { Suggestion } from "@/services/auditService";
import SuggestionTag from "./SuggestionTag";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onTagToggle: (suggestionId: string, tagId: string) => void;
}

// Mock tag data
const tags = [
  { id: "tag1", label: "Tag 1", active: false },
  { id: "tag2", label: "Tag 2", active: true },
  { id: "tag3", label: "Tag 3", active: false },
];

export default function SuggestionCard({ suggestion, onTagToggle }: SuggestionCardProps) {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{suggestion.title}</h3>
        <p className="text-sm text-gray-500">{suggestion.description}</p>
        <p className="text-xs mt-2">Impact: {suggestion.impact}</p>
      </div>
      
      <div className="flex gap-2 mt-3">
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
    </Card>
  );
}
