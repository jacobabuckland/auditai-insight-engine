
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * POST /api/crawl
 * Proxies crawl requests to the AuditAI backend
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Auth via Shopify
    const { session } = await authenticate.admin(request);
    const body = await request.json();

    // Forward the request to our backend service
    const backendRes = await fetch("https://auditai-insight-engine.onrender.com/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shop-Domain": session.shop, // pass shop domain for context
      },
      body: JSON.stringify({
        ...body,
        shop: session.shop // Ensure shop is passed to backend
      }),
    });

    // Get the status code from the backend response
    const statusCode = backendRes.status;
    console.log(`📊 Backend response status: ${statusCode}`);

    // If the request was not successful, handle the error
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`❌ Crawl API error [${statusCode}]:`, errorText);
      return json({ success: false, error: "Crawl failed", details: errorText }, { status: statusCode });
    }

    // Return the JSON response from the backend with its status code
    const data = await backendRes.json();
    console.log("✅ Crawl successful, returning data to frontend");
    return json({ ...data, success: true }, { status: statusCode });
  } catch (error) {
    console.error("💥 Unhandled error in crawl API:", error);
    return json({ 
      success: false, 
      error: "Server error", 
      details: error.message 
    }, { status: 500 });
  }
};
