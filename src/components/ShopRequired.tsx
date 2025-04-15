
import React, { useEffect } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShopRequiredProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ShopRequired: React.FC<ShopRequiredProps> = ({ 
  children, 
  redirectTo = '/suggestions' 
}) => {
  const { shopDomain, isShopLoading } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    // If shop domain is available and not loading, redirect to suggestions immediately
    if (shopDomain && !isShopLoading) {
      console.log('Shop domain available in ShopRequired, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [shopDomain, isShopLoading, redirectTo, navigate]);

  if (isShopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!shopDomain) {
    return (
      <Alert variant="destructive" className="my-8 mx-auto max-w-md">
        <AlertTitle>Missing Store Information</AlertTitle>
        <AlertDescription>
          <p className="mb-4">
            Unable to detect your Shopify store. Please ensure you're accessing this app through your Shopify admin.
          </p>
          <p>
            If the problem persists, please contact support or try refreshing the page.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
