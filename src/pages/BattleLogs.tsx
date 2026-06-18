import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BattleLog } from '../types';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const BattleLogs = () => {
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [battleType, setBattleType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetch = async () => {
    setLoading(true);
    let query = supabase
      .from('battle_logs')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (battleType) query = query.eq('battle_type', battleType);

    const { data, count, error } = await query;
    if (!error) {
      setLogs(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, battleType]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Nhật Ký Chiến Đấu</h2>
            <p className="mt-1 text-sm text-slate-400">Lịch sử trận chiến từ bảng battle_logs.</p>
          </div>
          <select
            value={battleType}
            onChange={(e) => { setBattleType(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-rose-500"
          >
            <option value="">Tất cả loại</option>
            <option value="pvp">PvP</option>
            <option value="pve">PvE</option>
            <option value="boss">Boss</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div>Chưa có nhật ký chiến đấu.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-800 px-4 py-3">ID</th>
                    <th className="border-b border-slate-800 px-4 py-3">Loại</th>
                    <th className="border-b border-slate-800 px-4 py-3">Attacker DMG</th>
                    <th className="border-b border-slate-800 px-4 py-3">Defender DMG</th>
                    <th className="border-b border-slate-800 px-4 py-3">Thời Lượng</th>
                    <th className="border-b border-slate-800 px-4 py-3">Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="border-b border-slate-800/60 px-4 py-3 font-mono text-xs text-slate-400">
                        {String(log.id).slice(-8)}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3">
                        <span className="rounded-full bg-rose-900/30 px-2 py-0.5 text-xs font-semibold text-rose-300 uppercase">
                          {log.battle_type}
                        </span>
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-rose-300 font-semibold">
                        {log.attacker_damage?.toLocaleString() ?? '—'}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-blue-300 font-semibold">
                        {log.defender_damage?.toLocaleString() ?? '—'}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-slate-400">
                        {log.duration_seconds ? `${log.duration_seconds}s` : '—'}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-xs text-slate-500">
                        {new Date(log.created_at).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div>{total} trận chiến</div>
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleLogs;
