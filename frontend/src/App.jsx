import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Pages
import UserLayout from './module/user/UserLayout';
import Home from './module/user/pages/Home';
import Earn from './module/user/pages/Earn';
import History from './module/user/pages/History';
import Events from './module/user/pages/Events';
import Profile from './module/user/pages/Profile';
import Wallet from './module/user/pages/Wallet';
import Income from './module/user/pages/Income';
import IncomeInfo from './module/user/pages/IncomeInfo';
import Marketing from './module/user/pages/Marketing';
import MarketingHistory from './module/user/pages/MarketingHistory';
import TaskRunner from './module/user/pages/TaskRunner';
import ContestView from './module/user/pages/ContestView';
import BusinessIdeas from './module/user/pages/BusinessIdeas';
import InfoPage from './module/user/pages/InfoPage';
import HelpCenter from './module/user/pages/HelpCenter';
import FutureFund from './module/user/pages/FutureFund';
import PromoteBrand from './module/user/pages/PromoteBrand';
import WatchAndEarn from './module/user/pages/WatchAndEarn';
import AdPlayer from './module/user/pages/AdPlayer';
import QuizView from './module/user/pages/QuizView';
import TaskQuizView from './module/user/pages/TaskQuizView';
import LuckyDrawView from './module/user/pages/LuckyDrawView';
import MemoryMasterView from './module/user/pages/MemoryMasterView';
import ScratchCardView from './module/user/pages/ScratchCardView';
import SpeedTapperView from './module/user/pages/SpeedTapperView';
import TreasureChestView from './module/user/pages/TreasureChestView';

// Auth Pages
import AuthLayout from './module/user/auth/AuthLayout';
import Login from './module/user/auth/Login';
import Register from './module/user/auth/Register';
import KycSetup from './module/user/auth/KycSetup';
import PendingApproval from './module/user/auth/PendingApproval';
import AdminLogin from './module/admin/auth/Login';
import AdminLayout from './module/admin/AdminLayout';
import AdminDashboard from './module/admin/pages/Dashboard';
import Users from './module/admin/pages/Users';
import Payments from './module/admin/pages/Payments';
import Affiliates from './module/admin/pages/Affiliates';
import CoinsAndTasks from './module/admin/pages/CoinsAndTasks';
import FutureFundAdmin from './module/admin/pages/FutureFundAdmin';
import EventsAdmin from './module/admin/pages/Events';
import BusinessContent from './module/admin/pages/BusinessContent';
import Wallets from './module/admin/pages/Wallets';
import NotificationsAdmin from './module/admin/pages/Notifications';
import Reports from './module/admin/pages/Reports';
import SettingsAdmin from './module/admin/pages/Settings';
import KYC from './module/admin/pages/KYC';
import Promotions from './module/admin/pages/Promotions';
import WatchAndEarnAdmin from './module/admin/pages/WatchAndEarnAdmin';
import LayoutManager from './module/admin/pages/LayoutManager';
import MarketingManager from './module/admin/pages/MarketingManager';
import AdminChatSupport from './module/admin/pages/ChatSupport';
import ChatSupportPage from './module/user/pages/ChatSupportPage';
import { AdminProvider, useAdmin } from './module/admin/context/AdminContext';

import { UserProvider, useUser } from './module/user/context/UserContext';
import SplashScreen from './module/user/auth/SplashScreen';

import { Loader2 } from 'lucide-react';

// Protected Route Component
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, userData, loading, logout } = useUser();

  if (!isAuthenticated) return <Navigate to="/user/auth/login" replace />;

  // Show loader while fetching user profile on initial load
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Securely...</p>
      </div>
    );
  }

  return children;
};

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, adminData, loading } = useAdmin();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (loading || !adminData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Authenticating Operator...</p>
      </div>
    );
  }

  return children;
};

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AdminProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Redirecting root to login */}
            <Route path="/" element={<Navigate to="/user/auth/login" replace />} />

            {/* Auth Module Routes (Always Public) */}
            <Route path="/user/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="kyc" element={<KycSetup />} />
              <Route path="pending" element={<PendingApproval />} />
            </Route>

            {/* User Module Routes (Protected) */}
            <Route path="/user" element={<ProtectedUserRoute><UserLayout /></ProtectedUserRoute>}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="earn" element={<Earn />} />
              <Route path="income" element={<Income />} />
              <Route path="income-info" element={<IncomeInfo />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="marketing-history" element={<MarketingHistory />} />
              <Route path="history" element={<History />} />
              <Route path="events" element={<Events />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="profile" element={<Profile />} />
              <Route path="business-ideas" element={<BusinessIdeas />} />
              <Route path="watch" element={<WatchAndEarn />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="future-fund" element={<FutureFund />} />
              <Route path="chat-support" element={<ChatSupportPage />} />
            </Route>

            {/* Public Info Route */}
            <Route path="/user/info/:type" element={<InfoPage />} />

            {/* Immersive User Routes (Protected) */}
            <Route path="/user/task/:id" element={<ProtectedUserRoute><TaskRunner /></ProtectedUserRoute>} />
            <Route path="/user/promote-brand" element={<ProtectedUserRoute><PromoteBrand /></ProtectedUserRoute>} />
            <Route path="/user/ad-player/:id" element={<ProtectedUserRoute><AdPlayer /></ProtectedUserRoute>} />
            <Route path="/user/quiz/:id" element={<ProtectedUserRoute><QuizView /></ProtectedUserRoute>} />
            <Route path="/user/task-quiz/:id" element={<ProtectedUserRoute><TaskQuizView /></ProtectedUserRoute>} />
            <Route path="/user/lucky-draw/:id" element={<ProtectedUserRoute><LuckyDrawView /></ProtectedUserRoute>} />
            <Route path="/user/memory-master/:id" element={<ProtectedUserRoute><MemoryMasterView /></ProtectedUserRoute>} />
            <Route path="/user/scratch-card/:id" element={<ProtectedUserRoute><ScratchCardView /></ProtectedUserRoute>} />
            <Route path="/user/speed-tapper/:id" element={<ProtectedUserRoute><SpeedTapperView /></ProtectedUserRoute>} />
            <Route path="/user/treasure-chest/:id" element={<ProtectedUserRoute><TreasureChestView /></ProtectedUserRoute>} />
            <Route path="/user/contest/:id" element={<ProtectedUserRoute><ContestView /></ProtectedUserRoute>} />

            {/* Admin Module Routes (Protected) */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="users" element={<Users />} />
              <Route path="payments" element={<Payments />} />
              <Route path="affiliates" element={<Affiliates />} />
              <Route path="tasks" element={<CoinsAndTasks />} />
              <Route path="future-fund" element={<FutureFundAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="business-content" element={<BusinessContent />} />
              <Route path="withdrawals" element={<Wallets />} />
              <Route path="notifications" element={<NotificationsAdmin />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="watch-and-earn" element={<WatchAndEarnAdmin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="layout" element={<LayoutManager />} />
              <Route path="marketing-content" element={<MarketingManager />} />
              <Route path="chat-support" element={<AdminChatSupport />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>

            {/* Fallback for safety */}
            <Route path="*" element={<Navigate to="/user/auth/login" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </AdminProvider>
  );
}

export default App;


