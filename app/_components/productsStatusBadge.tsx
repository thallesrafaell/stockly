import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export interface ProductsStatusBadgeProps {
  status: string;
}

const ProductsStatusBadge = ({ status }: ProductsStatusBadgeProps) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "Em Estoque";
      case "OUT_OF_STOCK":
        return "Fora de Estoque";
      case "DISCONTINUED":
        return "Descontinuado";
      default:
        return "Desconhecido";
    }
  };
  return (
    <Badge
      variant={
        getStatusLabel(status) !== "Fora de Estoque" ? "default" : "outline"
      }
      className="gap-1.5 capitalize"
    >
      {getStatusLabel(status) === "Em Estoque" ? (
        <CircleCheckIcon className="h-4 w-4" />
      ) : (
        <CircleAlertIcon className="h-4 w-4" />
      )}
      {getStatusLabel(status)}
    </Badge>
  );
};

export default ProductsStatusBadge;
