
import { useState } from 'react';
import { MessageType, ActionGroup } from '@/types/chat';
import { fetchStrategyPlan } from '@/services/auditService';
import { toast } from "@/components/ui/use-toast";

export const useChatMessages = (shopDomain: string | null) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addUserMessage = (content: string): MessageType => {
    const userMessage: MessageType = {
      id: Date.now().toString(),
      type: 'user' as const,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    return userMessage;
  };

  const addAIResponse = (aiResponse: MessageType) => {
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
    
    // Save the prompt to localStorage
    try {
      const previousPrompts = JSON.parse(localStorage.getItem('previousPrompts') || '[]');
      const newPrompt = {
        id: Date.now().toString(),
        text: messages[messages.length - 1]?.content || '',
        createdAt: new Date(),
      };
      localStorage.setItem('previousPrompts', JSON.stringify([newPrompt, ...previousPrompts].slice(0, 20)));
    } catch (error) {
      console.error('Error saving prompt to localStorage:', error);
    }
  };

  const generateAIResponse = async (userInput: string) => {
    try {
      // Call the API to get the strategy plan
      const response = await fetchStrategyPlan(userInput, shopDomain);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to generate strategy");
      }
      
      // Process the API response into action groups
      const categories = ['Product', 'Merchandising', 'Lifecycle', 'Marketing'];
      const actionGroups: ActionGroup[] = [];
      
      // Parse the response into action groups if suggestions exist
      if (response.suggestions && Array.isArray(response.suggestions)) {
        // Group suggestions by category
        const groupedSuggestions = response.suggestions.reduce((acc: Record<string, any[]>, suggestion: any) => {
          const category = suggestion.category || 'Product';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(suggestion);
          return acc;
        }, {});
        
        // Create action groups from grouped suggestions
        Object.entries(groupedSuggestions).forEach(([category, suggestions]) => {
          const actions = suggestions.map((suggestion: any, index: number) => ({
            id: `${category}-${index}`,
            title: suggestion.text || suggestion.title || 'Suggestion',
            description: suggestion.description || suggestion.rationale || '',
          }));
          
          actionGroups.push({
            category,
            actions,
          });
        });
      } else if (response.plan) {
        // If no structured suggestions but we have a plan, create a simple action group
        const items = (response.plan as string).split('\n\n').filter(Boolean).slice(0, 3);
        
        categories.forEach((category, index) => {
          const actions = [{
            id: `${category}-0`,
            title: category,
            description: items[index] || `${category} strategy recommendation`,
          }];
          
          actionGroups.push({
            category,
            actions,
          });
        });
      }
      
      // Create AI response message
      const aiResponse: MessageType = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: response.reasoning || response.rationale || `Based on your goal to "${userInput}", I've analyzed your store data and identified several opportunities for improvement.`,
        timestamp: new Date(),
        actions: actionGroups.length > 0 ? actionGroups : undefined,
      };
      
      // Add the AI response to the messages
      addAIResponse(aiResponse);
      return aiResponse;
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Create an error message response
      const errorResponse: MessageType = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: `I'm sorry, I encountered an error while generating recommendations. Please try again later.`,
        timestamp: new Date(),
      };
      
      addAIResponse(errorResponse);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations",
        variant: "destructive",
      });
      
      return errorResponse;
    }
  };

  return {
    messages,
    isLoading,
    addUserMessage,
    addAIResponse,
    generateAIResponse,
    setIsLoading,
  };
};
