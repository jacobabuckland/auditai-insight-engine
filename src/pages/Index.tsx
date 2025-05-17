
import { ShopRequired } from '@/components/ShopRequired';
import { PlanGeneratorBar } from '@/components/PlanGeneratorBar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <ShopRequired redirectTo="/suggestions">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to ConvertIQ
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Use our tools to optimize your store and increase conversions
          </p>
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/strategy-assistant')}
          >
            Try our Strategy Assistant
          </Button>
        </div>
        
        <PlanGeneratorBar />
      </div>
    </ShopRequired>
  );
}
