import { db } from "@/app/_lib/prisma";

export const getTotalRevenue = async (): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const totalRevenueQuery = `
  SELECT SUM("unitPrice" * quantity) as "totalRevenue" FROM sale_products;
 `;

  const totalRevenuePromise =
    await db.$queryRawUnsafe<{ totalRevenue: number }[]>(totalRevenueQuery);

  return totalRevenuePromise[0].totalRevenue;
};
