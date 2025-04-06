
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type SuggestionCardProps = {
  suggestion: Suggestion;
};

const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
  const impactColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
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
        <CardDescription className="text-sm text-gray-600">
          {suggestion.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
