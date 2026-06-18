import { NavLink } from 'react-router-dom';

const sections = [
  {
    label: 'Tổng Quan',
    links: [{ to: '/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Người Chơi',
    links: [
      { to: '/players', label: 'Người Chơi' },
      { to: '/wallets', label: 'Ví Điện Tử' },
      { to: '/transactions', label: 'Giao Dịch'  },
    ],
  },
  {
    label: 'Nội Dung Game',
    links: [
      { to: '/game-items', label: 'Vật Phẩm'},
      { to: '/game-quests', label: 'Nhiệm Vụ' },
      { to: '/game-achievements', label: 'Thành Tích' },
      { to: '/game-config', label: 'Cấu Hình' },
    ],
  },
  {
    label: 'Xếp Hạng & Chiến Đấu',
    links: [
      { to: '/leaderboard', label: 'Bảng Xếp Hạng' },
      { to: '/battle-logs', label: 'Nhật Ký Chiến Đấu' },
    ],
  },
  {
    label: 'Chợ & Quản Trị',
    links: [
      { to: '/marketplace', label: 'Chợ' },
      { to: '/admin-logs', label: 'Nhật Ký Admin' },
    ],
  },
];

const Sidebar = () => (
  <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col">
    <div className="p-5 border-b border-slate-800">
      <div className="text-lg font-bold text-amber-300 leading-tight">Sử Đại Việt</div>
      <div className="text-xs text-slate-500 mt-0.5">Admin Dashboard</div>
    </div>

    <nav className="flex-1 overflow-y-auto p-3 space-y-5">
      {sections.map((section) => (
        <div key={section.label}>
          <div className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`
                }
              >
                <span className="text-base leading-none"></span>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>

    
  </aside>
);

export default Sidebar;
