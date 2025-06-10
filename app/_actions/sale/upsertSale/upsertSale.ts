"use server";
import { db } from "@/app/_lib/prisma";
import { actionClient } from "@/app/_lib/utils/safe-action";
import { revalidateTag } from "next/cache";
import { upsertSaleSchema } from "./upsertSaleSchema";

export const upsertSaleAction = actionClient
  .inputSchema(upsertSaleSchema)
  .action(async ({ parsedInput: { id: saleId, products } }) => {
    try {
      // A transação deve retornar o valor para ser o resultado da action
      const result = await db.$transaction(async (tx) => {
        let sale;
        if (saleId) {
          // Lógica de Atualização
          sale = await tx.sale.findUnique({ where: { id: saleId } });
          if (!sale) {
            // Dentro da transação, lançar um erro fará o rollback
            // e será capturado pelo catch externo.
            throw new Error(`Venda com ID ${saleId} não encontrada.`);
          }

          const oldSaleProducts = await tx.saleProduct.findMany({
            where: { saleId: saleId },
            include: { product: true },
          });

          for (const sp of oldSaleProducts) {
            await tx.product.update({
              where: { id: sp.productId },
              data: { stock: { increment: sp.quantity } },
            });
          }

          await tx.saleProduct.deleteMany({ where: { saleId: saleId } });

          for (const product of products) {
            const foundProduct = await tx.product.findUnique({
              where: { id: product.id },
            });

            if (!foundProduct) {
              throw new Error(`Produto com ID ${product.id} não encontrado.`);
            }
            // Importante: Verificar o estoque ANTES de qualquer decremento da transação atual
            // A lógica de oldSaleProducts já incrementou, então foundProduct.stock está atualizado para antes desta venda.
            if (product.quantity > foundProduct.stock) {
              throw new Error(
                `Quantidade (${product.quantity}) para ${foundProduct.name} excede o estoque disponível (${foundProduct.stock}).`,
              );
            }

            await tx.saleProduct.create({
              data: {
                saleId: sale.id,
                productId: product.id,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
              },
            });

            await tx.product.update({
              where: { id: product.id },
              data: { stock: { decrement: product.quantity } },
            });
          }
          await tx.sale.update({
            where: { id: saleId },
            data: { date: new Date() },
          });
        } else {
          // Lógica de Criação
          sale = await tx.sale.create({
            data: {
              date: new Date(),
            },
          });

          for (const product of products) {
            const foundProduct = await tx.product.findUnique({
              where: { id: product.id },
            });

            if (!foundProduct) {
              throw new Error(`Produto com ID ${product.id} não encontrado.`);
            }
            if (product.quantity > foundProduct.stock) {
              throw new Error(
                `Quantidade (${product.quantity}) para ${foundProduct.name} excede o estoque disponível (${foundProduct.stock}).`,
              );
            }

            await tx.saleProduct.create({
              data: {
                saleId: sale.id,
                productId: product.id,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
              },
            });

            await tx.product.update({
              where: { id: product.id },
              data: { stock: { decrement: product.quantity } },
            });
          }
        }

        revalidateTag("get-sales");
        revalidateTag("get-products");
        return { saleId: sale.id }; // Retornar o ID da venda em caso de sucesso
      });
      return result; // Retornar o resultado da transação
    } catch (error) {
      console.error("Erro na upsertSaleAction:", error);
      // Não é mais necessário verificar Prisma.PrismaClientKnownRequestError aqui se os erros são lançados
      // O safe-action tratará o erro lançado e o colocará em `serverError`.
      // Apenas retornamos um objeto de erro genérico se algo inesperado ocorrer fora da transação.
      return {
        error:
          error instanceof Error ? error.message : "Erro ao processar a venda.",
      };
    }
  });
