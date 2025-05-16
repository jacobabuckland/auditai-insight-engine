
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ShopProvider } from "@/contexts/ShopContext";
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShopProvider>
      <App />
    </ShopProvider>
  </React.StrictMode>
);
