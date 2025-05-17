
import React from 'react';

type WelcomeScreenProps = {
  onExampleClick: (content: string) => void;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-2xl font-bold mb-4">ConvertIQ Strategy Assistant</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Share your business goals and I'll analyze your store data to provide actionable strategies.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <button 
          className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
          onClick={() => onExampleClick("Increase conversion rate")}
        >
          <p className="font-medium">Increase conversion rate</p>
        </button>
        <button 
          className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
          onClick={() => onExampleClick("Boost average order value")}
        >
          <p className="font-medium">Boost average order value</p>
        </button>
        <button 
          className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
          onClick={() => onExampleClick("Reduce cart abandonment")}
        >
          <p className="font-medium">Reduce cart abandonment</p>
        </button>
        <button 
          className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
          onClick={() => onExampleClick("Improve customer retention")}
        >
          <p className="font-medium">Improve customer retention</p>
        </button>
      </div>
    </div>
  );
};
