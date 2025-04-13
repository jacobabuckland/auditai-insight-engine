
import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, LayoutDashboardIcon, SettingsIcon, LogOut, StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useShop } from "@/contexts/ShopContext";

const Navigation = () => {
  const { shopDomain } = useShop();

  return (
    <nav className="mb-8 flex justify-between items-center py-3 border-b">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-medium text-xl flex items-center">
          <span className="text-primary">AuditAI</span>
        </Link>
        {shopDomain && (
          <div className="hidden md:flex items-center ml-4 text-xs text-muted-foreground">
            <StoreIcon size={12} className="mr-1" />
            <span>Connected: {shopDomain}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
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
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings" className="flex items-center gap-1">
              <SettingsIcon size={16} />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {shopDomain && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1">
                Connected: {shopDomain}
              </div>
            )}
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;
