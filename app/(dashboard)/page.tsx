import {
  CircleDollarSignIcon,
  DollarSignIcon,
  Package2,
  ShoppingBasketIcon,
} from "lucide-react";
import {
  Header,
  HeaderLeft,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import { getDashboard } from "../_data-access/dashboard/getDashboard";
import { formatCurrency } from "../_helpers/currency";
import MostSoldProductItem from "./component/mostSoldProductsItem";
import RevenueChart from "./component/revenueChars";
import SummaryCard, {
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./component/summaryCard";

export default async function Home() {
  const {
    todayRevenue,
    totalRevenue,
    totalProducts,
    totalSales,
    totalStock,
    totalLast14DaysRevenue,
    mostSoldProducts,
  } = await getDashboard();

  return (
    <div className="m-8 flex w-full flex-col space-y-8 rounded-lg">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Dashboard</HeaderSubtitle>
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderLeft>
      </Header>

      <div className="grid grid-cols-2 gap-6">
        <SummaryCard>
          <SummaryCardIcon>
            <DollarSignIcon size={24} className="text-primary" />
          </SummaryCardIcon>
          <SummaryCardTitle>Receita total</SummaryCardTitle>
          <SummaryCardValue>{formatCurrency(totalRevenue)}</SummaryCardValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryCardIcon>
            <DollarSignIcon size={24} className="text-primary" />
          </SummaryCardIcon>
          <SummaryCardTitle>Receita Hoje</SummaryCardTitle>
          <SummaryCardValue>{formatCurrency(todayRevenue)}</SummaryCardValue>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard>
          <SummaryCardIcon>
            <CircleDollarSignIcon size={24} className="text-primary" />
          </SummaryCardIcon>
          <SummaryCardTitle>Vendas Totais</SummaryCardTitle>
          <SummaryCardValue>{totalSales}</SummaryCardValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryCardIcon>
            <Package2 size={24} className="text-primary" />
          </SummaryCardIcon>
          <SummaryCardTitle>Total em Estoque</SummaryCardTitle>
          <SummaryCardValue>{totalStock}</SummaryCardValue>
        </SummaryCard>
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
