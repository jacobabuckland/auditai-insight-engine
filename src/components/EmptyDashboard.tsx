
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { crawlPage } from "@/services/auditService";
import { toast } from "@/components/ui/use-toast";

interface EmptyDashboardProps {
  onRunFirstAudit: () => void;
}

const EmptyDashboard = ({ onRunFirstAudit }: EmptyDashboardProps) => {
  const { shopDomain } = useShop();
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAudit = async () => {
    // Early return if no shop domain is available
    if (!shopDomain) {
      console.error("No shop domain available");
      toast({
        title: "Missing Shop Information",
        description: "Unable to detect your Shopify store. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    // Set loading state
    setIsLoading(true);
    console.log("Starting audit for shop:", shopDomain);
    
    try {
      // For testing purposes, hardcoding the URL
      const testUrl = "https://www.convertiq.shop/";
      const response = await crawlPage(testUrl, shopDomain);
      
      console.log("Audit response:", response);
      
      if (response.success) {
        toast({
          title: "Audit Started",
          description: "Your page audit has been initiated successfully.",
        });
        // Call the parent component's handler to potentially navigate or update UI
        onRunFirstAudit();
      } else {
        throw new Error("Audit failed");
      }
    } catch (error) {
      console.error("Error running audit:", error);
      toast({
        title: "Audit Failed",
        description: "There was an error starting your audit. Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-16 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <div className="rounded-full bg-primary/10 p-6">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">No Audits Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Run your first page audit to get optimization suggestions and improve your conversion rate.
        </p>
        <Button 
          onClick={handleRunAudit} 
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Audit...
            </>
          ) : (
            "Run Your First Audit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmptyDashboard;
