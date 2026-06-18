import { useEffect, useState } from 'react';
import { adminApi } from '../lib/adminApi';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

interface AuditLog {
  id: string | number;
  adminUsername: string | null;
  actionType: string;
  targetType: string | null;
  targetId: string | null;
  details: string | null;
  createdAt: string;
}

interface PagedResult {
  items: AuditLog[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

const actionColor: Record<string, string> = {
  Ban: 'bg-rose-900/40 text-rose-300',
  Unban: 'bg-emerald-900/40 text-emerald-300',
  ChangeRole: 'bg-blue-900/40 text-blue-300',
  AdjustBalance: 'bg-amber-900/40 text-amber-300',
  AwardXp: 'bg-purple-900/40 text-purple-300',
  UpdateConfig: 'bg-cyan-900/40 text-cyan-300',
  UpdateItemPrice: 'bg-orange-900/40 text-orange-300',
  CreateItem: 'bg-green-900/40 text-green-300',
  DeleteItem: 'bg-red-900/40 text-red-300',
};

const AdminLogs = () => {
  const [data, setData] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PagedResult>('/api/Admin/logs', {
        params: { search: search || undefined, pageIndex: page, pageSize: limit },
      });
      setData(res.data);
    } catch (e: any) {
      setError(e.response?.data?.title ?? e.message ?? 'Không thể tải nhật ký.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const total = data?.totalItems ?? 0;
  const logs = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-bold text-slate-100">Nhật Ký Admin</h2>
        <p className="mt-1 text-sm text-slate-400">Từ <span className="font-mono text-slate-300">GET /api/Admin/logs</span></p>

        <form onSubmit={handleSearch} className="mt-5 flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-slate-400"
            placeholder="Tìm theo loại hành động, admin..." />
          <button type="submit" className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700">
            Tìm
          </button>
        </form>
      </div>

      {error && <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <div className="text-4xl mb-3">📋</div>
              <div>Chưa có nhật ký nào.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 py-3 hover:bg-slate-800/20 px-2 rounded-xl">
                  <div className="mt-0.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${actionColor[log.actionType] ?? 'bg-slate-800 text-slate-300'}`}>
                      {log.actionType}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200">
                      <span className="font-semibold text-slate-100">{log.adminUsername ?? 'System'}</span>
                      {log.targetType && (
                        <> → <span className="text-slate-400">{log.targetType}</span>
                          {log.targetId && <span className="font-mono text-xs text-slate-500"> #{String(log.targetId).slice(-8)}</span>}
                        </>
                      )}
                    </div>
                    {log.details && (
                      <div className="mt-1 text-xs text-slate-500 truncate max-w-xl">{log.details}</div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 shrink-0">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div>{total} nhật ký</div>
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
