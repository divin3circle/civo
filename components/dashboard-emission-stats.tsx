function DashboardEmission() {
  return (
    <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-1 mt-8 md:mt-0">
      <div className="w-full rounded-3xl border border-foreground/20 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Food</h1>
        </div>
        <div className="flex justify-between mt-4 flex-col">
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2">
            <h1 className="text-sm text-muted-foreground">Emission</h1>
            <p className="text-sm">100kg </p>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2 pt-2">
            <h1 className="text-sm text-muted-foreground">Spent</h1>
            <p className="text-xs">USD 2,5000 </p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Last 30 days
        </p>
      </div>
      <div className="w-full rounded-3xl border border-foreground/20 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Transport</h1>
        </div>
        <div className="flex justify-between mt-4 flex-col">
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2">
            <h1 className="text-sm text-muted-foreground">Emission</h1>
            <p className="text-sm">240kg </p>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2 pt-2">
            <h1 className="text-sm text-muted-foreground">Spent</h1>
            <p className="text-sm">USD 5,000 </p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Last 30 days
        </p>
      </div>
      <div className="w-full rounded-3xl border border-foreground/20 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Energy</h1>
        </div>
        <div className="flex justify-between mt-4 flex-col">
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2">
            <h1 className="text-sm text-muted-foreground">Emission</h1>
            <p className="text-sm">120kg </p>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-foreground/20 pb-2 pt-2">
            <h1 className="text-sm text-muted-foreground">Spent</h1>
            <p className="text-sm">USD 3,000 </p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Last 30 days
        </p>
      </div>
    </div>
  );
}

export default DashboardEmission;
