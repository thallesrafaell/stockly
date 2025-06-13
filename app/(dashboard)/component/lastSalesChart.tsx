import { getLastSales } from "@/app/_data-access/dashboard/getLastSales";
import RevenueChart from "./revenueChars";

const LastSalesChart = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const totalLast14DaysRevenue = await getLastSales();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-6">
      <p className="text-lg font-semibold text-slate-900">Receita</p>
      <p className="text-sm text-slate-400">Últimos 14 dias</p>
      <RevenueChart data={totalLast14DaysRevenue} />
    </div>
  );
};

export default LastSalesChart;
