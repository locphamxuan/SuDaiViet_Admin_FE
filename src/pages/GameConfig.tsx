import { useEffect, useState } from 'react';
import { adminApi, publicApi } from '../lib/adminApi';
import Loader from '../components/Loader';

interface Config {
  configKey: string;
  configValue: number | string;
  description: string | null;
  updatedAt: string;
}

const heroKey: Record<string, string> = {
  hue: '🗡️ Nguyễn Huệ',
  nhac: '🛡️ Nguyễn Nhạc',
  lu: '🏹 Nguyễn Lữ',
};

const GameConfigPage = () => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchConfigs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicApi.get<Config[]>('/api/Config');
      setConfigs(res.data);
    } catch (e: any) {
      setError(e.response?.data?.title ?? e.message ?? 'Không thể tải cấu hình.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchConfigs(); }, []);

  const startEdit = (cfg: Config) => {
    setEditing(cfg.configKey);
    setEditValue(String(cfg.configValue));
    setEditDesc(cfg.description ?? '');
    setMsg('');
  };

  const saveEdit = async (key: string) => {
    setSaving(true);
    try {
      const numVal = Number(editValue);
      const res = await adminApi.put('/api/Config', {
        configKey: key,
        configValue: isNaN(numVal) ? editValue : numVal,
        description: editDesc,
      });
      setMsg(res.data.message ?? 'Đã cập nhật cấu hình!');
      setEditing(null);
      fetchConfigs();
    } catch (e: any) {
      setMsg('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
    setSaving(false);
  };

  const getHeroLabel = (key: string): string => {
    for (const [heroId, label] of Object.entries(heroKey)) {
      if (key.includes(heroId)) return label;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-slate-100">Cấu Hình Game</h2>
        
        {msg && (
          <div className={`mt-3 rounded-xl px-4 py-2 text-sm ${msg.startsWith('Lỗi') ? 'bg-rose-900/30 text-rose-300' : 'bg-emerald-900/30 text-emerald-300'}`}>
            {msg}
          </div>
        )}
      </div>

      {error && <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {configs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div>Không có cấu hình.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {configs.map((cfg) => {
                const hero = getHeroLabel(cfg.configKey);
                return (
                  <div key={cfg.configKey} className="flex items-center gap-4 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-amber-300">{cfg.configKey}</span>
                        {hero && <span className="text-xs text-slate-500">{hero}</span>}
                      </div>
                      {cfg.description && (
                        <div className="mt-0.5 text-xs text-slate-400 truncate">{cfg.description}</div>
                      )}
                      <div className="mt-0.5 text-xs text-slate-600">
                        {new Date(cfg.updatedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>

                    {editing === cfg.configKey ? (
                      <div className="flex flex-col gap-2 min-w-[260px]">
                        <div className="flex items-center gap-2">
                          <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                            className="w-28 rounded-lg border border-amber-500 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 outline-none" autoFocus />
                          <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Mô tả..."
                            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-slate-500" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(cfg.configKey)} disabled={saving}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
                            {saving ? 'Lưu...' : 'Lưu'}
                          </button>
                          <button onClick={() => setEditing(null)}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500">
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-sm font-bold text-slate-100">
                          {String(cfg.configValue)}
                        </span>
                        <button onClick={() => startEdit(cfg)}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-amber-500 hover:text-amber-300">
                          Sửa
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameConfigPage;
