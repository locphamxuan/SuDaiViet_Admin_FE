import { useEffect, useState } from 'react';
import { adminApi, publicApi } from '../lib/adminApi';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';

interface Stats {
  players: number;
  transactions: number;
  shopItems: number;
  leaderboard: number;
  quests: number;
  achievements: number;
  configs: number;
  adminLogs: number;
}

const StatCard = ({
  label,
  value,
  sub,
  color = 'text-slate-100',
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
    <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
    <div className={`mt-3 text-3xl font-bold ${color}`}>{value}</div>
    {sub && <div className="mt-1 text-xs text-slate-500 font-mono">{sub}</div>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Partial<Stats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        adminApi.get('/api/Admin/players', { params: { pageIndex: 1, pageSize: 1 } }),
        adminApi.get('/api/Admin/transactions', { params: { pageIndex: 1, pageSize: 1 } }),
        publicApi.get('/api/Shop/items'),
        publicApi.get('/api/Leaderboard'),
        adminApi.get('/api/Admin/logs', { params: { pageIndex: 1, pageSize: 1 } }),
        supabase.from('game_quests').select('*', { count: 'exact', head: true }),
        supabase.from('game_achievements').select('*', { count: 'exact', head: true }),
        publicApi.get('/api/Config'),
      ]);

      const [players, txns, shopItems, lb, logs, quests, achievements, configs] = results;

      setStats({
        players: players.status === 'fulfilled' ? players.value.data.totalItems : 0,
        transactions: txns.status === 'fulfilled' ? txns.value.data.totalItems : 0,
        shopItems: shopItems.status === 'fulfilled' ? shopItems.value.data.length : 0,
        leaderboard: lb.status === 'fulfilled' ? lb.value.data.length : 0,
        adminLogs: logs.status === 'fulfilled' ? logs.value.data.totalItems : 0,
        quests: quests.status === 'fulfilled' ? (quests.value as any).count ?? 0 : 0,
        achievements: achievements.status === 'fulfilled' ? (achievements.value as any).count ?? 0 : 0,
        configs: configs.status === 'fulfilled' ? configs.value.data.length : 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Người Chơi & Giao Dịch</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Người chơi" value={stats.players ?? '—'} color="text-emerald-300" />
          <StatCard label="Giao dịch" value={stats.transactions ?? '—'} color="text-amber-300" />
          <StatCard label="Nhật ký admin" value={stats.adminLogs ?? '—'} color="text-rose-300" />
          <StatCard label="Bảng xếp hạng" value={stats.leaderboard ?? '—'} color="text-blue-300" />
        </div>
      </div>

      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Nội Dung Game</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Vật phẩm shop" value={stats.shopItems ?? '—'} color="text-amber-300" />
          <StatCard label="Cấu hình" value={stats.configs ?? '—'} color="text-amber-300" />
          <StatCard label="Nhiệm vụ" value={stats.quests ?? '—'} color="text-amber-300" />
          <StatCard label="Thành tích" value={stats.achievements ?? '—'} color="text-amber-300" />
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
