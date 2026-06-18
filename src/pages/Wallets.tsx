import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Wallet } from '../types';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, count, error } = await supabase
        .from('wallets')
        .select('*', { count: 'exact' })
        .range((page - 1) * limit, page * limit - 1)
        .order('updated_at', { ascending: false });

      if (!error) {
        setWallets(data ?? []);
        setTotal(count ?? 0);
      }
      setLoading(false);
    };
    fetch();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-slate-100">Ví Điện Tử</h2>
        <p className="mt-1 text-sm text-slate-400">Số dư ví người chơi từ bảng wallets.</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {wallets.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div className="text-4xl mb-3">💰</div>
              <div>Chưa có dữ liệu ví.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-800 px-4 py-3">User ID</th>
                    <th className="border-b border-slate-800 px-4 py-3">Gold</th>
                    <th className="border-b border-slate-800 px-4 py-3">Gems</th>
                    <th className="border-b border-slate-800 px-4 py-3">Phiên Bản</th>
                    <th className="border-b border-slate-800 px-4 py-3">Cập Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr key={w.user_id} className="hover:bg-slate-800/40">
                      <td className="border-b border-slate-800/60 px-4 py-3 font-mono text-xs text-slate-400">
                        {w.user_id?.slice(-8)}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-semibold text-amber-300">
                        🪙 {w.gold_balance?.toLocaleString()}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-semibold text-purple-300">
                        💎 {w.gem_balance?.toLocaleString()}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-mono text-xs text-slate-500">
                        v{w.version}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-xs text-slate-500">
                        {new Date(w.updated_at).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div>{total} ví</div>
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;
