
import React from "react";
import { Badge } from "@/components/ui/badge";

export interface SuggestionTagProps {
  tagId: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SuggestionTag: React.FC<SuggestionTagProps> = ({
  tagId,
  label,
  active,
  onClick,
}) => {
  return (
    <Badge
      role="button"
      onClick={onClick}
      variant={active ? "default" : "secondary"}
      className="cursor-pointer transition-colors hover:bg-secondary"
    >
      {label}
    </Badge>
  );
};

export default SuggestionTag;
