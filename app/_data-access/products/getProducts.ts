import { db } from "@/app/_lib/prisma";
import { unstable_cache } from "next/cache";
import "server-only";

export const getProducts = async () => {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products;
}
 
export const cacheGetProducts = unstable_cache(getProducts, ["getProducts"], {
  tags: ["get-products"],
  revalidate: 60, // Revalidate every 60 seconds
})