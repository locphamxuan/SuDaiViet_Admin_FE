import { useEffect, useState } from 'react';
import { publicApi } from '../lib/adminApi';
import Loader from '../components/Loader';

interface LeaderboardEntry {
  username: string;
  score: number;
  stageReached: string | null;
  rank?: number;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await publicApi.get<LeaderboardEntry[]>('/api/Leaderboard');
        setEntries(res.data ?? []);
      } catch (e: any) {
        setError(e.response?.data?.title ?? e.message ?? 'Không thể tải bảng xếp hạng.');
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const rankMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-slate-100">Bảng Xếp Hạng</h2>
      </div>

      {error && <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div>Chưa có nghĩa sĩ nào trên bảng vinh danh.</div>
              <div className="mt-1 text-xs">Bảng xếp hạng sẽ xuất hiện khi người chơi gửi điểm số.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-800 px-4 py-3">Hạng</th>
                    <th className="border-b border-slate-800 px-4 py-3">Nghĩa Sĩ</th>
                    <th className="border-b border-slate-800 px-4 py-3">Điểm Số</th>
                    <th className="border-b border-slate-800 px-4 py-3">Ải Đạt Tới</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={e.username + i} className={`hover:bg-slate-800/40 ${i < 3 ? 'bg-slate-800/20' : ''}`}>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-lg">{rankMedal(i)}</td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-semibold text-slate-100">{e.username}</td>
                      <td className="border-b border-slate-800/60 px-4 py-3 font-bold text-amber-300 text-base">
                        {e.score?.toLocaleString()}
                      </td>
                      <td className="border-b border-slate-800/60 px-4 py-3 text-slate-400">
                        {e.stageReached ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
