
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Rocket, Edit } from "lucide-react";
import { Action } from '@/types/chat';

interface SuggestionPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: Action | null;
  onLaunch: () => void;
  onRefine: () => void;
}

export const SuggestionPreviewDrawer: React.FC<SuggestionPreviewDrawerProps> = ({
  isOpen,
  onClose,
  suggestion,
  onLaunch,
  onRefine
}) => {
  if (!suggestion) return null;

  // Mock product data (would be replaced with real data in production)
  const mockProduct = {
    name: "Premium Denim Jacket",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    inventory: "High stock available (126 units)",
    margin: "42% profit margin",
    placement: "Homepage Hero Banner",
    message: "Limited time offer: Get 15% off when paired with any jeans purchase"
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-y-0 right-0 w-[400px] h-full rounded-none">
        <div className="h-full flex flex-col bg-white shadow-xl">
          <DrawerHeader className="border-b p-6">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-xl font-bold">
                Preview Suggestion
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            {/* Product details */}
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={mockProduct.image} 
                  alt={mockProduct.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{mockProduct.name}</h3>
                <p className="text-green-600 font-medium">{mockProduct.price}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{mockProduct.inventory}</p>
                  <p>{mockProduct.margin}</p>
                </div>
              </div>
            </div>
            
            {/* Suggestion details */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">SUGGESTION</h4>
                <p className="font-semibold">{suggestion.title}</p>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500">PLACEMENT</h4>
                <p className="font-medium">{mockProduct.placement}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500">MESSAGE</h4>
                <p className="font-medium">{mockProduct.message}</p>
              </div>
            </div>
          </div>
          
          <DrawerFooter className="border-t p-6">
            <div className="flex flex-col gap-2 w-full">
              <Button 
                className="w-full bg-[#ea384c] hover:bg-[#d1303f]"
                onClick={onLaunch}
              >
                <Rocket className="h-4 w-4 mr-2" /> Launch
              </Button>
              <Button 
                className="w-full bg-[#9b87f5] hover:bg-[#8a76e3]"
                onClick={onRefine}
              >
                <Edit className="h-4 w-4 mr-2" /> Refine
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
              >
                Back
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
