"use server";
import { db } from "@/app/_lib/prisma";
import { actionClient } from "@/app/_lib/utils/safe-action";
import { revalidateTag } from "next/cache";
import { UpsertProductFormData, upsertProductSchema } from "./schema";

export const upsertProduct = actionClient
  .inputSchema(upsertProductSchema)
  .action(async ({ parsedInput }) => {
    await upsertProductAction(parsedInput);
  });

const upsertProductAction = async (data: UpsertProductFormData) => {
  upsertProductSchema.parse(data); // Validate the input data against the schema
  await db.product.upsert({
    where: { id: data?.id ?? "" }, // Use an empty string if id is undefined
    create: data,
    update: data,
  });

  revalidateTag("get-products"); // Revalidate the cache for get-products
};
