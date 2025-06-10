import { db } from "@/app/_lib/prisma";
import "server-only";

// Tipo para um único produto dentro de uma venda, para o DTO
export interface SaleProductDetailDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // Prisma decimal é mapeado para number ou Decimal.js, aqui usamos number
}

export interface salesDto {
  id: string;
  productsName: string; // Mantém a string concatenada para exibição simples na tabela
  totalProducts: number;
  totalAmount: number;
  date: Date;
  saleProducts: SaleProductDetailDto[]; // Array detalhado dos produtos da venda
}

export const getSales = async (): Promise<salesDto[]> => {
  const sales = await db.sale.findMany({
    include: {
      SaleProduct: {
        include: { product: true }, // Inclui o produto para pegar o nome e outros detalhes se necessário
      },
    },
    orderBy: {
      date: "desc", // Ordenar por data, mais recentes primeiro
    },
  });

  const salesDtos = sales.map(
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
      // Mapeia cada SaleProduct para SaleProductDetailDto
      saleProducts: sale.SaleProduct.map((sp) => ({
        productId: sp.productId,
        productName: sp.product.name, // Pegar o nome do produto relacionado
        quantity: sp.quantity,
        unitPrice: Number(sp.unitPrice), // Converter Decimal para number
      })),
    }),
  );
  return salesDtos;
};
