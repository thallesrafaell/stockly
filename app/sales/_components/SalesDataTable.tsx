"use client";

import { ComboboxOption } from "@/app/_components/ui/comobobox";
import { DataTable } from "@/app/_components/ui/dataTable";
import { ProductDto } from "@/app/_data-access/products/getProducts";
import { salesDto } from "@/app/_data-access/sale/getSales";
import { saleTableColumns } from "./table-columns";

interface SalesDataTableProps {
  salesData: salesDto[];
  products: ProductDto[];
  productOptions: ComboboxOption[];
}

export function SalesDataTable({
  salesData,
  products,
  productOptions,
}: SalesDataTableProps) {
  const columns = saleTableColumns(products, productOptions);
  return <DataTable columns={columns} data={salesData} />;
}
