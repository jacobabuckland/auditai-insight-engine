
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * Suggestion API endpoint that forwards requests to the AuditAI backend
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response from the suggestion service
 */
export const action = async ({ request }) => {
  try {
    console.log("⚡ Received suggest request");
    
    // Authenticate the request and get the session
    const { session } = await authenticate.admin(request);
    const body = await request.json();
    
    // Log the request body for debugging (without sensitive data)
    console.log("📦 Request body fields:", Object.keys(body).join(", "));
    
    // Ensure shop is included from frontend
    const shopDomain = body.shop || session.shop;
    
    // Forward the request to our backend service
    const backendUrl = "https://auditai-insight-engine.onrender.com/suggest";
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
      console.error(`❌ Suggest API error [${statusCode}]:`, errorText);
      return json({ success: false, error: "Suggestion failed", details: errorText }, { status: statusCode });
    }

    // Return the JSON response from the backend with its status code
    const data = await res.json();
    console.log("✅ Suggest successful, returning data to frontend");
    return json({ ...data, success: true }, { status: statusCode });
  } catch (error) {
    console.error("💥 Unhandled error in suggest API:", error);
    return json({ 
      success: false, 
      error: "Server error", 
      details: error.message 
    }, { status: 500 });
  }
};

// Block GET requests
export const loader = () => {
  return new Response("Method not allowed", { status: 405 });
};
