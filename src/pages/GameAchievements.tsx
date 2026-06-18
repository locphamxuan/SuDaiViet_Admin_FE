import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GameAchievement } from '../types';
import Loader from '../components/Loader';

const GameAchievements = () => {
  const [achievements, setAchievements] = useState<GameAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    let query = supabase.from('game_achievements').select('*').order('id');
    if (search) query = query.ilike('title', `%${search}%`);
    const { data } = await query;
    setAchievements(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="mt-1 text-sm text-slate-400">Danh sách thành tích</p>

        <form onSubmit={handleSearch} className="mt-5 flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-400"
            placeholder="Tìm tên thành tích..."
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
          >
            Tìm
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-slate-500">
              <div className="text-4xl mb-3">🏆</div>
              <div>Không tìm thấy thành tích.</div>
            </div>
          ) : (
            achievements.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="font-mono text-xs text-slate-500 mb-2">{a.id}</div>
                <div className="flex items-start gap-3">
                  <div>
                    <div className="font-bold text-slate-100">{a.title}</div>
                    {a.description && (
                      <div className="mt-1 text-sm text-slate-400">{a.description}</div>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">🪙</span>
                        <span className="font-semibold text-amber-300">{a.gold_reward.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-purple-400">💎</span>
                        <span className="font-semibold text-purple-300">{a.gem_reward}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GameAchievements;
