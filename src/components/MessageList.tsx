
import React from 'react';
import { MessageType } from './ChatInterface';
import { ActionCard } from './ActionCard';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center px-4 py-8 max-w-md">
          Ask ConvertIQ a business goal, like 'increase AOV' or 'promote denim this week'.
        </p>
      </div>
    );
  }

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
              <h2 className="text-lg font-semibold">🧠 AI Reasoning</h2>
              <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md mb-6">{message.content}</p>
              
              {message.actions && message.actions.length > 0 && (
                <div className="mt-6 space-y-6">
                  {/* Primary Recommendation (first action from first group) */}
                  {(() => {
                    // Find a primary recommendation (first action of first group with actions)
                    const primaryGroup = message.actions.find(group => group.actions && group.actions.length > 0);
                    const primaryAction = primaryGroup?.actions[0];
                    
                    if (primaryAction) {
                      return (
                        <Card className="border-l-4 border-l-green-500 bg-green-50/50 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg">{primaryAction.title}</h3>
                              <Badge className="bg-green-600">High Impact</Badge>
                            </div>
                            <p className="text-gray-800 mb-4">{primaryAction.description}</p>
                            <div className="bg-white p-3 rounded-md border border-gray-100 mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Strategic Justification</h4>
                              <p className="text-sm text-gray-600">
                                We chose this strategy because it directly addresses your goal while maintaining 
                                balance between performance and innovation. This approach optimizes for both immediate 
                                results and long-term strategic positioning in your market segment.
                              </p>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <ActionCard 
                                title={primaryAction.title} 
                                description={primaryAction.description}
                                isPrimary={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Supporting Tactics */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-700 mb-4">Supporting Tactics</h3>
                    {message.actions.map((group, groupIndex) => (
                      <div key={`${group.category}-${groupIndex}`} className="space-y-3 mb-6">
                        <h4 className="font-medium text-md border-b pb-1">
                          {group.category}
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {group.actions.slice(groupIndex === 0 ? 1 : 0).map((action) => (
                            <ActionCard 
                              key={action.id} 
                              title={action.title} 
                              description={action.description} 
                            />
                          ))}
                          {group.actions.length === 1 && groupIndex === 0 && (
                            <p className="text-sm text-gray-500 italic">Additional tactics will appear here.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
