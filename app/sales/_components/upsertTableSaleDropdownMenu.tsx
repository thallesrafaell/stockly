import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Product } from "@/app/generated/prisma";
import {
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";

interface TableSaleDropdownMenuProps {
  product: Pick<Product, "id">;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const UpsertTableSaleDropdownMenu = ({
  product,
  onDelete,
  onEdit,
}: TableSaleDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer p-1 hover:bg-transparent"
        >
          <MoreHorizontalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-1.5"
          onClick={() => {
            navigator.clipboard.writeText(product.id);
            toast.success("ID copiado para a área de transferência");
          }}
        >
          <ClipboardCopyIcon size={16} /> Copiar ID
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-1.5"
          onClick={() => onEdit(product.id)}
        >
          <EditIcon size={16} />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer gap-1.5 text-red-500"
          onClick={() => onDelete(product.id)}
        >
          <TrashIcon color="red" size={16} />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UpsertTableSaleDropdownMenu;
