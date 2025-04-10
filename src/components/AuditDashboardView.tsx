
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyDashboard from "@/components/EmptyDashboard";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

// Define the audit type
type Audit = {
  id: string;
  pageUrl: string;
  goal: string;
  suggestionCount: number;
  date: string;
};

const AuditDashboardView = () => {
  // For demo purposes, we'll use a state to toggle between empty and populated views
  const [audits, setAudits] = useState<Audit[]>([
    // Uncomment to test with sample data
    // {
    //   id: "1",
    //   pageUrl: "https://example.com/product",
    //   goal: "Increase Add to Cart",
    //   suggestionCount: 5,
    //   date: "2025-04-05T14:23:15Z"
    // },
    // {
    //   id: "2",
    //   pageUrl: "https://example.com/signup",
    //   goal: "Boost Email Signups",
    //   suggestionCount: 3,
    //   date: "2025-04-04T10:45:30Z"
    // },
  ]);

  const navigate = useNavigate();

  const handleViewSuggestions = (audit: Audit) => {
    console.log("View suggestions for:", audit);
    // In future this would navigate to a details page
  };

  const handleRunFirstAudit = () => {
    navigate("/");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (audits.length === 0) {
    return <EmptyDashboard onRunFirstAudit={handleRunFirstAudit} />;
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <Navigation />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Audits</h1>
        <p className="text-muted-foreground">
          View and manage all your previous page audits
        </p>
      </header>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page URL</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead className="text-center">Suggestions</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium truncate max-w-[200px]">
                  {audit.pageUrl}
                </TableCell>
                <TableCell>{audit.goal}</TableCell>
                <TableCell className="text-center">{audit.suggestionCount}</TableCell>
                <TableCell>{formatDate(audit.date)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSuggestions(audit)}
                  >
                    View Suggestions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditDashboardView;
