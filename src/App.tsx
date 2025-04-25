
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
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
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <SidebarTrigger className="fixed top-4 left-4 z-50" />
                <Routes>
                  <Route path="/" element={<Navigate to="/suggestions" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<AuditDashboard />} />
                  <Route path="/shopify-auth" element={<ShopifyAuth />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/suggestions" element={<SuggestionReview />} />
                  <Route path="/dashboard/suggestions" element={<Navigate to="/suggestions" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
