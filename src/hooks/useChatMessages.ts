
import { useState } from 'react';
import { MessageType, ActionGroup } from '@/types/chat';

export const useChatMessages = () => {
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
      type: 'ai' as const,
      content: `Based on your goal to "${userInput}", I've analyzed your store data and identified several opportunities for improvement. The most impactful areas to focus on are product presentation, customer journey optimization, and post-purchase engagement.`,
      timestamp: new Date(),
      actions: actionGroups,
    };
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
