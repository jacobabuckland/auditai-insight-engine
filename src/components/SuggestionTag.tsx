
import React from "react";

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
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
};

export default SuggestionTag;
