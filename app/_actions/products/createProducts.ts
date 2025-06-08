"use server";
import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateProductFormData, createProductSchema } from "./schema";




export const createProduct = async ( data : CreateProductFormData) => {

   createProductSchema.parse(data); // Validate the input data against the schema
   await db.product.create({
    data,
   });
  
  revalidatePath("/products");

};