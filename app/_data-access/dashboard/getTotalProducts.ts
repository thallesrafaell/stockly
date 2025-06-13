import { db } from "@/app/_lib/prisma";

export const getTotalProducts = async (): Promise<number> => {
  const totalProductsPromise = await db.product.count();

  return totalProductsPromise;
};
