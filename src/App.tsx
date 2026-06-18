import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Wallets from './pages/Wallets';
import Transactions from './pages/Transactions';
import GameItems from './pages/GameItems';
import GameQuests from './pages/GameQuests';
import GameAchievements from './pages/GameAchievements';
import GameConfigPage from './pages/GameConfig';
import Leaderboard from './pages/Leaderboard';
import BattleLogs from './pages/BattleLogs';
import Marketplace from './pages/Marketplace';
import AdminLogs from './pages/AdminLogs';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 p-6">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/game-items" element={<GameItems />} />
              <Route path="/game-quests" element={<GameQuests />} />
              <Route path="/game-achievements" element={<GameAchievements />} />
              <Route path="/game-config" element={<GameConfigPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/battle-logs" element={<BattleLogs />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/admin-logs" element={<AdminLogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
