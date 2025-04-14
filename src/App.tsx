
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuditDashboard from "./pages/AuditDashboard";
import Login from "./pages/Login";
import ShopifyAuth from "./pages/ShopifyAuth";
import Settings from "./pages/Settings";
import SuggestionReview from "./pages/SuggestionReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShopProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AuditDashboard />} />
            <Route path="/shopify-auth" element={<ShopifyAuth />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/suggestions" element={<SuggestionReview />} />
            {/* Redirect to suggestions from dashboard for convenience */}
            <Route path="/dashboard/suggestions" element={<Navigate to="/suggestions" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
