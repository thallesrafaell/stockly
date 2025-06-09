"use server";
import { db } from "@/app/_lib/prisma";

import { revalidateTag } from "next/cache";
import { CreateSaleSchema, createSaleSechema } from "./schema";

export const createSaleAction = async (data: CreateSaleSchema) => {
  createSaleSechema.parse(data);

  const sale = await db.sale.create({
    data: {
      date: new Date(),
    },
  });

  for (const product of data.products) {
    const foundProduct = await db.product.findUnique({
      where: { id: product.id },
    });
    if (foundProduct === undefined) {
      throw new Error(`Produto com ID ${product.id} não encontrado`);
    }
    const productStock = foundProduct?.stock;

    if (productStock === undefined) {
      throw new Error(`Estoque do produto com ID ${product.id} não encontrado`);
    }
    const stock = product.quantity > productStock;

    if (stock) {
      throw new Error(
        `Quantidade solicitada para o produto com ID ${product.id} excede o estoque disponível`,
      );
    }

    const unitPrice = foundProduct?.price;

    await db.saleProduct.create({
      data: {
        productId: product.id,
        saleId: sale.id,
        quantity: product.quantity,
        unitPrice: Number(unitPrice),
      },
    });

    await db.product.update({
      where: { id: product.id },
      data: {
        stock: {
          decrement: product.quantity,
        },
      },
    });
  }
  revalidateTag("get-products");
};
