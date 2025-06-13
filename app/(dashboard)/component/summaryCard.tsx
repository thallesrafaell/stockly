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

export const SummaryCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl bg-white p-6">{children}</div>;
};

export const SummaryCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white p-6">
      <div className="space-y-2">
        <div className="h-9 w-9 animate-pulse rounded-md bg-slate-200" />
        <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
        <div className="h-[24px] w-36 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
};
