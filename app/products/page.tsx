import { DataTable } from "../_components/ui/dataTable";
import { ScrollArea } from "../_components/ui/scroll-area";
import { cacheGetProducts } from "../_data-access/products/getProducts";
import AddProductButton from "./_components/createProductButton";
import { productsTableColumns } from "./_components/tableColumn";

async function ProductsPage() {
  const products = await cacheGetProducts();
  // const res = await fetch("http://localhost:3000/api/products");
  // const products = await res.json();

  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de Produtos
          </span>
          <h2 className="text-xl font-bold">Produtos</h2>
        </div>
        <AddProductButton />
      </div>
      <ScrollArea className="h-11/12 w-full">
        <DataTable
          columns={productsTableColumns}
          data={JSON.parse(JSON.stringify(products))}
        />
      </ScrollArea>
    </div>
  );
}

export default ProductsPage;
