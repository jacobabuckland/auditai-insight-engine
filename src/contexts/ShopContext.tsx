
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

type ShopContextType = {
  shopDomain: string | null;
  setShopDomain: (domain: string | null) => void;
  isShopLoading: boolean;
};

const defaultContext: ShopContextType = {
  shopDomain: null,
  setShopDomain: () => {},
  isShopLoading: true,
};

export const ShopContext = createContext<ShopContextType>(defaultContext);

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopDomain, setShopDomain] = useState<string | null>(null);
  const [isShopLoading, setIsShopLoading] = useState(true);

  useEffect(() => {
    // Extract shop from URL query parameters on initial load and when URL changes
    const extractShopFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      
      if (shop) {
        console.log("Shop domain extracted from URL:", shop);
        setShopDomain(shop);
        // Store in localStorage for persistence
        localStorage.setItem('shopDomain', shop);
        setIsShopLoading(false);
      } else {
        // Try to retrieve from localStorage if not in URL
        const storedShop = localStorage.getItem('shopDomain');
        if (storedShop) {
          console.log("Shop domain retrieved from localStorage:", storedShop);
          setShopDomain(storedShop);
          setIsShopLoading(false);
        } else {
          console.warn("No shop domain found in URL or localStorage");
          // Don't show toast here as it can be distracting
          setIsShopLoading(false);
        }
      }
    };

    // Call immediately on mount
    extractShopFromUrl();

    // Listen for URL changes
    const handlePopState = () => {
      extractShopFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ShopContext.Provider value={{ shopDomain, setShopDomain, isShopLoading }}>
      {children}
    </ShopContext.Provider>
  );
};
