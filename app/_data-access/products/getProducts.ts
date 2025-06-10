import { db } from "@/app/_lib/prisma";
import { Product } from "@/app/generated/prisma";
import { unstable_cache } from "next/cache";
import "server-only";

export interface ProductDto extends Product {
  status: "IN_STOCK" | "OUT_OF_STOCK";
}

export const getProducts = async (): Promise<ProductDto[]> => {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    ...product,
    status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
  }));
};

export const cacheGetProducts = unstable_cache(getProducts, ["getProducts"], {
  tags: ["get-products"],
  revalidate: 60, // Revalidate every 60 seconds
});
