
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ActionCardProps {
  title: string;
  description: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, description }) => {
  const handlePreview = () => {
    toast({
      title: "Preview",
      description: `Previewing: ${title}`,
    });
  };

  const handleApply = () => {
    toast({
      title: "Applied",
      description: `Action applied: ${title}`,
      variant: "default",
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-md p-3 transition-all duration-200 hover:shadow-md">
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
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
          className="flex items-center gap-1 text-xs"
          onClick={handleApply}
        >
          <Check className="h-3 w-3" /> Apply
        </Button>
      </div>
    </div>
  );
};
