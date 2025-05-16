
import { ShopRequired } from '@/components/ShopRequired';
import { ChatInterface } from '@/components/ChatInterface';

export default function Index() {
  return (
    <ShopRequired redirectTo="/suggestions">
      <ChatInterface />
    </ShopRequired>
  );
}
