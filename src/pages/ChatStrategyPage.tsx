
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PreviousPromptsSidebar } from '@/components/PreviousPromptsSidebar';
import { useShop } from '@/contexts/ShopContext';

type PreviousPrompt = {
  id: string;
  text: string;
  createdAt: Date;
};

const ChatStrategyPage = () => {
  const navigate = useNavigate();
  const { shopDomain } = useShop();
  const [previousPrompts, setPreviousPrompts] = React.useState<PreviousPrompt[]>([]);
  
  // Load saved prompts from localStorage on component mount
  React.useEffect(() => {
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
  
  const handlePromptSelect = (promptText: string) => {
    // This will be used by the ChatInterface component
    // to set the input text when a previous prompt is selected
    const chatInterface = document.querySelector('input[type="text"], textarea');
    if (chatInterface instanceof HTMLInputElement || chatInterface instanceof HTMLTextAreaElement) {
      chatInterface.value = promptText;
      chatInterface.focus();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex">
        <PreviousPromptsSidebar 
          prompts={previousPrompts}
          onPromptSelect={handlePromptSelect}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
            <div className="container mx-auto flex items-center gap-3 max-w-6xl">
              <SidebarTrigger className="flex-shrink-0" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/suggestions')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Suggestions
              </Button>
              <div className="flex-grow">
                <h1 className="text-xl font-bold">Strategy Assistant</h1>
              </div>
            </div>
          </div>
          
          <ChatInterface />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatStrategyPage;
