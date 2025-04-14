
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, TitleBar } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { SuggestionReviewEmbed } from "../components/SuggestionReviewEmbed";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({
    shopDomain: session?.shop || "",
  });
};

export default function Index() {
  const { shopDomain } = useLoaderData();
  
  // If we have a shopDomain, show the suggestion review interface directly
  if (shopDomain) {
    return (
      <Page>
        <TitleBar title="ConvertIQ CRO Assistant" />
        <SuggestionReviewEmbed shopDomain={shopDomain} />
      </Page>
    );
  }

  // If no shopDomain is available, show an error message
  return (
    <Page>
      <TitleBar title="ConvertIQ CRO Assistant" />
      <div className="mt-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Missing Store Information:</strong> Unable to detect your Shopify store. 
                Please ensure you're accessing this app through your Shopify admin.
                If the problem persists, please contact support or try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
