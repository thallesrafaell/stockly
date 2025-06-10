import {
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
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
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Gestão de Produtos</HeaderSubtitle>
          <HeaderTitle>Produtos</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <AddProductButton />
        </HeaderRight>
      </Header>
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
