
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

  const handlePageSelect = (value: string) => {
    setSelectedPage(value);
  };

  const handleNext = () => {
    if (step === 1 && !selectedPage) {
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

  const handleStartAudit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/suggestions", { state: { page: selectedPage } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start audit. Please try again.",
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
            {step === 1 ? "Select a Page to Audit" : "Confirm Audit Details"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Choose which page you'd like to analyze"
              : "Review your selection before starting"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
        </div>

        <div className="flex justify-end gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button onClick={handleNext} disabled={!selectedPage}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleStartAudit} 
              disabled={isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Start Audit"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
