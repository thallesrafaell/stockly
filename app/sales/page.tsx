import {
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import { ComboboxOption } from "../_components/ui/comobobox";
import { cacheGetProducts } from "../_data-access/products/getProducts";
import { getSales } from "../_data-access/sale/getSales";
import CreateSaleButton from "./_components/createSaleButton";
import { SalesDataTable } from "./_components/SalesDataTable";

export default async function SalesPage() {
  const products = await cacheGetProducts();
  const salesData = await getSales();

  const productOptions: ComboboxOption[] = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Gestão de Venda</HeaderSubtitle>
          <HeaderTitle>Vendas</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <CreateSaleButton
            products={products}
            productsOption={productOptions}
          />
        </HeaderRight>
      </Header>
      <SalesDataTable
        salesData={salesData}
        products={products}
        productOptions={productOptions}
      />
    </div>
  );
}
