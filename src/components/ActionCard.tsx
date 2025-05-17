
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ActionCardProps {
  title: string;
  description: string;
  isPrimary?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, description, isPrimary = false }) => {
  const handlePreview = () => {
    console.log(`Preview clicked for ${title}`);
    toast({
      title: "Preview",
      description: `Previewing: ${title}`,
    });
  };

  const handleApply = () => {
    console.log(`Apply clicked for ${title}`);
    toast({
      title: "Applied",
      description: `Action applied: ${title}`,
      variant: "default",
    });
  };

  return (
    <div className={`${isPrimary ? 'bg-white' : 'bg-gray-50'} border border-gray-100 rounded-md p-3 transition-all duration-200 hover:shadow-md w-full`}>
      <div className="flex items-start gap-2">
        {isPrimary && <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
        <div className="flex-1">
          <h4 className={`${isPrimary ? 'font-semibold' : 'font-medium'} text-sm mb-1`}>{title}</h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          onClick={handlePreview}
        >
          <Eye className="h-3 w-3" /> Preview
        </Button>
        <Button 
          size="sm" 
          className={`flex items-center gap-1 text-xs ${isPrimary ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={handleApply}
        >
          <Check className="h-3 w-3" /> Apply
        </Button>
      </div>
    </div>
  );
};
