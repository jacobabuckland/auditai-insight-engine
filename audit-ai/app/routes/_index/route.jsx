import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json({ error: "Missing store information" });
  }

  // Optional: Add validation or logging if needed
  return json({ shop });
};

export default function Index() {
  const { shop, error } = useLoaderData();

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
        <h2>Missing Store Information</h2>
        <p>
          Unable to detect your Shopify store. Please ensure you're accessing
          this app through your Shopify admin.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={`https://preview--auditai-insight-engine.lovable.app?shop=${shop}`}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      title="ConvertIQ CRO Assistant"
    />
  );
}
