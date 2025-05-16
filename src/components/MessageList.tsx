
import React from 'react';
import { MessageType } from './ChatInterface';
import { ActionCard } from './ActionCard';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-6 pb-24">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`rounded-lg ${
            message.type === 'user' 
              ? 'bg-gray-100 text-gray-800' 
              : 'bg-white text-gray-800 shadow-sm border border-gray-100'
          } p-4`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">
              {message.type === 'user' ? 'You' : 'ConvertIQ Assistant'}
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </div>
          </div>
          
          {message.type === 'user' ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">🧠 AI Reasoning</h2>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.actions && message.actions.length > 0 && (
                <div className="mt-6 space-y-6">
                  {message.actions.map((group) => (
                    <div key={group.category} className="space-y-3">
                      <h3 className="font-medium text-md border-b pb-1">
                        {group.category}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {group.actions.map((action) => (
                          <ActionCard 
                            key={action.id} 
                            title={action.title} 
                            description={action.description} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
