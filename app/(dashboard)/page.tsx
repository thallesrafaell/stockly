import { Suspense } from "react";
import {
  Header,
  HeaderLeft,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import LastSalesChart from "./component/lastSalesChart";
import MostSoldProductsCard from "./component/mostSoldProductsCard";
import { SummaryCardSkeleton } from "./component/summaryCard";
import TodayRevenueCard from "./component/todayRevenueCard";
import TotalProducts from "./component/totalProducts";
import TotalRevenueCard from "./component/totalRevenueCard";
import TotalSales from "./component/totalSales";
import { TotalStock } from "./component/totalStock";

export default async function Home() {
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
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalProducts />
        </Suspense>
      </div>
      <div className="grid min-h-0 grid-cols-[2.5fr_1fr] gap-6">
        <Suspense
          fallback={
            <div className="rounded-xl bg-white p-6">
              <div className="space-y-2">
                <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
                <div className="h-[24px] w-36 animate-pulse rounded-md bg-slate-200" />
                <div className="h-[300px] w-full animate-pulse rounded-md bg-slate-200" />
              </div>
            </div>
          }
        >
          <LastSalesChart />
        </Suspense>
        <Suspense
          fallback={
            <div className="rounded-xl bg-white p-6">
              <div className="space-y-2">
                <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
                <div className="h-[24px] w-36 animate-pulse rounded-md bg-slate-200" />
                <div className="h-[300px] w-full animate-pulse rounded-md bg-slate-200" />
              </div>
            </div>
          }
        >
          <MostSoldProductsCard />
        </Suspense>
      </div>
    </div>
  );
}
