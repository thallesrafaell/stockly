import { db } from "@/app/_lib/prisma";
import "server-only";

export const getProducts = async () => {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products;
 }