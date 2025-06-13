import { ShoppingBasketIcon } from "lucide-react";
import { Suspense } from "react";
import {
  Header,
  HeaderLeft,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import { getDashboard } from "../_data-access/dashboard/getDashboard";
import MostSoldProductItem from "./component/mostSoldProductsItem";
import RevenueChart from "./component/revenueChars";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardSkeleton,
  SummaryCardTitle,
  SummaryCardValue,
} from "./component/summaryCard";
import TodayRevenueCard from "./component/todayRevenueCard";
import TotalRevenueCard from "./component/totalRevenueCard";
import TotalSales from "./component/totalSales";
import { TotalStock } from "./component/totalStock";

export default async function Home() {
  const { totalProducts, totalLast14DaysRevenue, mostSoldProducts } =
    await getDashboard();

  return (
    <div className="m-8 flex w-full flex-col space-y-8 rounded-lg">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Dashboard</HeaderSubtitle>
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderLeft>
      </Header>

      <div className="grid grid-cols-2 gap-6">
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalRevenueCard />
        </Suspense>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TodayRevenueCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalSales />
        </Suspense>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalStock />
        </Suspense>
        <SummaryCard>
          <SummaryCardIcon>
            <ShoppingBasketIcon size={24} className="text-primary" />
          </SummaryCardIcon>
          <SummaryCardTitle>Total em Produtos</SummaryCardTitle>
          <SummaryCardValue>{totalProducts}</SummaryCardValue>
        </SummaryCard>
      </div>
      <div className="grid min-h-0 grid-cols-[2.5fr_1fr] gap-6">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">Receita</p>
          <p className="text-sm text-slate-400">Últimos 14 dias</p>
          <RevenueChart data={totalLast14DaysRevenue ?? []} />
        </div>
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
          <p className="p-6 text-lg font-semibold text-slate-900">
            Produtos mais vendidos
          </p>
          <div className="space-y-8 overflow-y-auto px-6 pb-6">
            {mostSoldProducts?.map((product) => (
              <MostSoldProductItem key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
