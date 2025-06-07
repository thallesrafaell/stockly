import { db } from "@/app/_lib/prisma";



//Apenas para fins de demonstração, este arquivo é um exemplo de como criar uma rota API para gerenciar produtos.
export async function GET() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
 
export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, stock } = body;

  const newProduct = await db.product.create({
    data: {
      name,
      price,
      stock,
    },
  });

  return Response.json(newProduct, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}