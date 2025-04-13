
import { useEffect, useState } from "react";
import { 
  Page, 
  BlockStack, 
  Text, 
  Card, 
  Spinner 
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({
    shopDomain: session?.shop || "",
  });
};

export default function Index() {
  const { shopDomain } = useRouteLoaderData("root") || {};
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Set a timeout to detect if iframe doesn't load properly
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setLoadError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const iframeUrl = `https://preview--auditai-insight-engine.lovable.app/?shop=${shopDomain}`;

  return (
    <Page>
      <TitleBar title="ConvertIQ CRO Assistant" />
      
      <BlockStack gap="500">
        {isLoading && (
          <Card>
            <BlockStack gap="400" align="center" inlineAlign="center" padding="500">
              <Spinner size="large" />
              <Text as="p" variant="bodyMd">
                Loading ConvertIQ dashboard...
              </Text>
            </BlockStack>
          </Card>
        )}
        
        {loadError && (
          <Card>
            <BlockStack gap="400" align="center" inlineAlign="center" padding="500">
              <Text as="p" variant="bodyMd" tone="critical">
                There was an issue loading the ConvertIQ dashboard. Please refresh the page or try again later.
              </Text>
            </BlockStack>
          </Card>
        )}

        <iframe
          src={iframeUrl}
          style={{
            width: "100%",
            height: "calc(100vh - 100px)",
            border: "none",
            display: isLoading ? "none" : "block"
          }}
          title="ConvertIQ CRO Assistant"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </BlockStack>
    </Page>
  );
}
