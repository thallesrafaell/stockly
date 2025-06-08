"use server";
import { db } from "@/app/_lib/prisma";
import { revalidateTag } from "next/cache";
import { CreateProductFormData, createProductSchema } from "./schema";

export const createProduct = async ( data : CreateProductFormData) => {

   createProductSchema.parse(data); // Validate the input data against the schema
   await db.product.create({
    data,
   });
  
  revalidateTag("get-products"); // Revalidate the cache for get-products

};