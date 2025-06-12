import ProductsStatusBadge from "@/app/_components/productsStatusBadge";
import { MostSoldProductDto } from "@/app/_data-access/dashboard/getDashboard";
import { formatCurrency } from "@/app/_helpers/currency";

interface MostSoldProductItemProps {
  product: MostSoldProductDto;
}
const MostSoldProductItem = ({ product }: MostSoldProductItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-[6px]">
        <ProductsStatusBadge status={product.status} />
        <p className="font-semibold">{product.name}</p>
        <p className="font-medium text-slate-500">
          {formatCurrency(Number(product.price))}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold">
          {Number(product.totalSold)} vendidos
        </p>
      </div>
    </div>
  );
};

export default MostSoldProductItem;
