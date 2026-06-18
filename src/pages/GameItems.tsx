import { useEffect, useState } from 'react';
import { adminApi, publicApi } from '../lib/adminApi';
import Loader from '../components/Loader';

interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  priceGold: number;
  priceGem: number;
  priceVnd: number;
  itemType: string;
  createdAt: string;
}

const itemTypeColor: Record<string, string> = {
  Consumable: 'bg-emerald-900/40 text-emerald-300',
  Skin: 'bg-purple-900/40 text-purple-300',
  Equipment: 'bg-blue-900/40 text-blue-300',
  Weapon: 'bg-rose-900/40 text-rose-300',
  Armor: 'bg-cyan-900/40 text-cyan-300',
  Accessory: 'bg-amber-900/40 text-amber-300',
};

// Modal: sửa giá
const PriceModal = ({
  item,
  onClose,
  onDone,
}: {
  item: ShopItem;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [gold, setGold] = useState(String(item.priceGold));
  const [gem, setGem] = useState(String(item.priceGem));
  const [vnd, setVnd] = useState(String(item.priceVnd));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    setSaving(true);
    try {
      const res = await adminApi.put(`/api/Admin/items/${item.id}/price`, {
        priceGold: Number(gold),
        priceGem: Number(gem),
        priceVnd: Number(vnd),
      });
      setMsg(res.data.message ?? 'Đã cập nhật giá!');
      setTimeout(() => { onDone(); onClose(); }, 1200);
    } catch (e: any) {
      setMsg('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-1">Cập Nhật Giá</h3>
        <p className="text-sm text-slate-400 mb-4 font-mono">{item.id}</p>
        <div className="space-y-3">
          <label className="text-sm text-slate-400">
            Giá Gold
            <input type="number" value={gold} onChange={(e) => setGold(e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 outline-none focus:border-amber-400" />
          </label>
          <label className="text-sm text-slate-400">
            Giá Gem
            <input type="number" value={gem} onChange={(e) => setGem(e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-purple-300 outline-none focus:border-purple-400" />
          </label>
          <label className="text-sm text-slate-400">
            Giá VND
            <input type="number" value={vnd} onChange={(e) => setVnd(e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-green-300 outline-none focus:border-green-400" />
          </label>
        </div>
        {msg && <div className={`mt-3 text-sm rounded-xl px-3 py-2 ${msg.startsWith('Lỗi') ? 'bg-rose-900/30 text-rose-300' : 'bg-emerald-900/30 text-emerald-300'}`}>{msg}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-500">Hủy</button>
          <button onClick={submit} disabled={saving} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal: thêm vật phẩm mới
const CreateModal = ({ onClose, onDone }: { onClose: () => void; onDone: () => void }) => {
  const [form, setForm] = useState({
    id: '', name: '', description: '', priceGold: '0', priceGem: '0', priceVnd: '0',
    itemType: 'Consumable', attributes: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      const res = await adminApi.post('/api/Admin/items', {
        id: form.id,
        name: form.name,
        description: form.description || null,
        priceGold: Number(form.priceGold),
        priceGem: Number(form.priceGem),
        priceVnd: Number(form.priceVnd),
        itemType: form.itemType,
        attributes: form.attributes || null,
      });
      setMsg(res.data.message ?? 'Tạo vật phẩm thành công!');
      setTimeout(() => { onDone(); onClose(); }, 1200);
    } catch (e: any) {
      setMsg('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Thêm Vật Phẩm Mới</h3>
        <div className="space-y-3">
          {[
            { k: 'id', label: 'ID (ví dụ: sword_hue_02)', type: 'text' },
            { k: 'name', label: 'Tên vật phẩm', type: 'text' },
            { k: 'description', label: 'Mô tả', type: 'text' },
          ].map(({ k, label, type }) => (
            <label key={k} className="text-sm text-slate-400 block">
              {label}
              <input type={type} value={form[k as keyof typeof form]} onChange={(e) => set(k, e.target.value)}
                className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400" />
            </label>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm text-slate-400">Gold<input type="number" value={form.priceGold} onChange={(e) => set('priceGold', e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 outline-none focus:border-amber-400" /></label>
            <label className="text-sm text-slate-400">Gem<input type="number" value={form.priceGem} onChange={(e) => set('priceGem', e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-purple-300 outline-none focus:border-purple-400" /></label>
            <label className="text-sm text-slate-400">VND<input type="number" value={form.priceVnd} onChange={(e) => set('priceVnd', e.target.value)} min="0"
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-green-300 outline-none focus:border-green-400" /></label>
          </div>
          <label className="text-sm text-slate-400">Loại vật phẩm
            <select value={form.itemType} onChange={(e) => set('itemType', e.target.value)}
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-400">
              {['Consumable', 'Equipment', 'Skin', 'Weapon', 'Armor', 'Accessory'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-400">Attributes JSON (tuỳ chọn)
            <input value={form.attributes} onChange={(e) => set('attributes', e.target.value)} placeholder='{"attack_boost":25}'
              className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300 outline-none focus:border-amber-400" />
          </label>
        </div>
        {msg && <div className={`mt-3 text-sm rounded-xl px-3 py-2 ${msg.startsWith('Lỗi') ? 'bg-rose-900/30 text-rose-300' : 'bg-emerald-900/30 text-emerald-300'}`}>{msg}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:border-slate-500">Hủy</button>
          <button onClick={submit} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {saving ? 'Đang tạo...' : 'Tạo vật phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
};

const GameItems = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filtered, setFiltered] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priceTarget, setPriceTarget] = useState<ShopItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicApi.get<ShopItem[]>('/api/Shop/items');
      setItems(res.data);
      setFiltered(res.data);
    } catch (e: any) {
      setError(e.response?.data?.title ?? e.message ?? 'Không thể tải vật phẩm.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.toLowerCase();
    setFiltered(q ? items.filter((i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)) : items);
  };

  const deleteItem = async (item: ShopItem) => {
    if (!confirm(`Xóa vật phẩm "${item.name}" (${item.id})?`)) return;
    try {
      await adminApi.delete(`/api/Admin/items/${item.id}`);
      fetchItems();
    } catch (e: any) {
      alert('Lỗi: ' + (e.response?.data?.message ?? e.message));
    }
  };

  return (
    <>
      {priceTarget && <PriceModal item={priceTarget} onClose={() => setPriceTarget(null)} onDone={fetchItems} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onDone={fetchItems} />}

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Vật Phẩm Shop</h2>
              <p className="mt-1 text-sm text-slate-400">Từ <span className="font-mono text-slate-300">GET /api/Shop/items</span></p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
              + Thêm vật phẩm
            </button>
          </div>

          <form onSubmit={handleSearch} className="mt-5 flex gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-400"
              placeholder="Tìm tên hoặc ID..." />
            <button type="submit" className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400">
              Tìm
            </button>
          </form>
        </div>

        {error && <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-300">{error}</div>}

        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <div>Không tìm thấy vật phẩm.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="border-b border-slate-800 px-3 py-3">ID</th>
                      <th className="border-b border-slate-800 px-3 py-3">Tên</th>
                      <th className="border-b border-slate-800 px-3 py-3">Loại</th>
                      <th className="border-b border-slate-800 px-3 py-3">Gold</th>
                      <th className="border-b border-slate-800 px-3 py-3">Gem</th>
                      <th className="border-b border-slate-800 px-3 py-3">VND</th>
                      <th className="border-b border-slate-800 px-3 py-3">Mô tả</th>
                      <th className="border-b border-slate-800 px-3 py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="border-b border-slate-800/60 px-3 py-3 font-mono text-xs text-slate-400">{item.id}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3 font-semibold text-slate-100">{item.name}</td>
                        <td className="border-b border-slate-800/60 px-3 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${itemTypeColor[item.itemType] ?? 'bg-slate-800 text-slate-300'}`}>
                            {item.itemType}
                          </span>
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-amber-300 font-semibold">
                          {item.priceGold > 0 ? item.priceGold.toLocaleString() : '—'}
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-purple-300 font-semibold">
                          {item.priceGem > 0 ? item.priceGem.toLocaleString() : '—'}
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-green-400 font-semibold">
                          {item.priceVnd > 0 ? item.priceVnd.toLocaleString() + '₫' : '—'}
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                          {item.description ?? '—'}
                        </td>
                        <td className="border-b border-slate-800/60 px-3 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => setPriceTarget(item)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold bg-amber-900/40 text-amber-300 hover:bg-amber-900/70">
                              Sửa giá
                            </button>
                            <button onClick={() => deleteItem(item)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold bg-rose-900/40 text-rose-400 hover:bg-rose-900/70">
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-xs text-slate-500">{filtered.length} vật phẩm</div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameItems;
