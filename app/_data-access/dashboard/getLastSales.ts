import { db } from "@/app/_lib/prisma";
import dayjs from "dayjs";

export interface DayTotalRevenue {
  day: string;
  totalRevenue: number;
}

export const getLastSales = async () => {
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
        SELECT SUM("SaleProduct"."unitPrice" * "SaleProduct"."quantity") as "totalRevenue"
  FROM "sale_products" AS "SaleProduct"
  JOIN "sales" AS "Sale" ON "SaleProduct"."saleId" = "Sale"."id"
  WHERE "Sale"."date" >= $1 AND "Sale"."date" <= $2
      `,
      dayjs(day).startOf("day").toDate(),
      dayjs(day).endOf("day").toDate(),
    );
    totalLast14DaysRevenue.push({
      day: dayjs(day).format("DD/MM"),
      totalRevenue: dayTotalRevenue[0].totalRevenue,
    });
  }
  return totalLast14DaysRevenue;
};
