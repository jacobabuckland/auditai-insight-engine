
import { ShopRequired } from '@/components/ShopRequired';
import { useShop } from '@/contexts/ShopContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { shopDomain } = useShop();
  const navigate = useNavigate();

  // Auto-redirect to dashboard if we have a shop domain
  useEffect(() => {
    if (shopDomain) {
      navigate('/dashboard');
    }
  }, [shopDomain, navigate]);

  return (
    <ShopRequired>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to ConvertIQ</h1>
        <p className="mb-6">Your CRO Assistant for Shopify</p>
        <a 
          href="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </a>
      </div>
    </ShopRequired>
  );
}
