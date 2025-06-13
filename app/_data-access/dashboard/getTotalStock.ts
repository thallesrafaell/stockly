import { db } from "@/app/_lib/prisma";

export const getTotalStock = async (): Promise<number> => {
  const totalStockPromise = await db.product.aggregate({
    _sum: {
      stock: true,
    },
  });

  return totalStockPromise._sum.stock || 0;
};
