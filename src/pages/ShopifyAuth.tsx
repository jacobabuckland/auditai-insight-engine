
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ShopifyAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // This is a placeholder for the actual Shopify OAuth flow
    // Eventually, this would handle the OAuth callback from Shopify
    const handleAuth = async () => {
      try {
        // Simulate auth process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Connected to Shopify",
          description: "Your store has been successfully connected.",
        });
        
        // Redirect to dashboard after successful auth
        navigate("/dashboard");
      } catch (error) {
        console.error("Shopify auth error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Could not connect to your Shopify store. Please try again.",
        });
        
        // Redirect back to login
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">Connecting to Shopify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Please wait while we connect to your Shopify store...</p>
        </CardContent>
      </Card>
    </div>
  );
}
