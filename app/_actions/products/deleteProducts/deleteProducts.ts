"use server";
import { db } from "@/app/_lib/prisma";

import { actionClient } from "@/app/_lib/utils/safe-action";
import { revalidateTag } from "next/cache";
import { DeleteProductFormData, deleteProductSchema } from "./schema";

export const deleteProduct = actionClient
  .inputSchema(deleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    await deleteProductAction({ id });
  });

export const deleteProductAction = async ({ id }: DeleteProductFormData) => {
  deleteProductSchema.parse({ id }); // Validate the input data against the schema

  await db.product.delete({
    where: {
      id, // Ensure the product with the given ID is deleted
    },
  });

  revalidateTag("get-products"); // Revalidate the cache for get-products
};
