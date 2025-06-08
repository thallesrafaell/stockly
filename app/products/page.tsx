import { DataTable } from "../_components/ui/dataTable";
import { getProducts } from "../_data-access/products/getProducts";
import AddProductButton from "./_components/createProductButton";
import { productsTableColumns } from "./_components/tableColumn";

async function ProductsPage() {
  const products = await getProducts();
  // const res = await fetch("http://localhost:3000/api/products");
  // const products = await res.json();

  return (
    <div className="w-full space-y-8 mx-8  rounded-lg my-8 p-8 bg-white">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de Produtos
          </span>
          <h2 className="text-xl font-bold">Produtos</h2>
        </div>
       <AddProductButton/>
      </div>
      <DataTable columns={productsTableColumns} data={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}

export default ProductsPage;
