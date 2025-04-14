
import { json } from "@remix-run/node";

/**
 * POST /api/crawl
 * Proxies crawl requests to the AuditAI FastAPI backend
 */
export const action = async ({ request }) => {
  // Only accept POST requests
  if (request.method !== "POST") {
    console.log("❌ Method not allowed:", request.method);
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Extract the JSON body from the request
    const body = await request.json();
    
    // Extract shop domain from the referer header
    const referer = request.headers.get("referer");
    let shopDomain = null;
    
    if (referer) {
      try {
        const url = new URL(referer);
        shopDomain = url.searchParams.get("shop");
        console.log(`🏪 Extracted shop domain from referer: ${shopDomain}`);
      } catch (error) {
        console.error("❌ Failed to parse referer URL:", error);
      }
    }

    if (!shopDomain) {
      console.warn("⚠️ No shop domain found in referer, proceeding without it");
    }

    // Forward the request to our backend service
    console.log(`🔄 Forwarding request to FastAPI backend`);
    const backendRes = await fetch("https://auditai-insight-engine-1.onrender.com/api/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(shopDomain && { "X-Shop-Domain": shopDomain }), // Include shop domain if available
      },
      body: JSON.stringify({
        ...body,
        shop: shopDomain // Include shop domain in the body as well
      }),
    });

    // Get the status code from the backend response
    const statusCode = backendRes.status;
    console.log(`📊 Backend response status: ${statusCode}`);

    // If the request was not successful, handle the error
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`❌ Crawl API error [${statusCode}]:`, errorText);
      return new Response(errorText, { 
        status: statusCode,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get the response data
    const responseData = await backendRes.json();
    console.log("✅ Crawl successful, returning data to frontend");
    
    // Return the JSON response from the backend with its status code
    return json(responseData, { status: statusCode });
  } catch (error) {
    console.error("💥 Unhandled error in crawl API:", error);
    return json({ 
      success: false, 
      error: "Server error", 
      details: error.message 
    }, { status: 500 });
  }
};

// Block GET requests with a 405 Method Not Allowed
export const loader = () => {
  console.log("❌ GET method not allowed on /api/crawl");
  return new Response("Method Not Allowed", { status: 405 });
};
