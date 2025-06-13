import { db } from "@/app/_lib/prisma";

export const getTotalSales = async (): Promise<number> => {
  const totalSalesPromise = await db.sale.count();

  return totalSalesPromise;
};
