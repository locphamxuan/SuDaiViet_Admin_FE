const Loader = () => (
  <div className="flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300">
    <div className="flex items-center gap-3 text-sm">
      <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-400" />
      Đang tải dữ liệu...
    </div>
  </div>
);

export default Loader;
