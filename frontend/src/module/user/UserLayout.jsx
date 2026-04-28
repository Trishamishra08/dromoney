import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Wallet as WalletIcon, Home as HomeIcon, LayoutGrid, User, History, PhoneCall, HelpCircle, Building2, Rocket, MonitorPlay, X, CheckCircle2, AlertCircle, Info, Globe, Sparkles, Headset, ChevronDown, TrendingUp } from 'lucide-react';
import { useUser } from './context/UserContext';

const UserLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { userData, notifications, clearNotifications, markAsRead } = useUser();

    const navItems = [
        { path: '/user/home', label: 'Home', icon: HomeIcon },
        { path: '/user/wallet', label: 'Scan', icon: LayoutGrid, isCenter: true },
        { path: '/user/profile', label: 'Profile', icon: User },
    ];

    const getNotifIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'warning': return <AlertCircle className="text-amber-500" size={18} />;
            case 'info': return <Info className="text-sky-500" size={18} />;
            default: return <Bell className="text-sky-500" size={18} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
            {/* --- New Dromoney Fixed Top Header --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between max-w-md mx-auto border-b border-slate-100/50 shadow-sm">
                {/* Left Side: Profile (Compact) */}
                <div className="flex items-center active:scale-95 transition-transform cursor-pointer" onClick={() => navigate('/user/profile')}>
                    <div className="w-10 h-10 rounded-full border-[1.5px] border-slate-100 shadow-inner overflow-hidden bg-slate-50">
                        <img 
                            src={userData?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* Center: Logo */}
                <div className="flex items-center gap-2 active:scale-95 transition-transform cursor-pointer" onClick={() => navigate('/user/home')}>
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <svg className="w-4.5 h-4.5 text-white -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1.3-2.1c.42-.6.44-1.37.04-2.13L3 3l5.3 2.34c.76.4 1.53.38 2.13-.04C11.5 4.5 12.5 4 12.5 4L12 9z" /></svg>
                    </div>
                    <span className="text-[16px] font-semibold text-slate-800 tracking-tight">Dromoney</span>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2">
                    {/* Wallet Icon */}
                    <button
                        onClick={() => navigate('/user/wallet')}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-teal-600 active:scale-90 transition-all"
                    >
                        <WalletIcon size={18} strokeWidth={2} />
                    </button>

                    {/* Bell Icon */}
                    <button
                        onClick={() => setIsNotifOpen(true)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-teal-600 relative active:scale-90 transition-all"
                    >
                        <Bell size={18} strokeWidth={2} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
                        )}
                    </button>

                    {/* Sidebar Menu Icon */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-teal-600 active:scale-90 transition-all ml-0.5"
                    >
                        <Menu size={22} strokeWidth={2} />
                    </button>
                </div>
            </header>

            {/* --- Notification Drawer (Right Side) --- */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isNotifOpen ? 'visible' : 'invisible disabled'}`}>
                {/* Backdrop Blur */}
                <div
                    onClick={() => setIsNotifOpen(false)}
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isNotifOpen ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                {/* Drawer Body */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-sky-50 flex items-center justify-between bg-sky-50/30">
                        <div className="flex items-center gap-2">
                            <Bell className="text-sky-600" size={20} />
                            <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Notifications</h2>
                        </div>
                        <button
                            onClick={() => setIsNotifOpen(false)}
                            className="p-2 hover:bg-sky-100 rounded-full transition-colors text-slate-400"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => markAsRead(notif.id)}
                                    className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer group relative ${
                                        notif.isRead 
                                        ? 'bg-slate-50/50 border border-slate-100 opacity-70' 
                                        : 'bg-white border-2 border-sky-100 shadow-sm shadow-sky-100/50'
                                    }`}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                                    )}
                                    <div className={`mt-1 transition-transform group-hover:scale-110 ${notif.isRead ? 'grayscale opacity-50' : ''}`}>
                                        {getNotifIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-black transition-colors ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] font-bold leading-relaxed ${notif.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 select-none py-20">
                                <Bell size={60} className="text-slate-200 mb-4 stroke-1" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">All caught up</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-sky-50 text-center">
                        <button
                            onClick={clearNotifications}
                            className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:underline px-4 py-2"
                        >
                            Clear all notifications
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Premium Side Menu Drawer (Right Side) --- */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible disabled'}`}>
                {/* Backdrop */}
                <div
                    onClick={() => setIsMenuOpen(false)}
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                {/* Drawer Body (Half Width) */}
                <div className={`absolute top-0 right-0 h-full w-[200px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-sky-50 flex items-center justify-between bg-sky-50/20">
                        <div className="flex items-center gap-2">
                            <Menu className="text-sky-600" size={18} />
                            <h2 className="font-black text-slate-800 text-sm uppercase tracking-tight">Menu</h2>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-1.5 hover:bg-sky-100 rounded-full transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        <div className="flex flex-col">
                            {/* Option 1: Language (Expandable) */}
                            <div className="border-b border-slate-50">
                                <button 
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-slate-400" />
                                        <div>
                                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Language</p>
                                            <p className="text-[9px] font-bold text-sky-600">हिंदी / English</p>
                                        </div>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Language Sub-menu */}
                                <div className={`overflow-hidden transition-all duration-300 bg-slate-50/50 ${isLangOpen ? 'max-h-32' : 'max-h-0'}`}>
                                    <button 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full pl-14 pr-5 py-3 flex items-center justify-between hover:bg-sky-50 transition-colors text-left border-b border-white/50"
                                    >
                                        <span className="text-[10px] font-bold text-slate-600">English</span>
                                        <CheckCircle2 size={12} className="text-sky-500" />
                                    </button>
                                    <button 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full pl-14 pr-5 py-3 flex items-center justify-between hover:bg-sky-50 transition-colors text-left"
                                    >
                                        <span className="text-[10px] font-bold text-slate-600">हिंदी (Hindi)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Option 2: How It Works */}
                            <button 
                                onClick={() => { navigate('/user/info/how-it-works'); setIsMenuOpen(false); }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left"
                            >
                                <HelpCircle size={18} className="text-slate-400" />
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">How It Works</p>
                            </button>

                            {/* Option 3: Benefits */}
                            <button 
                                onClick={() => { navigate('/user/info/benefits'); setIsMenuOpen(false); }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left"
                            >
                                <Sparkles size={18} className="text-slate-400" />
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Benefits</p>
                            </button>

                            {/* Option 4: Support */}
                            <button 
                                onClick={() => { navigate('/user/info/support'); setIsMenuOpen(false); }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left"
                            >
                                <Headset size={18} className="text-slate-400" />
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Support</p>
                            </button>

                            {/* Option 5: Promote Your Brand */}
                            <button 
                                onClick={() => { navigate('/user/promote-brand'); setIsMenuOpen(false); }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left"
                            >
                                <Rocket size={18} className="text-sky-500" />
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Promote Your Brand</p>
                            </button>

                            {/* Option 6: About */}
                            <button 
                                onClick={() => { navigate('/user/info/about'); setIsMenuOpen(false); }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                            >
                                <Building2 size={18} className="text-slate-400" />
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">About Dromoney</p>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-50 text-center">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">V 1.0.2 (ALPHA)</p>
                    </div>
                </div>
            </div>

            {/* --- Dynamic Content Rendering Area (Pages) --- */}
            <main className="max-w-md mx-auto pt-[57px] pb-16">
                <Outlet />
            </main>

            {/* --- Premium Bottom Navigation Bar --- */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    if (item.isCenter) {
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="relative -top-6 flex flex-col items-center justify-center w-14 h-14 bg-teal-800 rounded-full shadow-lg shadow-teal-800/40 text-white transition-transform active:scale-95"
                            >
                                <LayoutGrid size={24} strokeWidth={2} />
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive ? 'text-teal-800' : 'text-slate-400 hover:text-teal-800'}`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default UserLayout;
