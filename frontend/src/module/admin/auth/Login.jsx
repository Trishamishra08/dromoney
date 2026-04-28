import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Mail, Lock, BookOpen,
    Calendar, Bell, Users, ArrowRight, ChevronRight, AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin, loginError } = useAdmin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await adminLogin(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error);
        }
    };

    const infoItems = [
        {
            icon: BookOpen,
            title: "Visit our Support Center",
            desc: "Get guidance from our Support team.",
            content: "Our admin support team is available 24/7 to help you manage the platform. You can find detailed documentation on user management, transaction verification, and technical troubleshooting inside our dedicated portal."
        },
        {
            icon: Calendar,
            title: "View our Product Roadmap",
            desc: "Browse and vote on what's next.",
            content: "We are constantly building new features. Next up: Real-time fraud detection, automated KYC processing using AI, and multi-currency payout support. Your feedback drives our development priorities."
        },
        {
            icon: Bell,
            title: "Check out the latest releases",
            desc: "See new features and updates.",
            content: "Version 4.2.0 is live! This update includes a faster admin dashboard, enhanced security audit logs, and improved notification delivery for all platform users. Check the changelog for full details."
        },
        {
            icon: Users,
            title: "Join our Admin Community",
            desc: "Discuss with hundreds of system operators.",
            content: "Network with other successful platform operators. Share strategies for growth, discuss compliance best practices, and get early access to beta features in our exclusive Slack community channel."
        }
    ];

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden">
            {/* ── Left Column: Login Form ── */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative">
                <div className="max-w-md w-full mx-auto">
                    {/* Brand Logo */}
                    <div className="mb-12">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-500 font-medium text-[15px]">Please enter your details.</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                            <p className="text-[13px] font-bold">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@dromoney.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[15px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest pl-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-14 text-[15px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors active:scale-90"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 flex gap-3">
                            <AlertCircle size={18} className="text-sky-500 shrink-0" />
                            <p className="text-[11px] font-bold text-sky-700 leading-relaxed">
                                Dev Hint: Use <span className="underline">dromoney@gmail.com</span> with password <span className="underline">dromoney</span> to access the panel.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-950 hover:bg-black text-white py-4 rounded-2xl text-[14px] font-black uppercase tracking-[0.15em] shadow-xl shadow-slate-200 transition-all active:scale-95 group flex items-center justify-center gap-2"
                        >
                            Sign In to Dashboard <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Right Column: Branding / Info ── */}
            <div className="hidden lg:flex flex-1 bg-slate-950 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="w-full max-w-md relative z-10">
                    {!selectedItem ? (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {infoItems.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedItem(item)}
                                    className="group cursor-pointer flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-sky-500 group-hover:border-sky-400 transition-all">
                                            <item.icon size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-black text-white tracking-tight leading-none mb-1">{item.title}</h3>
                                            <p className="text-[10px] font-bold text-white/40 group-hover:text-white/60 uppercase tracking-widest transition-colors leading-none">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={15} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-300 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="flex items-center gap-2 text-white/40 hover:text-white mb-6 text-[10px] font-black uppercase tracking-widest group transition-colors"
                            >
                                <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                                Back
                            </button>

                            <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-5">
                                <selectedItem.icon size={28} className="text-white" />
                            </div>

                            <h2 className="text-xl font-black text-white tracking-tight mb-3">{selectedItem.title}</h2>
                            <p className="text-white/60 text-[14px] font-medium leading-relaxed">
                                {selectedItem.content}
                            </p>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                                <ShieldCheck size={18} className="text-sky-400" />
                                <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Admin Verified Resource</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
