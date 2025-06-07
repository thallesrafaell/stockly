
import { db } from "@/app/_lib/prisma";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await db.product.delete({
      where: { id },
    });
    
    // Com status 204, retornamos apenas a Response sem corpo
    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return Response.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}