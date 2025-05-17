
import { toast } from "@/components/ui/use-toast";

/**
 * Verifies if a shop domain is valid
 * @param shopDomain The shop domain to verify
 * @returns boolean indicating if the shop domain is valid
 */
export const verifyShopDomain = (shopDomain: string | null): boolean => {
  if (!shopDomain) {
    toast({
      title: "Error",
      description: "Unable to detect store. Please refresh or contact support.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

/**
 * Base URL for the API
 */
export const API_BASE_URL = "https://auditai-insight-engine-1.onrender.com";

/**
 * Creates headers for API requests
 * @param shopDomain The shop domain to include in headers
 * @returns Headers object with content type and shop domain
 */
export const createApiHeaders = (shopDomain: string | null) => {
  return {
    "Content-Type": "application/json",
    ...(shopDomain && { "X-Shop-Domain": shopDomain }),
  };
};

/**
 * Handles API errors by showing a toast and logging
 * @param error The error that occurred
 * @param customMessage A custom message to show in the toast
 */
export const handleApiError = (error: unknown, customMessage: string = "An error occurred") => {
  console.error(customMessage, error);
  toast({
    title: "Error",
    description: error instanceof Error ? error.message : customMessage,
    variant: "destructive",
  });
};
