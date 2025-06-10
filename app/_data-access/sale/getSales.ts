import { db } from "@/app/_lib/prisma";
import "server-only";

export interface salesDto {
  id: string;
  productsName: string;
  totalProducts: number;
  totalAmount: number;
  date: Date;
}

export const getSales = async (): Promise<salesDto[]> => {
  const sales = await db.sale.findMany({
    include: {
      SaleProduct: {
        include: { product: true },
      },
    },
  });
  const salesDto = sales.map(
    (sale): salesDto => ({
      id: sale.id,
      date: sale.date,
      productsName: sale.SaleProduct.map((item) => item.product.name).join(
        ", ",
      ),
      totalProducts: sale.SaleProduct.reduce(
        (acc, item) => acc + Number(item.quantity),
        0,
      ),
      totalAmount: sale.SaleProduct.reduce(
        (acc, item) => acc + item.quantity * Number(item.unitPrice),
        0,
      ),
    }),
  );
  return salesDto;
};
