
import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm my-4">
      <Loader className="h-5 w-5 animate-spin text-blue-500 mr-3" />
      <span>🧠 ConvertIQ is thinking...</span>
    </div>
  );
};
