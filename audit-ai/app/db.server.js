
import { prisma } from "~/prisma.server";

export async function saveShop(shopDomain, accessToken) {
  await prisma.shop.upsert({
    where: { shopDomain },
    update: { accessToken },
    create: {
      shopDomain,
      accessToken,
    },
  });
}
