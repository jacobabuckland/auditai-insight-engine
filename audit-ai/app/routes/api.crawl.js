
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * Crawl API endpoint that forwards requests to the AuditAI backend
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response from the crawl service
 */
export const action = async ({ request }) => {
  try {
    console.log("⚡ Received crawl request");
    
    // Authenticate the request and get the session
    const { session } = await authenticate.admin(request);
    const body = await request.json();
    
    // Log the request body for debugging
    console.log("📦 Request body:", JSON.stringify(body));
    
    // Ensure shop is included from frontend
    const shopDomain = body.shop || session.shop; 
    
    // Forward the request to our backend service with the shop domain
    const backendUrl = "https://auditai-insight-engine.onrender.com/crawl";
    console.log(`🔄 Forwarding request to: ${backendUrl}`);
    
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shop-Domain": shopDomain,
      },
      body: JSON.stringify({
        ...body,
        shop: shopDomain // Ensure shop is passed to backend
      }),
    });

    // Get the status code from the backend response
    const statusCode = res.status;
    console.log(`📊 Backend response status: ${statusCode}`);

    // If the request was not successful, handle the error
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Crawl API error [${statusCode}]:`, errorText);
      return json({ success: false, error: "Crawl failed", details: errorText }, { status: statusCode });
    }

    // Return the JSON response from the backend with its status code
    const data = await res.json();
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
