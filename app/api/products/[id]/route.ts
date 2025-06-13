import { db } from "@/app/_lib/prisma";
export async function GET(
  request: Request,
  context: { params: { id: string } }, // Alterado aqui
) {
  const { id } = context.params; // E aqui

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    await db.product.delete({
      where: { id },
    });

    // Com status 204, retornamos apenas a Response sem corpo
    return new Response(null, { status: 204 });
  } catch (error) {
    // Verifica se o erro é uma instância de Error para acessar 'message' e 'code'
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return Response.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }
    // Se for um erro conhecido com mensagem, usa a mensagem do erro
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    // Fallback para erros desconhecidos
    return Response.json(
      { error: "Ocorreu um erro inesperado" },
      { status: 500 },
    );
  }
}
