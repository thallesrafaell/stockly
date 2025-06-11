"use server";
import { db } from "@/app/_lib/prisma";
import { actionClient } from "@/app/_lib/utils/safe-action";
import { revalidatePath } from "next/cache";
import { DeleteSaleFormData, deleteSaleSchema } from "./schema";

export const deleteSale = actionClient
  .inputSchema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    console.log("[Action deleteSale] Triggered with id:", id);
    await deleteSaleAction({ id });
  });

export const deleteSaleAction = async ({ id }: DeleteSaleFormData) => {
  try {
    await db.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        include: {
          SaleProduct: true,
        },
        where: {
          id,
        },
      });

      if (!sale) {
        console.error(`[deleteSaleAction] Sale with id: ${id} not found.`);
        throw new Error(`Sale with id: ${id} not found.`);
      }

      await tx.sale.delete({
        where: {
          id,
        },
      });
      console.info(
        `[deleteSaleAction] Sale with id: ${id} deleted successfully from DB.`,
      );

      for (const saleProduct of sale.SaleProduct) {
        await tx.product.update({
          where: {
            id: saleProduct.productId,
          },
          data: {
            stock: {
              increment: saleProduct.quantity,
            },
          },
        });
        console.info(
          `[deleteSaleAction] Product with id: ${saleProduct.productId} stock updated successfully.`,
        );
      }

      revalidatePath("/sales");
      revalidatePath("/");
      revalidatePath("/products");

      console.info(`[deleteSaleAction] Path /sales revalidated.`);
    });
  } catch (error) {
    console.error(
      `[deleteSaleAction] Error deleting sale with id ${id}:`,
      error,
    );
    // Relançar o erro para que o next-safe-action o capture
    // e o propague para o callback onError no cliente.
    throw error;
  }
};
