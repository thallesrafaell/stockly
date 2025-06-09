"use server";
import { db } from "@/app/_lib/prisma";

import { actionClient } from "@/app/_lib/utils/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { createSaleSechema } from "./schema";

export const createSaleAction = actionClient
  .inputSchema(createSaleSechema)
  .action(async ({ parsedInput: { products } }) => {
    await db.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          date: new Date(),
        },
      });

      for (const product of products) {
        const foundProduct = await db.product.findUnique({
          where: { id: product.id },
        });
        if (foundProduct === undefined) {
          return returnValidationErrors(createSaleSechema, {
            _errors: [`Produto com ID ${product.id} não encontrado`],
          });
        }
        const productStock = foundProduct?.stock;

        if (productStock === undefined) {
          return returnValidationErrors(createSaleSechema, {
            _errors: [
              `Produto com ID ${product.id} não possui estoque definido`,
            ],
          });
        }
        const stock = product.quantity > productStock;

        if (stock) {
          return returnValidationErrors(createSaleSechema, {
            _errors: [
              `Quantidade solicitada para o produto com ID ${product.id} excede o estoque disponível`,
            ],
          });
        }

        const unitPrice = foundProduct?.price;
        await tx.saleProduct.create({
          data: {
            productId: product.id,
            saleId: sale.id,
            quantity: product.quantity,
            unitPrice: Number(unitPrice),
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
      revalidateTag("get-products");
    });
  });
