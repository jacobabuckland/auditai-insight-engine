import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const body = await request.json();

  const res = await fetch("https://auditai-insight-engine.onrender.com/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shop-Domain": session.shop,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return json(data);
};
