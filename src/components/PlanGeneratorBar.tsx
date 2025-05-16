
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const PlanGeneratorBar = () => {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  
  const handleGeneratePlan = () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a goal to generate a plan",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Plan generation started",
      description: `Generating plan for: ${input}`,
    });
    
    // Future API call would go here
    console.log("Generating plan for:", input);
  };
  
  return (
    <div className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center gap-3 max-w-6xl">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. increase AOV"
            className="pr-4 w-full"
          />
        </div>
        <Button 
          onClick={handleGeneratePlan}
          className="whitespace-nowrap"
        >
          Generate Plan
        </Button>
      </div>
    </div>
  );
};
