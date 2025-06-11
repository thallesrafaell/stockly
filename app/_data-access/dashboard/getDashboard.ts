import { db } from "@/app/_lib/prisma";
import dayjs from "dayjs";
import "server-only";

interface DashboardDto {
  totalRevenue: number;
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
  totalLast14DaysRevenue?: DayTotalRevenue[];
}

export interface DayTotalRevenue {
  day: string;
  totalRevenue: number;
}

export const getDashboard = async (): Promise<DashboardDto> => {
  const today = dayjs().endOf("day").toDate();
  const lastForteenDays = [
    ...Array.from({ length: 14 }, (_, i) =>
      dayjs(today).subtract(i, "day").startOf("day").toDate(),
    ),
  ].reverse();

  const totalLast14DaysRevenue: DayTotalRevenue[] = [];
  for (const day of lastForteenDays) {
    const dayTotalRevenue = await db.$queryRawUnsafe<
      { totalRevenue: number }[]
    >(
      `
      SELECT SUM("unitPrice" * quantity) as "totalRevenue"
      FROM sale_products
      WHERE "createdAt" >= $1 AND "createdAt" <= $2
    `,
      dayjs(day).startOf("day").toDate(),
      dayjs(day).endOf("day").toDate(),
    );
    totalLast14DaysRevenue.push({
      day: dayjs(day).format("DD/MM"),
      totalRevenue: dayTotalRevenue[0].totalRevenue,
    });
  }
  console.log("[getDashboard] totalLast14DaysRevenue:", totalLast14DaysRevenue);

  const totalRevenueQuery = `
   SELECT SUM("unitPrice" * quantity) as "totalRevenue" FROM sale_products;
  `;

  const todayRevenueQuery = `
    SELECT SUM("unitPrice" * quantity) as "todayRevenue"
    FROM sale_products
        WHERE "createdAt" >= CURRENT_DATE AND "createdAt" < CURRENT_DATE + INTERVAL '1 day'
  `;

  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  const totalRevenuePromise =
    db.$queryRawUnsafe<{ totalRevenue: number }[]>(totalRevenueQuery);
  const todayRevenuePromise = db.$queryRawUnsafe<{ todayRevenue: number }[]>(
    todayRevenueQuery,
    startOfDay,
    endOfDay,
  );

  const totalSalesPromise = db.sale.count();
  const totalStockPromise = db.product.aggregate({
    _sum: {
      stock: true,
    },
  });
  const totalProductsPromise = db.product.count();
  const [totalRevenue, todayRevenue, totalSales, totalStock, totalProducts] =
    await Promise.all([
      totalRevenuePromise,
      todayRevenuePromise,
      totalSalesPromise,
      totalStockPromise,
      totalProductsPromise,
    ]);
  return {
    totalRevenue: totalRevenue[0].totalRevenue,
    todayRevenue: todayRevenue[0].todayRevenue,
    totalSales,
    totalStock: Number(totalStock._sum.stock),
    totalProducts,
    totalLast14DaysRevenue,
  };
};
