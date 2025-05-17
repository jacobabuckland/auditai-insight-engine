
import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Loader } from 'lucide-react';

export type MessageType = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: ActionGroup[];
};

export type ActionGroup = {
  category: string;
  actions: Action[];
};

export type Action = {
  id: string;
  title: string;
  description: string;
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Ensure scroll happens after user message is added
    setTimeout(scrollToBottom, 100);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate mock AI response
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Save the prompt to localStorage
      try {
        const previousPrompts = JSON.parse(localStorage.getItem('previousPrompts') || '[]');
        const newPrompt = {
          id: Date.now().toString(),
          text: content,
          createdAt: new Date(),
        };
        localStorage.setItem('previousPrompts', JSON.stringify([newPrompt, ...previousPrompts].slice(0, 20)));
      } catch (error) {
        console.error('Error saving prompt to localStorage:', error);
      }
    }, 1500);
  };

  const generateAIResponse = (userInput: string): MessageType => {
    const categories = ['Product', 'Merchandising', 'Lifecycle', 'Marketing'];
    
    // Generate 2-3 random action items per category
    const actionGroups: ActionGroup[] = categories.map(category => {
      const actionsCount = Math.floor(Math.random() * 2) + 2; // 2-3 actions
      const actions = Array.from({ length: actionsCount }, (_, i) => ({
        id: `${category}-${i}`,
        title: `${getRandomActionTitle(category)}`,
        description: getRandomActionDescription(),
      }));
      
      return {
        category,
        actions,
      };
    });

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: `Based on your goal to "${userInput}", I've analyzed your store data and identified several opportunities for improvement. The most impactful areas to focus on are product presentation, customer journey optimization, and post-purchase engagement.`,
      timestamp: new Date(),
      actions: actionGroups,
    };
  };
  
  const getRandomActionTitle = (category: string): string => {
    const titles = {
      'Product': [
        'Optimize product imagery',
        'Improve product descriptions',
        'Add social proof elements',
        'Highlight key features',
        'Add comparison tables'
      ],
      'Merchandising': [
        'Create product bundles',
        'Implement cross-sells',
        'Optimize pricing strategy',
        'Add urgency elements',
        'Improve collection pages'
      ],
      'Lifecycle': [
        'Set up abandoned cart flows',
        'Create post-purchase emails',
        'Implement loyalty program',
        'Optimize onboarding',
        'Add subscription options'
      ],
      'Marketing': [
        'Optimize ad targeting',
        'Create retargeting campaigns',
        'Implement influencer strategy',
        'Optimize SEO content',
        'Create social campaigns'
      ]
    };
    
    const categoryTitles = titles[category as keyof typeof titles] || titles['Product'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  };
  
  const getRandomActionDescription = (): string => {
    const descriptions = [
      'This will help improve customer engagement and increase conversion rates.',
      'This strategy has shown to boost AOV by 15-20% in similar stores.',
      'Implementing this can reduce cart abandonment and improve customer retention.',
      'Our data shows this approach can increase repeat purchases by up to 25%.',
      'This tactic can significantly improve customer lifetime value.',
      'This has been proven to increase click-through rates and conversions.'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] relative bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <h1 className="text-2xl font-bold mb-4">ConvertIQ Strategy Assistant</h1>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                Share your business goals and I'll analyze your store data to provide actionable strategies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                <button 
                  className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
                  onClick={() => handleSendMessage("Increase conversion rate")}
                >
                  <p className="font-medium">Increase conversion rate</p>
                </button>
                <button 
                  className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
                  onClick={() => handleSendMessage("Boost average order value")}
                >
                  <p className="font-medium">Boost average order value</p>
                </button>
                <button 
                  className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
                  onClick={() => handleSendMessage("Reduce cart abandonment")}
                >
                  <p className="font-medium">Reduce cart abandonment</p>
                </button>
                <button 
                  className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left"
                  onClick={() => handleSendMessage("Improve customer retention")}
                >
                  <p className="font-medium">Improve customer retention</p>
                </button>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          {isLoading && (
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm my-4">
              <Loader className="h-5 w-5 animate-spin text-blue-500 mr-3" />
              <span>🧠 ConvertIQ is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
