
import React, { useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LoadingIndicator } from './chat/LoadingIndicator';
import { WelcomeScreen } from './chat/WelcomeScreen';
import { useChatMessages } from '@/hooks/useChatMessages';

export { type MessageType, type ActionGroup, type Action } from '@/types/chat';

export const ChatInterface = () => {
  const { messages, isLoading, addUserMessage, addAIResponse, generateAIResponse } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Add user message
    addUserMessage(content);
    
    // Ensure scroll happens after user message is added
    setTimeout(scrollToBottom, 100);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate mock AI response
      const aiResponse = generateAIResponse(content);
      addAIResponse(aiResponse);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] relative bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {messages.length === 0 ? (
            <WelcomeScreen onExampleClick={handleSendMessage} />
          ) : (
            <MessageList messages={messages} />
          )}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
