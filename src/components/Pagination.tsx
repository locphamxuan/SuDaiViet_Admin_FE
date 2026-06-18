interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, total, limit, onChange }: PaginationProps) => {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const delta = 2;
    const range: (number | '...')[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push('...');
    range.push(pages);
    return range;
  };

  return (
    <div className="flex items-center gap-1 text-sm text-slate-300">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-xl px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-600">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`rounded-xl px-3 py-2 transition ${
              p === page ? 'bg-emerald-500 text-slate-950 font-semibold' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="rounded-xl px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
