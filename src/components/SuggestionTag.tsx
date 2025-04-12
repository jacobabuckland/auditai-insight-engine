
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check } from "lucide-react";

export type TagOption = {
  id: string;
  label: string;
  description: string;
  color?: string;
};

export const tagOptions: TagOption[] = [
  {
    id: "quick-win",
    label: "Quick Win",
    description: "Can be implemented with minimal effort for immediate impact",
    color: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  {
    id: "needs-dev",
    label: "Needs Dev",
    description: "Requires developer resources to implement",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  },
  {
    id: "copy-change",
    label: "Copy Change",
    description: "Text or content modifications only",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  },
  {
    id: "design",
    label: "Design",
    description: "Visual or UI design improvements",
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200"
  }
];

type SuggestionTagProps = {
  tagId: string;
  isSelected: boolean;
  onToggle: (tagId: string) => void;
};

const SuggestionTag = ({ tagId, isSelected, onToggle }: SuggestionTagProps) => {
  const tag = tagOptions.find(t => t.id === tagId);
  
  if (!tag) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`cursor-pointer transition-all ${tag.color} ${isSelected ? 'ring-1 ring-inset' : 'opacity-70'}`}
            onClick={() => onToggle(tagId)}
          >
            {isSelected && <Check size={12} className="mr-1" />}
            {tag.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tag.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SuggestionTag;
