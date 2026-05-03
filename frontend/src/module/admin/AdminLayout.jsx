import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
    { path: '/admin/kyc', label: 'KYC Details', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg> },
    { path: '/admin/users', label: 'Users', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { path: '/admin/payments', label: 'Payments', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> },
    { path: '/admin/affiliates', label: 'Affiliate / Referrals', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg> },
    { path: '/admin/tasks', label: 'Coins & Tasks', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18.1" /><path d="M7 6h1v4" /><path d="M17 12h1v4" /><path d="M12 4v2" /><path d="M12 18v2" /></svg> },
    { path: '/admin/future-fund', label: 'Future Fund', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> },
    { path: '/admin/events', label: 'Events', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg> },
    { path: '/admin/business-content', label: 'Business Content', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> },
    { path: '/admin/withdrawals', label: 'Wallet & Withdrawals', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg> },
    { path: '/admin/notifications', label: 'Notifications', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg> },
    { path: '/admin/reports', label: 'Reports / Analytics', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg> },
    { path: '/admin/settings', label: 'Settings', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" /><circle cx="12" cy="12" r="3" /></svg> },
    { path: '/admin/layout', label: 'Nav & Footer Settings', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="2" x2="22" y1="9" y2="9" /><path d="M7 17h.01" /><path d="M12 17h.01" /><path d="M17 17h.01" /></svg> },
    { path: '/admin/marketing-content', label: 'Marketing & Promos', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m17 5-5-3-5 3" /><path d="m17 19-5 3-5-3" /><rect width="18" height="10" x="3" y="7" rx="2" /><path d="M7 12h10" /></svg> },
    { path: '/admin/promotions', label: 'Brand Promotions', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg> },
    { path: '/admin/watch-and-earn', label: 'Watch & Earn', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="3" rx="2" /><path d="m10 8 5 3-5 3V8z" /></svg> },
];

const Toast = ({ notification, onRemove }) => {
    return (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-10 duration-500 relative group">
            <div className="p-4 flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notification.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                    notification.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-500'
                }`}>
                    {notification.type === 'success' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                    ) : notification.type === 'error' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg>
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" /></svg>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{notification.title}</h4>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 leading-tight">{notification.message}</p>
                </div>
                <button onClick={() => onRemove(notification.id)} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
            </div>
            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-50 absolute bottom-0 left-0">
                <div 
                    className={`h-full transition-all linear duration-[5000ms] ${
                        notification.type === 'success' ? 'bg-emerald-500' : 
                        notification.type === 'error' ? 'bg-rose-500' : 'bg-sky-500'
                    }`}
                    style={{ animation: 'deplete 5s linear forwards' }}
                ></div>
            </div>
            <style>{`
                @keyframes deplete {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

const AdminLayout = () => {
    const { adminLogout, notifications, removeNotification } = useAdmin();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    return (
        <div className="fixed inset-0 flex bg-slate-50 font-playfair overflow-hidden">

            {/* ── Notification Drawer ── */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isNotifOpen ? 'visible' : 'invisible'}`}>
                <div onClick={() => setIsNotifOpen(false)} className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isNotifOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute top-0 right-0 h-full w-full max-w-[380px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-100">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            </div>
                            <h2 className="font-black text-slate-800 text-lg tracking-tight uppercase">Admin Activity</h2>
                        </div>
                        <button onClick={() => setIsNotifOpen(false)} className="w-10 h-10 hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {notifications.length > 0 ? notifications.map((notif) => (
                            <div key={notif.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100/40 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-[13px] font-black text-slate-800 group-hover:text-sky-600 transition-colors uppercase tracking-tight">{notif.title}</h4>
                                    <span className="text-[9px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shrink-0 ml-3">Just now</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{notif.message}</p>
                            </div>
                        )) : (
                            <div className="text-center py-20">
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Sidebar ── */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0F172A] flex flex-col shrink-0 transition-all duration-300 relative z-30 h-full border-r border-white/5`}
                style={{ overscrollBehaviorY: 'contain' }}
            >
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
                    <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/30">
                        <svg className="w-5 h-5 text-white -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1.3-2.1c.42-.6.44-1.37.04-2.13L3 3l5.3 2.34c.76.4 1.53.38 2.13-.04C11.5 4.5 12.5 4 12.5 4L12 9z" /></svg>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-base font-black text-white leading-none tracking-tight leading-none mb-0.5">Dromoney</h1>
                            <p className="text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] leading-none">Admin Panel</p>
                        </div>
                    )}
                </div>

                {/* Primary Sidebar Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 flex flex-col gap-1">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                                <item.icon className="w-5 h-5 shrink-0" />
                                {sidebarOpen && <span className="text-[13px] font-black tracking-tight truncate">{item.label}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout moved here - directly after Nav */}
                    <div className="pt-4 border-t border-white/5 mt-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                            {sidebarOpen && <span className="text-[13px] font-black">Logout Session</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm relative z-20">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsNotifOpen(true)} className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 relative transition-transform active:scale-95">
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                            <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-[11px]">A</div>
                            <div className="hidden sm:block">
                                <p className="text-[12px] font-black text-slate-800 leading-none">Admin</p>
                                <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5 uppercase tracking-tighter">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main
                    className="flex-1 overflow-y-auto bg-slate-50/30 grow h-full"
                    style={{ overscrollBehaviorY: 'contain' }}
                >
                    <Outlet />
                </main>
            </div>

            {/* ── Floating Toasts (Right Side) ── */}
            <div className="fixed top-24 right-5 z-[150] flex flex-col gap-3">
                {notifications.map(notif => (
                    <Toast key={notif.id} notification={notif} onRemove={removeNotification} />
                ))}
            </div>
        </div>
    );
};

export default AdminLayout;
