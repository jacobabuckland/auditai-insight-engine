
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Page,
  TitleBar
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { SuggestionReviewEmbed } from "../components/SuggestionReviewEmbed";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({
    shopDomain: session?.shop || "",
  });
};

export default function Suggestions() {
  const { shopDomain } = useLoaderData();
  
  return (
    <Page>
      <TitleBar title="Review Suggestions" />
      <SuggestionReviewEmbed shopDomain={shopDomain} />
    </Page>
  );
}
