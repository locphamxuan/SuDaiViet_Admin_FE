import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MarketplaceListing } from '../types';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const statusColor: Record<string, string> = {
  active: 'text-emerald-400',
  sold: 'text-slate-500',
  cancelled: 'text-rose-400',
};

const Marketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetch = async () => {
    setLoading(true);
    let query = supabase
      .from('marketplace_listings')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;
    if (!error) {
      setListings(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, status]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Chợ</h2>
            <p className="mt-1 text-sm text-slate-400">Giao dịch chợ từ bảng marketplace_listings.</p>
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="">Tất cả</option>
            <option value="active">Đang bán</option>
            <option value="sold">Đã bán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {listings.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div>Chưa có giao dịch</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-800 px-4 py-3">ID</th>
                    <th className="border-b border-slate-800 px-4 py-3">Vật Phẩm</th>
                    <th className="border-b border-slate-800 px-4 py-3">Giá</th>
                    <th className="border-b border-slate-800 px-4 py-3">Tiền Tệ</th>
                    <th className="border-b border-slate-800 px-4 py-3">Số Lượng</th>
                    <th className="border-b border-slate-800 px-4 py-3">Trạng Thái</th>
                    <th className="border-b border-slate-800 px-4 py-3">Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="border-b border-slate-800/60 px-4 py-3 font-mono text-xs text-slate-400">
                        {l.id.slice(-8)}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-semibold text-slate-100">
                        {l.item_id}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-semibold text-amber-300">
                        {l.price.toLocaleString()}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 uppercase text-slate-400">
                        {l.currency}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3">{l.quantity}</td>
                      <td className={`border-b border-slate-800/60 px-4 py-3 capitalize font-semibold ${statusColor[l.status] ?? ''}`}>
                        {l.status === 'active' ? 'Đang bán' : l.status === 'sold' ? 'Đã bán' : 'Đã hủy'}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-xs text-slate-500">
                        {new Date(l.created_at).toLocaleString('vi-VN')}
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

export default Marketplace;
