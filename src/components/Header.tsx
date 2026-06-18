import { useLocation } from 'react-router-dom';

const pageLabels: Record<string, { title: string; desc: string }> = {
  '/dashboard': { title: 'Dashboard', desc: 'Tổng quan hệ thống' },
  '/players': { title: 'Người Chơi', desc: 'Quản lý tài khoản người chơi' },
  '/wallets': { title: 'Ví Điện Tử', desc: 'Số dư tài khoản người chơi' },
  '/transactions': { title: 'Giao Dịch', desc: 'Lịch sử giao dịch' },
  '/game-items': { title: 'Vật Phẩm', desc: 'Quản lý vật phẩm trong game' },
  '/game-quests': { title: 'Nhiệm Vụ', desc: 'Danh sách nhiệm vụ' },
  '/game-achievements': { title: 'Thành Tích', desc: 'Hệ thống thành tích' },
  '/game-config': { title: 'Cấu Hình Game', desc: 'Chỉnh sửa thông số game' },
  '/leaderboard': { title: 'Bảng Xếp Hạng', desc: 'Top người chơi' },
  '/battle-logs': { title: 'Nhật Ký Chiến Đấu', desc: 'Lịch sử trận chiến' },
  '/marketplace': { title: 'Chợ', desc: 'Giao dịch marketplace' },
  '/admin-logs': { title: 'Nhật Ký Admin', desc: 'Lịch sử hành động quản trị' },
};

const Header = () => {
  const { pathname } = useLocation();
  const info = pageLabels[pathname] ?? { title: 'Admin', desc: 'Sử Đại Việt' };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">{info.title}</h1>
        <p className="text-sm text-slate-500">{info.desc}</p>
      </div>
      
    </div>
  );
};

export default Header;
