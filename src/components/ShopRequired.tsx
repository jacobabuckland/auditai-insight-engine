
import React from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@shopify/polaris';

interface ShopRequiredProps {
  children: React.ReactNode;
}

export const ShopRequired: React.FC<ShopRequiredProps> = ({ children }) => {
  const { shopDomain, isShopLoading } = useShop();

  if (isShopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="large" />
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
