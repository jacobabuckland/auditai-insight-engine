
import React, { createContext, useContext, useState, useEffect } from 'react';

type ShopContextType = {
  shopDomain: string | null;
  setShopDomain: (domain: string | null) => void;
};

const defaultContext: ShopContextType = {
  shopDomain: null,
  setShopDomain: () => {},
};

export const ShopContext = createContext<ShopContextType>(defaultContext);

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopDomain, setShopDomain] = useState<string | null>(null);

  useEffect(() => {
    // Extract shop from URL query parameters on initial load and when URL changes
    const extractShopFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      
      if (shop) {
        setShopDomain(shop);
        // Optionally store in localStorage for persistence
        localStorage.setItem('shopDomain', shop);
      } else {
        // Try to retrieve from localStorage if not in URL
        const storedShop = localStorage.getItem('shopDomain');
        if (storedShop) {
          setShopDomain(storedShop);
        }
      }
    };

    extractShopFromUrl();

    // Listen for URL changes
    const handlePopState = () => {
      extractShopFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ShopContext.Provider value={{ shopDomain, setShopDomain }}>
      {children}
    </ShopContext.Provider>
  );
};
