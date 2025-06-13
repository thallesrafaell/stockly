import { getTodayRevenue } from "@/app/_data-access/dashboard/getTodayRevenue";
import { formatCurrency } from "@/app/_helpers/currency";
import { DollarSignIcon } from "lucide-react";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summaryCard";

const TodayRevenueCard = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const todayRevenue = await getTodayRevenue();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <DollarSignIcon size={24} className="text-primary" />
      </SummaryCardIcon>
      <SummaryCardTitle>Receita Hoje</SummaryCardTitle>
      <SummaryCardValue>{formatCurrency(todayRevenue)}</SummaryCardValue>
    </SummaryCard>
  );
};

export default TodayRevenueCard;
