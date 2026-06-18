import { useEffect, useState } from 'react';
import { adminApi } from '../lib/adminApi';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

interface Transaction {
  id: string;
  referenceId: string | null;
  transactionType: string;
  paymentMethod: string | null;
  amountVnd: number;
  amountGold: number;
  amountGem: number;
  status: string;
  playerUsername: string | null;
  playerEmail: string | null;
  createdAt: string;
}

interface PagedResult {
  items: Transaction[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

const typeLabel: Record<string, string> = {
  TopUp: 'Nạp tiền',
  Purchase: 'Mua hàng',
  Refund: 'Hoàn tiền',
  Reward: 'Phần thưởng',
  MarketSale: 'Bán chợ',
  MarketBuy: 'Mua chợ',
};

const statusColor: Record<string, string> = {
  Pending: 'text-amber-400',
  Completed: 'text-emerald-400',
  Failed: 'text-rose-400',
};

const Transactions = () => {
  const [data, setData] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchTxns = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PagedResult>('/api/Admin/transactions', {
        params: { search: search || undefined, pageIndex: page, pageSize: limit },
      });
      setData(res.data);
    } catch (e: any) {
      setError(e.response?.data?.title ?? e.message ?? 'Không thể tải giao dịch.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchTxns(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTxns();
  };

  const total = data?.totalItems ?? 0;
  const txns = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-slate-100">Giao Dịch</h2>
        <p className="mt-1 text-sm text-slate-400">Từ <span className="font-mono text-slate-300">GET /api/Admin/transactions</span></p>

        <form onSubmit={handleSearch} className="mt-5 flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
            placeholder="Tìm mã GD, loại, phương thức, tên người chơi..." />
          <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Tìm
          </button>
        </form>
      </div>

      {error && <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {txns.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div className="text-4xl mb-3">💳</div>
              <div>Không tìm thấy giao dịch.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-800 px-3 py-3">Ref ID</th>
                    <th className="border-b border-slate-800 px-3 py-3">Người chơi</th>
                    <th className="border-b border-slate-800 px-3 py-3">Loại</th>
                    <th className="border-b border-slate-800 px-3 py-3">Phương thức</th>
                    <th className="border-b border-slate-800 px-3 py-3">VND</th>
                    <th className="border-b border-slate-800 px-3 py-3">Gold</th>
                    <th className="border-b border-slate-800 px-3 py-3">Gem</th>
                    <th className="border-b border-slate-800 px-3 py-3">Trạng thái</th>
                    <th className="border-b border-slate-800 px-3 py-3">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="border-b border-slate-800/60 px-3 py-3 font-mono text-xs text-slate-400">
                        {t.referenceId ? t.referenceId.slice(-10) : t.id.slice(-8)}
                      </td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-slate-200">{t.playerUsername ?? '—'}</td>
                      <td className="border-b border-slate-800/60 px-3 py-3">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold">
                          {typeLabel[t.transactionType] ?? t.transactionType}
                        </span>
                      </td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-slate-400 text-xs">{t.paymentMethod ?? '—'}</td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-green-400 font-semibold">
                        {t.amountVnd > 0 ? t.amountVnd.toLocaleString() + '₫' : '—'}
                      </td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-amber-300">
                        {t.amountGold !== 0 ? (t.amountGold > 0 ? '+' : '') + t.amountGold.toLocaleString() : '—'}
                      </td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-purple-300">
                        {t.amountGem !== 0 ? (t.amountGem > 0 ? '+' : '') + t.amountGem.toLocaleString() : '—'}
                      </td>
                      <td className={`border-b border-slate-800/60 px-3 py-3 font-semibold text-xs ${statusColor[t.status] ?? 'text-slate-400'}`}>
                        {t.status}
                      </td>
                      <td className="border-b border-slate-800/60 px-3 py-3 text-xs text-slate-500">
                        {new Date(t.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div>{total} giao dịch</div>
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
