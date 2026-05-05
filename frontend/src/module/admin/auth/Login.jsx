import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Mail, Lock, CreditCard,
    TrendingUp, Bell, Wallet, ArrowRight, ChevronRight, AlertCircle,
    Fingerprint, Zap, Landmark, Globe
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import logo from '../../../assets/WhatsApp_Image_2026-04-28_at_10.52.49_PM-removebg-preview.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin } = useAdmin();
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
            icon: Landmark,
            title: "Financial Governance",
            desc: "Secure Institutional Controls",
            content: "Manage global liquidity, set regional transaction limits, and oversee institutional-grade wallet infrastructure. Our governance engine ensures every rupee is accounted for with cryptographic precision."
        },
        {
            icon: Zap,
            title: "Real-time Settlement",
            desc: "Instant Payout Network",
            content: "Monitor the Dromoney high-speed payout queue. Automate withdrawal verifications and manage merchant settlements with sub-second latency across all connected banking nodes."
        },
        {
            icon: Globe,
            title: "Global Compliance",
            desc: "AML & KYC Automation",
            content: "Automated identity verification flows and anti-money laundering checks. The system flags anomalies in real-time, protecting the ecosystem from fraudulent actors and regulatory risks."
        },
        {
            icon: TrendingUp,
            title: "Asset Intelligence",
            desc: "Predictive Analytics",
            content: "Visualize platform revenue velocity and user adoption trends. Use AI-driven insights to predict liquidity requirements and optimize reward allocation for maximum ROI."
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#f9f6f1] font-sans overflow-hidden">
            {/* ── Left Column: Login Form ── */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-white lg:rounded-r-[60px] shadow-2xl z-20">
                <div className="max-w-md w-full mx-auto">
                    {/* Brand Logo */}
                    <div className="mb-10 flex items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center shrink-0">
                            <img src={logo} alt="Dromoney" className="w-full h-full object-contain filter drop-shadow-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tighter">Dromoney</h2>
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mt-1 leading-none">Admin Gateway</p>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Control</h1>
                        <p className="text-slate-500 font-bold text-[14px] uppercase tracking-widest opacity-60">Authorize your session to proceed</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="text-[12px] font-bold">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Authorized Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@dromoney.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-14 text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors active:scale-90"
                                >
                                    {showPassword ? <Fingerprint size={20} /> : <Zap size={20} />}
                                </button>
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] group flex items-center justify-center gap-3"
                        >
                            {loading ? 'Verifying Credentials...' : (
                                <>Access Control Panel <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} /></>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    &copy; 2026 Dromoney Intel Systems
                </p>
            </div>

            {/* ── Right Column: Payment Branding ── */}
            <div className="hidden lg:flex flex-1 bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden z-10">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-full h-full opacity-30">
                     <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                     <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {!selectedItem ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div className="mb-8 pl-5">
                                 <h2 className="text-2xl font-black text-white tracking-tight mb-2">Dromoney Core</h2>
                                 <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">Admin Resource Network</p>
                             </div>
                            {infoItems.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedItem(item)}
                                    className="group cursor-pointer flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                                            <item.icon size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-[13px] font-black text-white tracking-tight leading-none mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                            <p className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-widest transition-colors leading-none">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-300 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] relative">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-[9px] font-black uppercase tracking-widest group transition-colors"
                            >
                                <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Back to System Overview
                            </button>

                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6 group">
                                <selectedItem.icon size={32} className="text-white group-hover:scale-110 transition-transform" />
                            </div>

                            <h2 className="text-2xl font-black text-white tracking-tight mb-4">{selectedItem.title}</h2>
                            <p className="text-slate-400 text-[14px] font-bold leading-relaxed">
                                {selectedItem.content}
                            </p>

                            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-indigo-400" />
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocol Verified</p>
                                </div>
                                <div className="flex -space-x-2">
                                     {[...Array(3)].map((_, i) => <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0f172a] shadow-sm"></div>)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
