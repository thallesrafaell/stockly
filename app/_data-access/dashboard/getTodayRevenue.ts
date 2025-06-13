import { db } from "@/app/_lib/prisma";

export const getTodayRevenue = async (): Promise<number> => {
  const todayRevenueQuery = `
  SELECT SUM("unitPrice" * quantity) as "todayRevenue"
  FROM sale_products
      WHERE "createdAt" >= CURRENT_DATE AND "createdAt" < CURRENT_DATE + INTERVAL '1 day'
`;

  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  const todayRevenuePromise = await db.$queryRawUnsafe<
    { todayRevenue: number }[]
  >(todayRevenueQuery, startOfDay, endOfDay);

  return todayRevenuePromise[0].todayRevenue;
};
