
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context shape
interface ShopContextType {
  shopDomain: string | null;
  setShopDomain: (domain: string) => void;
  isShopLoading: boolean;
}

// Create context
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Provider component
export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopDomain, setShopDomain] = useState<string | null>(null);
  const [isShopLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt to fetch from query param, localStorage, or other source
    const extractShopFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      
      if (shop) {
        console.log("Shop domain extracted from URL:", shop);
        setShopDomain(shop);
        localStorage.setItem('shopDomain', shop);
        setIsLoading(false);
      } else {
        // Try to get from localStorage
        const storedShop = localStorage.getItem('shopDomain');
        if (storedShop) {
          console.log("Shop domain retrieved from localStorage:", storedShop);
          setShopDomain(storedShop);
        } else {
          console.log("No shop domain found in URL or localStorage");
        }
        setIsLoading(false);
      }
    };

    extractShopFromUrl();
  }, []);

  return (
    <ShopContext.Provider value={{ shopDomain, setShopDomain, isShopLoading }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook to use context
export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
