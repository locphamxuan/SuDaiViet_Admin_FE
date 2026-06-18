import { useEffect, useState } from 'react';
import { adminApi } from '../lib/adminApi';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

interface Player {
  id: string;
  username: string;
  email: string | null;
  isBanned: boolean;
  role: string;
  level: number;
  experience: number;
  goldBalance: number;
  gemBalance: number;
  createdAt: string;
  lastLoginAt: string | null;
}

interface PagedResult {
  items: Player[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Modal: điều chỉnh số dư
const BalanceModal = ({
  player,
  onClose,
  onDone,
}: {
  player: Player;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [gold, setGold] = useState('0');
  const [gem, setGem] = useState('0');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    if (!reason.trim()) return setMsg('Vui lòng nhập lý do.');
    setSaving(true);
    try {
      const res = await adminApi.put(`/api/Admin/players/${player.id}/balance`, {
        goldAmount: Number(gold),
        gemAmount: Number(gem),
        reason,
      });
      setMsg(res.data.message ?? 'Thành công!');
      setTimeout(() => { onDone(); onClose(); }, 1200);
    } catch (e: any) {
      setMsg('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-1">Điều Chỉnh Số Dư</h3>
        <p className="text-sm text-slate-400 mb-4">Người chơi: <span className="text-slate-200 font-semibold">{player.username}</span></p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="space-y-1 text-sm text-slate-400">
            Gold (âm = trừ)
            <input type="number" value={gold} onChange={(e) => setGold(e.target.value)}
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 outline-none focus:border-amber-400" />
          </label>
          <label className="space-y-1 text-sm text-slate-400">
            Gem (âm = trừ)
            <input type="number" value={gem} onChange={(e) => setGem(e.target.value)}
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-purple-300 outline-none focus:border-purple-400" />
          </label>
        </div>
        <label className="space-y-1 text-sm text-slate-400">
          Lý do <span className="text-rose-400">*</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
            placeholder="Bù đắp lỗi server, phần thưởng sự kiện..." />
        </label>
        {msg && <div className={`mt-3 text-sm rounded-xl px-3 py-2 ${msg.startsWith('Lỗi') ? 'bg-rose-900/30 text-rose-300' : 'bg-emerald-900/30 text-emerald-300'}`}>{msg}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-500">Hủy</button>
          <button onClick={submit} disabled={saving} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal: tặng XP
const XpModal = ({ player, onClose, onDone }: { player: Player; onClose: () => void; onDone: () => void }) => {
  const [xp, setXp] = useState('1000');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    setSaving(true);
    try {
      const res = await adminApi.put(`/api/Admin/players/${player.id}/xp`, { xpAmount: Number(xp) });
      const p = res.data.profile;
      setMsg(`Đã cộng ${xp} XP! Cấp ${p?.level ?? '?'} (XP: ${p?.experience ?? '?'})`);
      setTimeout(() => { onDone(); onClose(); }, 1500);
    } catch (e: any) {
      setMsg('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-1">Tặng XP</h3>
        <p className="text-sm text-slate-400 mb-4">{player.username} — Cấp {player.level}</p>
        <label className="text-sm text-slate-400">
          Số XP tặng
          <input type="number" value={xp} onChange={(e) => setXp(e.target.value)} min="1"
            className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-emerald-300 outline-none focus:border-emerald-400" />
        </label>
        {msg && <div className={`mt-3 text-sm rounded-xl px-3 py-2 ${msg.startsWith('Lỗi') ? 'bg-rose-900/30 text-rose-300' : 'bg-emerald-900/30 text-emerald-300'}`}>{msg}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-500">Hủy</button>
          <button onClick={submit} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {saving ? 'Đang tặng...' : 'Tặng XP'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Players = () => {
  const [data, setData] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isBanned, setIsBanned] = useState('');
  const [page, setPage] = useState(1);
  const [balanceTarget, setBalanceTarget] = useState<Player | null>(null);
  const [xpTarget, setXpTarget] = useState<Player | null>(null);
  const limit = 10;

  const fetchPlayers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PagedResult>('/api/Admin/players', {
        params: {
          search: search || undefined,
          isBanned: isBanned === '' ? undefined : isBanned === 'true',
          pageIndex: page,
          pageSize: limit,
        },
      });
      setData(res.data);
    } catch (e: any) {
      setError(e.response?.data?.title ?? e.message ?? 'Không thể tải danh sách người chơi.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchPlayers(); }, [page, isBanned]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPlayers();
  };

  const toggleBan = async (p: Player) => {
    const newBan = !p.isBanned;
    const reason = newBan ? 'Vi phạm điều khoản game Sử Đại Việt' : 'Mở khóa tài khoản';
    try {
      await adminApi.put(`/api/Admin/players/${p.id}/ban`, { isBanned: newBan, reason });
      fetchPlayers();
    } catch (e: any) {
      alert('Lỗi: ' + (e.response?.data?.title ?? e.message));
    }
  };

  const changeRole = async (p: Player) => {
    const newRole = p.role === 'admin' ? 'player' : 'admin';
    if (!confirm(`Chuyển ${p.username} sang vai trò "${newRole.toUpperCase()}"?`)) return;
    try {
      await adminApi.put(`/api/Admin/players/${p.id}/role`, { role: newRole });
      fetchPlayers();
    } catch (e: any) {
      alert('Lỗi: ' + (e.response?.data?.title ?? e.message));
    }
  };

  const total = data?.totalItems ?? 0;
  const players = data?.items ?? [];

  return (
    <>
      {balanceTarget && (
        <BalanceModal player={balanceTarget} onClose={() => setBalanceTarget(null)} onDone={fetchPlayers} />
      )}
      {xpTarget && (
        <XpModal player={xpTarget} onClose={() => setXpTarget(null)} onDone={fetchPlayers} />
      )}

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-bold text-slate-100">Người Chơi</h2>
          <p className="mt-1 text-sm text-slate-400">Quản lý từ <span className="font-mono text-slate-300">GET /api/Admin/players</span></p>

          <form onSubmit={handleSearch} className="mt-5 flex flex-wrap gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[160px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
              placeholder="Tìm tên, email..." />
            <select value={isBanned} onChange={(e) => { setIsBanned(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500">
              <option value="">Tất cả</option>
              <option value="false">Đang hoạt động</option>
              <option value="true">Đã bị ban</option>
            </select>
            <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
              Tìm
            </button>
          </form>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            {players.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <div className="text-4xl mb-3">👤</div>
                <div>Không tìm thấy người chơi.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="border-b border-slate-800 px-3 py-3">Username</th>
                      <th className="border-b border-slate-800 px-3 py-3">Email</th>
                      <th className="border-b border-slate-800 px-3 py-3">Cấp</th>
                      <th className="border-b border-slate-800 px-3 py-3">XP</th>
                      <th className="border-b border-slate-800 px-3 py-3">Gold</th>
                      <th className="border-b border-slate-800 px-3 py-3">Gem</th>
                      <th className="border-b border-slate-800 px-3 py-3">Vai trò</th>
                      <th className="border-b border-slate-800 px-3 py-3">Trạng thái</th>
                      <th className="border-b border-slate-800 px-3 py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="border-b border-slate-800/60 px-3 py-3 font-semibold text-slate-100">{p.username}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-xs text-slate-400">{p.email ?? '—'}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-amber-300 font-bold">{p.level}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-slate-400">{p.experience?.toLocaleString()}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-amber-300">🪙 {p.goldBalance?.toLocaleString()}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-purple-300">💎 {p.gemBalance?.toLocaleString()}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3">
                          <button onClick={() => changeRole(p)}
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold cursor-pointer hover:opacity-80 ${p.role === 'admin' ? 'bg-blue-900/40 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                            {p.role ?? 'player'}
                          </button>
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3">
                          <span className={`font-semibold text-xs ${p.isBanned ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {p.isBanned ? '🔒 Banned' : '✓ Active'}
                          </span>
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button onClick={() => toggleBan(p)}
                              className={`rounded-lg px-2 py-1 text-xs font-semibold ${p.isBanned ? 'bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/70' : 'bg-rose-900/40 text-rose-400 hover:bg-rose-900/70'}`}>
                              {p.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button onClick={() => setBalanceTarget(p)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold bg-amber-900/40 text-amber-300 hover:bg-amber-900/70">
                              Số dư
                            </button>
                            <button onClick={() => setXpTarget(p)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold bg-blue-900/40 text-blue-300 hover:bg-blue-900/70">
                              +XP
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <div>{total} người chơi</div>
              <Pagination page={page} total={total} limit={limit} onChange={setPage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Players;
