
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <Navigation />
      
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
