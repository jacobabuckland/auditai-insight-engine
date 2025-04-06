
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyDashboardProps {
  onRunFirstAudit: () => void;
}

const EmptyDashboard = ({ onRunFirstAudit }: EmptyDashboardProps) => {
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
        <Button onClick={onRunFirstAudit} className="mt-4">
          Run Your First Audit
        </Button>
      </div>
    </div>
  );
};

export default EmptyDashboard;
