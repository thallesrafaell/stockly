import { ComboboxOption } from "../_components/ui/comobobox";
import { DataTable } from "../_components/ui/dataTable";
import { cacheGetProducts } from "../_data-access/products/getProducts";
import { getSales } from "../_data-access/sale/getSales";
import CreateSaleButton from "./_components/createSaleButton";
import { saleTableColumns } from "./_components/table-columns";

export default async function SalesPage() {
  const products = await cacheGetProducts();
  const salesData = await getSales();

  const productOptions: ComboboxOption[] = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de Venda
          </span>
          <h2 className="text-xl font-bold">Vendas</h2>
        </div>
        <CreateSaleButton products={products} productsOption={productOptions} />
      </div>
      <DataTable columns={saleTableColumns} data={salesData} />
    </div>
  );
}
