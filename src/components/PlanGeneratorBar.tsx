
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PreviousPromptsSidebar } from './PreviousPromptsSidebar';
import { Loader } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';

type PreviousPrompt = {
  id: string;
  text: string;
  createdAt: Date;
};

type PlanResult = {
  plan?: string;
  error?: string;
};

export const PlanGeneratorBar = () => {
  const [input, setInput] = useState('');
  const [previousPrompts, setPreviousPrompts] = useState<PreviousPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const { toast } = useToast();
  const { shopDomain } = useShop();
  
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
  
  const handleGeneratePlan = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a goal to generate a plan",
        variant: "destructive",
      });
      return;
    }

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
    
    // Start loading and reset previous result
    setIsLoading(true);
    setPlanResult(null);
    
    try {
      const response = await fetch('https://auditai-insight-engine-1.onrender.com/agent/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          goal: input.trim(),
          shopDomain: shopDomain
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }
      
      setPlanResult({ plan: data.plan });
      
      toast({
        title: "Plan generated",
        description: "Your plan has been successfully created",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      setPlanResult({ 
        error: error instanceof Error ? error.message : 'Failed to generate plan'
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate plan',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        
        <div className="flex-1 flex flex-col">
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Plan'
                )}
              </Button>
            </div>
          </div>
          
          {/* Results section */}
          {(planResult || isLoading) && (
            <div className="container mx-auto p-4 max-w-6xl">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader className="animate-spin h-8 w-8 mb-4" />
                  <p className="text-lg">Generating your plan...</p>
                </div>
              ) : planResult?.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-red-700 mb-2">Error generating plan</h2>
                  <p className="text-red-600">{planResult.error}</p>
                </div>
              ) : planResult?.plan ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Your Conversion Rate Optimization Plan</h2>
                  <div className="whitespace-pre-wrap">
                    {planResult.plan}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};
