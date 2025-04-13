
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
  return json({ 
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shopDomain: session?.shop || ""
  });
};

export default function App() {
  const { apiKey, shopDomain } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} shopOrigin={shopDomain}>
      <Outlet context={{ shopDomain }} />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
