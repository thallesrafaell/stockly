import { db } from "@/app/_lib/prisma";
import dayjs from "dayjs";
import "server-only";
import { ProductStatusDto } from "../products/getProducts";

interface DashboardDto {
  totalStock: number;
  totalProducts: number;
  totalLast14DaysRevenue?: DayTotalRevenue[];
  mostSoldProducts?: MostSoldProductDto[];
}

export interface MostSoldProductDto {
  productId: string;
  name: string;
  totalSold: number;
  status: ProductStatusDto;
  price: number;
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
  console.log("[getDashboard] totalLast14DaysRevenue:", totalLast14DaysRevenue);

  const mostSoldProductsQuery = `
  SELECT "products"."name", SUM("sale_products"."quantity") as "totalSold", "products"."price", "products"."stock", "products"."id" as "productId"
FROM "sale_products"
JOIN "products" ON "sale_products"."productId" = "products"."id"
GROUP BY "products"."name", "products"."price", "products"."stock", "products"."id"
ORDER BY "totalSold" DESC
LIMIT 5
`;

  const mostSoldProductsPromise = db.$queryRawUnsafe<
    {
      name: string;
      totalSold: number;
      price: number;
      stock: number;
      productId: string;
    }[]
  >(mostSoldProductsQuery);

  const totalStockPromise = db.product.aggregate({
    _sum: {
      stock: true,
    },
  });
  const totalProductsPromise = db.product.count();
  const [totalStock, totalProducts, mostSoldProducts] = await Promise.all([
    totalStockPromise,
    totalProductsPromise,
    mostSoldProductsPromise,
  ]);
  return {
    totalStock: Number(totalStock._sum.stock),
    totalProducts,
    totalLast14DaysRevenue,
    mostSoldProducts: mostSoldProducts.map((product) => ({
      name: product.name,
      totalSold: product.totalSold,
      status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
      price: product.price,
      productId: product.productId,
    })),
  };
};
