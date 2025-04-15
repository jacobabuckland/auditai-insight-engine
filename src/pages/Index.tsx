
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '@/contexts/ShopContext';
import { ShopRequired } from '@/components/ShopRequired';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const { shopDomain, isShopLoading } = useShop();
  const navigate = useNavigate();

  // Auto-redirect to suggestions if we have a shop domain
  useEffect(() => {
    if (shopDomain) {
      console.log('Shop domain available, redirecting to suggestions page');
      navigate('/suggestions');
    }
  }, [shopDomain, navigate]);

  if (isShopLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <ShopRequired redirectTo="/suggestions">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to ConvertIQ</h1>
        <p className="mb-6">Your CRO Assistant for Shopify</p>
        <a 
          href="/suggestions" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Suggestions
        </a>
      </div>
    </ShopRequired>
  );
}
