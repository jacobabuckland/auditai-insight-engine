
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PreviousPromptsSidebar } from './PreviousPromptsSidebar';

type PreviousPrompt = {
  id: string;
  text: string;
  createdAt: Date;
};

export const PlanGeneratorBar = () => {
  const [input, setInput] = useState('');
  const [previousPrompts, setPreviousPrompts] = useState<PreviousPrompt[]>([]);
  const { toast } = useToast();
  
  // Load saved prompts from localStorage on component mount
  useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('previousPrompts');
      if (savedPrompts) {
        const parsedPrompts = JSON.parse(savedPrompts).map((prompt: any) => ({
          ...prompt,
          createdAt: new Date(prompt.createdAt)
        }));
        setPreviousPrompts(parsedPrompts);
      }
    } catch (error) {
      console.error('Error loading previous prompts:', error);
    }
  }, []);
  
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
    
    // Save the prompt to history
    const newPrompt = {
      id: uuidv4(),
      text: input.trim(),
      createdAt: new Date()
    };
    
    const updatedPrompts = [newPrompt, ...previousPrompts].slice(0, 20); // Keep only the 20 most recent prompts
    setPreviousPrompts(updatedPrompts);
    
    // Store in localStorage
    try {
      localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('Error saving prompts to localStorage:', error);
    }
    
    // Future API call would go here
    console.log("Generating plan for:", input);
  };
  
  const handlePromptSelect = (promptText: string) => {
    setInput(promptText);
  };
  
  return (
    <SidebarProvider>
      <div className="flex">
        <PreviousPromptsSidebar 
          prompts={previousPrompts}
          onPromptSelect={handlePromptSelect}
        />
        
        <div className="flex-1">
          <div className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
            <div className="container mx-auto flex items-center gap-3 max-w-6xl">
              <SidebarTrigger className="flex-shrink-0" />
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
        </div>
      </div>
    </SidebarProvider>
  );
};
