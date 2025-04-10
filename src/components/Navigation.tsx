
import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="mb-8 flex justify-between items-center py-3 border-b">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-medium text-xl flex items-center">
          <span className="text-primary">AuditAI</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-1">
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard" className="flex items-center gap-1">
            <LayoutDashboardIcon size={16} />
            <span>Dashboard</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
