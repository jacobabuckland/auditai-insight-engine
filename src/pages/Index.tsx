
import { ShopRequired } from '@/components/ShopRequired';
import { PlanGeneratorBar } from '@/components/PlanGeneratorBar';

export default function Index() {
  return (
    <ShopRequired redirectTo="/suggestions">
      <PlanGeneratorBar />
    </ShopRequired>
  );
}
