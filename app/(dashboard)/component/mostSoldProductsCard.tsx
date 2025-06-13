import { getMostSoldProducts } from "@/app/_data-access/dashboard/getMostSoldProducts";
import MostSoldProductItem from "./mostSoldProductsItem";

const MostSoldProductsCard = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const mostSoldProducts = await getMostSoldProducts();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <p className="px-6 pt-6 text-lg font-semibold text-slate-900">
        Produtos mais vendidos
      </p>
      <p className="mb-5 px-6 text-sm text-slate-400">
        Top 5 produtos mais vendidos
      </p>

      <div className="space-y-8 overflow-y-auto px-6 pb-6">
        {mostSoldProducts?.map((product) => (
          <MostSoldProductItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MostSoldProductsCard;
