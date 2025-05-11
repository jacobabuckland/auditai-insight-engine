import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { saveShop } from "~/db.server";

export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);

  const { shop, accessToken } = session;

  await saveShop(shop, accessToken);

  return redirect("/app"); // Or wherever you want to send the user post-login
};
