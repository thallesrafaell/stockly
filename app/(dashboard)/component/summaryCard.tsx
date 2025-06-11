export const SummaryCardIcon = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-[#10b98142] text-emerald-500">
      {children}
    </div>
  );
};

export const SummaryCardTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="text-sm font-medium text-slate-500">{children}</h3>;
};

export const SummaryCardValue = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-2xl font-bold text-slate-900">{children}</p>;
};

const SummaryCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl bg-white p-6">{children}</div>;
};

export default SummaryCard;
