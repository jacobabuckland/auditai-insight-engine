import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context shape
interface ShopContextType {
  shopDomain: string | null;
  setShopDomain: (domain: string) => void;
}

// Create context
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Provider component
export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopDomain, setShopDomain] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to fetch from query param, cookie, or other source
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get("shop");

    if (shop) {
      setShopDomain(shop);
    }
  }, []);

  return (
    <ShopContext.Provider value={{ shopDomain, setShopDomain }}>
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

