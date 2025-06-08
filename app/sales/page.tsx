import { Button } from "@/components/ui/button";
import { ComboboxOption } from "../_components/ui/comobobox";
import { ScrollArea } from "../_components/ui/scroll-area";
import { Sheet, SheetTrigger } from "../_components/ui/sheet";
import { cacheGetProducts } from "../_data-access/products/getProducts";
import UpsertSheetContent from "./_components/upsertSheetContent";

export default async function SalesPage() {
  const products = await cacheGetProducts();

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
        <Sheet>
          <SheetTrigger asChild>
            <Button className="cursor-pointer">Nova venda</Button>
          </SheetTrigger>
          <UpsertSheetContent products={products} productsOption={productOptions} />
        </Sheet>
      </div>
      <ScrollArea className="h-11/12 w-full">
        {/* <DataTable
          columns={productsTableColumns}
          data={JSON.parse(JSON.stringify(products))}
        /> */}
      </ScrollArea>
    </div>
  );
}
