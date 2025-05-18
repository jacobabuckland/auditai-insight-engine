
import React, { useState } from 'react';
import { MessageType } from './ChatInterface';
import { ActionCard } from './ActionCard';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Target } from 'lucide-react';
import { Button } from './ui/button';
import { SuggestionPreviewDrawer } from './SuggestionPreviewDrawer';
import { Action } from '@/types/chat';
import { toast } from "./ui/use-toast";

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [previewingSuggestion, setPreviewingSuggestion] = useState<Action | null>(null);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center px-4 py-8 max-w-md">
          Ask ConvertIQ a business goal, like 'increase AOV' or 'promote denim this week'.
        </p>
      </div>
    );
  }

  // Function to format the reasoning text with highlighted keywords
  const formatReasoning = (text: string) => {
    // Keywords to highlight
    const keywords = [
      'High stock', 'Low stock', 'Hero banner', 'High CTR', 'Low CTR', 
      'Maintain AOV', 'Increase AOV', 'Conversion rate', 'Traffic', 
      'Visibility', 'Bounce rate', 'without', 'zone', 'or conversion'
    ];
    
    // Function to highlight words or phrases
    let formattedText = text;
    keywords.forEach(keyword => {
      // Case insensitive replace with regex
      const regex = new RegExp(`(${keyword})`, 'gi');
      formattedText = formattedText.replace(regex, (match) => {
        // Determine the appropriate color class based on keyword
        let colorClass = 'text-purple-600';
        if (match.toLowerCase().includes('high') || match.toLowerCase() === 'without') {
          colorClass = 'text-green-600';
        } else if (match.toLowerCase().includes('low')) {
          colorClass = 'text-red-600';
        } else if (match.toLowerCase() === 'zone') {
          colorClass = 'text-amber-600';
        } else if (match.toLowerCase().includes('conversion')) {
          colorClass = 'text-purple-600';
        }
        
        return `<span class="font-semibold ${colorClass}">${match}</span>`;
      });
    });
    
    // Convert the text into paragraphs or bullet points
    if (formattedText.includes('\n')) {
      // If there are line breaks, convert to bullet points
      const lines = formattedText.split('\n').filter(line => line.trim() !== '');
      
      return (
        <ul className="list-disc pl-5 space-y-1">
          {lines.map((line, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </ul>
      );
    }
    
    // If it's a single paragraph, return it as is
    return <p dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const handlePreviewSuggestion = (action: Action) => {
    setPreviewingSuggestion(action);
  };

  const handleLaunchSuggestion = () => {
    toast({
      title: "Suggestion Launched",
      description: "Your suggestion has been successfully launched.",
    });
    setPreviewingSuggestion(null);
  };

  const handleRefineSuggestion = () => {
    if (previewingSuggestion) {
      const inputElement = document.querySelector('input[type="text"], textarea') as HTMLInputElement | HTMLTextAreaElement;
      if (inputElement) {
        inputElement.value = `Refine this suggestion to use a more bold CTA and increase urgency: "${previewingSuggestion.title}"`;
        inputElement.focus();
      }
    }
    setPreviewingSuggestion(null);
  };

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
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <span role="img" aria-label="brain">🧠</span> Why this strategy works
                </h2>
                <div className="text-gray-700">
                  {formatReasoning(message.content)}
                </div>
              </div>
              
              {message.actions && message.actions.length > 0 && (
                <div className="mt-6 space-y-6">
                  {/* Primary Recommendation (first action from first group) */}
                  {(() => {
                    // Find a primary recommendation (first action of first group with actions)
                    const primaryGroup = message.actions.find(group => group.actions && group.actions.length > 0);
                    const primaryAction = primaryGroup?.actions[0];
                    
                    if (primaryAction) {
                      return (
                        <Card className="border-l-4 border-l-green-500 bg-white shadow-sm hover:shadow-md transition-shadow mb-4">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-600" /> Primary Recommendation
                              </h3>
                              <Badge className="bg-green-600">High Impact</Badge>
                            </div>
                            <h4 className="font-semibold text-md mb-2">{primaryAction.title}</h4>
                            <p className="text-gray-800 mb-4">{primaryAction.description}</p>
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Why this action matters</h4>
                              <p className="text-sm text-gray-600">
                                This action was prioritised because Product X has high stock availability 
                                and pairing it with bestsellers in the hero zone increases visibility 
                                without disrupting site conversion.
                              </p>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handlePreviewSuggestion(primaryAction)}
                              >
                                Preview
                              </Button>
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
                            <div key={action.id} className="flex flex-col">
                              <ActionCard 
                                title={action.title} 
                                description={action.description} 
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="self-end mt-2"
                                onClick={() => handlePreviewSuggestion(action)}
                              >
                                Preview
                              </Button>
                            </div>
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
      
      {/* Suggestion Preview Drawer */}
      <SuggestionPreviewDrawer
        isOpen={previewingSuggestion !== null}
        onClose={() => setPreviewingSuggestion(null)}
        suggestion={previewingSuggestion}
        onLaunch={handleLaunchSuggestion}
        onRefine={handleRefineSuggestion}
      />
    </div>
  );
};
