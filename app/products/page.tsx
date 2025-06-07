import { PlusIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { DataTable } from "../_components/ui/dataTable";
import { getProducts } from "../_data-access/products/getProducts";
import { productsTableColumns } from "./_components/tableColumn";

async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="w-full space-y-8 mx-8  rounded-lg my-8 p-8 bg-white">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de Produtos
          </span>
          <h2 className="text-xl font-bold">Produtos</h2>
        </div>
        <Button className="cursor-pointer">
          <PlusIcon size={20} />
          Adicionar Produto
        </Button>
      </div>
      <DataTable columns={productsTableColumns} data={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}

export default ProductsPage;
