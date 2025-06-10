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
    // Se deleteSaleAction lançar um erro, ele será propagado
    // e capturado pelo next-safe-action, acionando o onError no cliente.
    // Se for bem-sucedido, o onSuccess será acionado.
  });

export const deleteSaleAction = async ({ id }: DeleteSaleFormData) => {
  // A validação do schema já é feita pelo actionClient.inputSchema,
  // então a linha abaixo é redundante.
  // deleteSaleSchema.parse({ id });

  console.log(`[deleteSaleAction] Attempting to delete sale with id: ${id}`);

  try {
    await db.sale.delete({
      where: {
        id,
      },
    });
    console.log(
      `[deleteSaleAction] Sale with id: ${id} deleted successfully from DB.`,
    );

    revalidatePath("/sales");
    console.log(`[deleteSaleAction] Path /sales revalidated.`);
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
