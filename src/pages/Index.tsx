
import { ShopRequired } from '@/components/ShopRequired';
import { PlanGeneratorBar } from '@/components/PlanGeneratorBar';

export default function Index() {
  return (
    <ShopRequired redirectTo="/suggestions">
      <PlanGeneratorBar />
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
