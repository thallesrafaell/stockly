import { db } from "@/app/_lib/prisma";
import { ProductStatusDto } from "../products/getProducts";

export interface MostSoldProductDto {
  productId: string;
  name: string;
  totalSold: number;
  status: ProductStatusDto;
  price: number;
}

export const getMostSoldProducts = async (): Promise<MostSoldProductDto[]> => {
  const mostSoldProductsQuery = `
    SELECT "products"."name", SUM("sale_products"."quantity") as "totalSold", "products"."price", "products"."stock", "products"."id" as "productId"
  FROM "sale_products"
  JOIN "products" ON "sale_products"."productId" = "products"."id"
  GROUP BY "products"."name", "products"."price", "products"."stock", "products"."id"
  ORDER BY "totalSold" DESC
  LIMIT 5
  `;

  const mostSoldProductsPromise = await db.$queryRawUnsafe<
    {
      name: string;
      totalSold: number;
      price: number;
      stock: number;
      productId: string;
    }[]
  >(mostSoldProductsQuery);

  return mostSoldProductsPromise.map((product) => ({
    name: product.name,
    totalSold: product.totalSold,
    status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
    price: product.price,
    productId: product.productId,
  }));
};
