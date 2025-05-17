
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_PAGES = [
  { label: "Home Page", value: "/" },
  { label: "Product Catalog", value: "/products" },
  { label: "Contact Page", value: "/pages/contact" },
];

interface AuditWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditWizard({ open, onOpenChange }: AuditWizardProps) {
  const navigate = useNavigate();
  const { shopDomain } = useShop();
  const [step, setStep] = useState(1);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("audit");

  const handlePageSelect = (value: string) => {
    setSelectedPage(value);
  };

  const handleNext = () => {
    if (selectedTab === "audit" && step === 1 && !selectedPage) {
      toast({
        title: "Please select a page",
        description: "You need to select a page to audit",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleStartProcess = async () => {
    setIsLoading(true);
    try {
      if (selectedTab === "strategy") {
        navigate("/strategy-assistant");
      } else {
        // Standard audit flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate("/suggestions", { state: { page: selectedPage } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedPage("");
    setSelectedTab("audit");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetWizard();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedTab === "strategy" ? "Strategy Assistant" : (step === 1 ? "Select a Page to Audit" : "Confirm Audit Details")}
          </DialogTitle>
          <DialogDescription>
            {selectedTab === "strategy" 
              ? "Get AI-powered strategy recommendations for your store"
              : (step === 1
                  ? "Choose which page you'd like to analyze"
                  : "Review your selection before starting")}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={selectedTab} 
          onValueChange={(value) => {
            setSelectedTab(value);
            setStep(1); // Reset step when changing tabs
          }}
          className="w-full mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit">Page Audit</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audit" className="space-y-4">
            {step === 1 ? (
              <Select value={selectedPage} onValueChange={handlePageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_PAGES.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Selected Page</p>
                    <p className="text-sm text-muted-foreground">
                      {DEFAULT_PAGES.find((p) => p.value === selectedPage)?.label}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">URL to Audit</p>
                    <p className="text-sm text-muted-foreground">
                      {`https://${shopDomain}${selectedPage}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="strategy" className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Strategy Assistant</p>
                <p className="text-sm text-muted-foreground">
                  Share your business goals and get AI-powered recommendations to improve your store's performance.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          {selectedTab === "audit" && step === 2 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {selectedTab === "audit" && step === 1 ? (
            <Button onClick={handleNext} disabled={!selectedPage}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleStartProcess} 
              disabled={isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                selectedTab === "strategy" ? "Start Strategy Assistant" : "Start Audit"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
