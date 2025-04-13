
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * Crawl API endpoint that forwards requests to the AuditAI backend
 * @param {Request} request - The incoming request object
 * @returns {Promise<Response>} JSON response from the crawl service
 */
export const action = async ({ request }) => {
  try {
    // Authenticate the request and get the session
    const { session } = await authenticate.admin(request);
    const body = await request.json();

    // Forward the request to our backend service
    const res = await fetch("https://auditai-insight-engine.onrender.com/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shop-Domain": session.shop, // Include shop domain for tracking/logging
      },
      body: JSON.stringify(body),
    });

    // Check if the request was successful
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Crawl API error:", errorText);
      return json({ error: "Crawl failed" }, { status: 500 });
    }

    // Return the JSON response from the backend
    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error("Error in crawl API:", error);
    return json({ error: "Crawl failed" }, { status: 500 });
  }
};
