"use client";
import { salesDto } from "@/app/_data-access/sale/getSales";
import { formatCurrency } from "@/app/_helpers/currency";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export const saleTableColumns: ColumnDef<salesDto>[] = [
  {
    accessorKey: "productsName",
    header: "Produtos",
  },
  {
    accessorKey: "totalProducts",
    header: "Quantidade",
  },
  {
    header: "Preço Total",
    cell: ({
      row: {
        original: { totalAmount },
      },
    }) => {
      return formatCurrency(totalAmount);
    },
  },
  {
    header: "Data",
    cell: ({
      row: {
        original: { date },
      },
    }) => {
      return new Date(date).toLocaleDateString();
    },
  },
  {
    header: "Ações",
    cell: () => (
      <Button variant="ghost">
        <MoreHorizontalIcon size={16} />
      </Button>
    ),
  },
];
