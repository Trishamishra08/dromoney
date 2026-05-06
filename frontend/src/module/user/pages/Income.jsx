import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PaymentModal from '../components/PaymentModal';
import {
    Share2, TrendingUp, CheckSquare, Trophy, Briefcase,
    Sparkles, ChevronRight, Lock, Loader2, ShieldCheck, Zap,
    UploadCloud, Fingerprint, Image as ImageIcon, CheckCircle2, Clock, Wifi
} from 'lucide-react';
import { contentStorage } from '../../shared/services/contentStorage';
import LogoImg from '../../../assets/WhatsApp_Image_2026-04-28_at_10.52.49_PM-removebg-preview.png';

// ─── 6 Income Cards Config (Modern Fintech Design) ───────────────────────────
const INCOME_OPTIONS = [
    {
        id: 1,
        title: 'Earn ₹200 Per Referral',
        subtitle: 'Invite users and earn ₹200 on each purchase',
        icon: Share2,
        bg: 'bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-400',
        cta: 'Invite & Earn',
        route: '/user/marketing',
        isHighlight: true
    },
    {
        id: 2,
        title: 'Future Fund',
        subtitle: 'Complete targets & earn bonus rewards',
        icon: TrendingUp,
        bg: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        cta: 'View Progress',
        route: '/user/future-fund',
        hasProgress: true
    },
    {
        id: 3,
        title: 'Earn Coins Daily',
        subtitle: 'Complete tasks and earn coins',
        icon: CheckSquare,
        bg: 'bg-orange-50',
        borderColor: 'border-orange-100',
        cta: 'Start Tasks',
        route: '/user/earn',
    },
    {
        id: 4,
        title: 'Win Real Cash',
        subtitle: 'Join events and win rewards',
        icon: Trophy,
        bg: 'bg-purple-50',
        borderColor: 'border-purple-100',
        cta: 'Join Now',
        route: '/user/events',
    },
    {
        id: 5,
        title: 'Start Your Business',
        subtitle: 'Explore free & premium ideas',
        icon: Briefcase,
        bg: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        cta: 'Explore',
        route: '/user/business-ideas',
    },
    {
        id: 6,
        title: 'Future and Option',
        subtitle: 'Upcoming earning opportunities',
        icon: Sparkles,
        bg: 'bg-slate-100',
        borderColor: 'border-slate-200',
        cta: 'Discover',
        route: '/user/info/future-features',
        locked: false,
    },
];

import api from '../../shared/services/api';

const Income = () => {
    const navigate = useNavigate();
    const { userData, unlockPlatform, addNotification, loading: userLoading, refreshUserProfile } = useUser();
    const { isPaid, kycStatus: userKycStatus } = userData;

    // --- State Management ---
    const [kycStatus, setKycStatus] = useState(userKycStatus || 'Not Started');
    const [aadhaarNum, setAadhaarNum] = useState('');
    const [kycPhoto, setKycPhoto] = useState(null);
    const [rawFile, setRawFile] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projectsData, setProjectsData] = useState({ title: 'Dromoney Projects', description: 'Loading latest projects...' });

    useEffect(() => {
        fetchProjects();
        setKycStatus(userKycStatus);
    }, [userKycStatus]);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/public/content/income_projects');
            if (res.success) {
                // Prioritize nested data if exists (for dynamic CMS compatibility)
                if (res.data.data) {
                    setProjectsData(res.data.data);
                } else {
                    setProjectsData(res.data);
                }
            }
        } catch (err) {
            console.error("Content fetch failed:", err);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawFile(file);
            setKycPhoto(URL.createObjectURL(file));
        }
    };

    const handleKycSubmit = async () => {
        if (!aadhaarNum || !rawFile) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('documentNumber', aadhaarNum);
            formData.append('document', rawFile);

            const res = await api.patch('/user/data/kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.success) {
                setKycStatus('Pending');
                addNotification("Submitted!", "KYC is now in review.", "success");
            }
        } catch (err) {
            addNotification("Error", err.message || "Failed to submit KYC", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        await refreshUserProfile();
        setIsPaymentOpen(false);
        addNotification("Unlocked!", "Full platform access granted!", "success");
    };

    const handleCardClick = (route) => {
        if (route) navigate(route);
    };

    const status = (userKycStatus || 'Not Started').toLowerCase();

    useEffect(() => {
        if (userLoading) return; // Wait for profile sync before redirecting
        if (status === 'pending' || status === 'rejected') {
            navigate('/user/auth/pending');
        } else if (status === 'not started') {
             navigate('/user/auth/kyc');
        }
    }, [status, navigate, userLoading]);

    if (userLoading || status === 'pending' || status === 'rejected' || status === 'not started') {
        return (
            <div className="min-h-screen bg-[#0B1221] flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="animate-spin text-amber-500" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifying access...</p>
            </div>
        );
    }



    // ── LAYER 3: Approved but not Paid ──────────────────────────────────────
    if ((status === 'approved' || status === 'verified') && !isPaid) {
        return (
            <>
                {isPaymentOpen && (
                    <PaymentModal
                        isOpen={true}
                        onClose={() => setIsPaymentOpen(false)}
                        plan="Income Access"
                        amount={499}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
                <div className="flex flex-col p-5 max-h-[90vh] bg-slate-50 animate-in fade-in duration-500 pb-20 justify-center">
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative scale-[0.95]">
                        <div className="bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 blur-2xl"></div>
                            <CheckCircle2 size={40} className="text-white mx-auto mb-3 drop-shadow-lg" />
                            <h2 className="text-white font-black text-xl tracking-tight">KYC Verified!</h2>
                            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">Identity Confirmed</p>
                        </div>

                        <div className="p-6 text-center">
                            <p className="text-slate-400 text-[13px] font-bold mb-6 leading-relaxed">
                                "Congratulations! Your account is verified. To unlock 6+ income methods, purchase our premium access course today."
                            </p>

                            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 mb-6 flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Enrollment Fee</p>
                                    <p className="text-2xl font-black text-sky-600 mt-1 leading-none">₹499</p>
                                </div>
                                <div className="bg-white px-3 py-1 rounded-lg border border-sky-100">
                                    <span className="text-[10px] font-black text-emerald-500 tracking-tighter">LIFE ACCESS</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPaymentOpen(true)}
                                className="w-full bg-slate-900 hover:bg-black active:scale-95 text-white font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-3 shadow-xl transition-all shadow-slate-100 text-xs"
                            >
                                <Zap size={16} fill="currentColor" className="text-sky-400" />
                                Buy Course & Unlock
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ── LAYER 4: Final Income Cards (Modern Mobile UI Redesign) ─────────────
    return (
        <div className="flex flex-col gap-5 p-5 bg-[#F8FAFC] animate-in fade-in duration-700">
            {/* Minimal Sub-Header */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Income Center</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">Verified Earning Systems</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                    <TrendingUp size={20} className="text-blue-500" />
                </div>
            </div>

            {/* Premium Debit Card Style Referral Section (Rounded & Compact) */}
            <div className="px-1 mb-1">
                <div
                    onClick={() => handleCardClick(INCOME_OPTIONS[0].route)}
                    className="w-full relative aspect-[2/1] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 shadow-xl active:brightness-90 transition-all cursor-pointer overflow-hidden group flex flex-col justify-between border border-white/10"
                    style={{ borderRadius: '2rem' }}
                >
                    {/* Holographic Overlays */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                    
                    {/* Top Row: Brand & Wireless */}
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-0.5">Dromoney Card</span>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-5 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 rounded-sm shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 border-t border-b border-black/20 grid grid-cols-3">
                                        <div className="border-r border-black/20"></div>
                                        <div className="border-r border-black/20"></div>
                                    </div>
                                </div>
                                <div className="text-white/30">
                                    <Wifi size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                        <img src={LogoImg} className="w-8 h-8 object-contain brightness-0 invert opacity-80" alt="Logo" />
                    </div>

                    {/* Middle Row: Numbers / Title */}
                    <div className="relative z-10 py-1">
                        <h3 className="text-lg font-black text-white tracking-[0.05em] leading-tight drop-shadow-lg">
                            {INCOME_OPTIONS[0].title.replace('Earn ', '')}
                        </h3>
                        <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">
                            {INCOME_OPTIONS[0].subtitle}
                        </p>
                    </div>

                    {/* Bottom Row: Name & Mastercard Logo Design */}
                    <div className="flex justify-between items-end relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[6px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Card Holder</span>
                            <span className="text-[12px] font-black text-white uppercase tracking-wider">{userData.name || 'REFERRAL PARTNER'}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="relative flex">
                                <div className="w-7 h-7 bg-rose-500 rounded-full opacity-90"></div>
                                <div className="w-7 h-7 bg-amber-500 rounded-full -ml-3.5 opacity-80 backdrop-blur-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glassmorphism Card Grid (Compact & Rounded) */}
            <div className="grid grid-cols-2 gap-2.5 pb-8">
                {INCOME_OPTIONS.slice(1).map((opt) => {
                    const Icon = opt.icon;
                    const THEMES = {
                        2: { gradient: 'from-blue-50 to-indigo-100', accent: 'text-indigo-600', pill: 'bg-indigo-600/10 text-indigo-700', shadow: 'shadow-indigo-100' },
                        3: { gradient: 'from-amber-50 to-orange-100', accent: 'text-orange-600', pill: 'bg-orange-600/10 text-orange-700', shadow: 'shadow-orange-100' },
                        4: { gradient: 'from-purple-50 to-violet-100', accent: 'text-violet-600', pill: 'bg-violet-600/10 text-violet-700', shadow: 'shadow-violet-100' },
                        5: { gradient: 'from-emerald-50 to-teal-100', accent: 'text-teal-600', pill: 'bg-teal-600/10 text-teal-700', shadow: 'shadow-teal-100' },
                        6: { gradient: 'from-slate-100 to-slate-200', accent: 'text-slate-600', pill: 'bg-slate-600/10 text-slate-700', shadow: 'shadow-slate-200' }
                    };
                    const theme = THEMES[opt.id] || THEMES[6];

                    return (
                        <div
                            key={opt.id}
                            onClick={() => handleCardClick(opt.route)}
                            className={`relative bg-gradient-to-br ${theme.gradient} p-3.5 shadow-lg ${theme.shadow} border border-white active:scale-[0.98] transition-all cursor-pointer overflow-hidden group flex flex-col`}
                            style={{ borderRadius: '1.5rem' }}
                        >
                            {/* Glass Background Decor */}
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/40 rounded-full blur-2xl"></div>

                            {/* Top Dual Icons - More Compact */}
                            <div className="flex gap-1.5 mb-2 relative z-10">
                                <div className="w-7 h-7 bg-white/70 backdrop-blur-md rounded-lg flex items-center justify-center border border-white shadow-sm">
                                    <Icon size={14} className={theme.accent} />
                                </div>
                                <div className="w-7 h-7 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/50">
                                    <Zap size={12} className="text-slate-400" />
                                </div>
                            </div>

                            {/* Content - High Density */}
                            <div className="relative z-10 flex-1">
                                <h3 className="text-[12px] font-black text-slate-800 tracking-tight leading-none mb-1">{opt.title}</h3>
                                <p className="text-[8.5px] font-bold text-slate-500 leading-tight tracking-tight line-clamp-2">
                                    {opt.subtitle}
                                </p>
                            </div>

                            {/* Bottom Row - Integrated Action */}
                            <div className="flex items-center justify-between mt-2.5 relative z-10">
                                <div className={`${theme.pill} px-1.5 py-0.5 rounded-full border border-white/20`}>
                                    <span className="text-[6.5px] font-black uppercase tracking-wider">{opt.locked ? 'Coming Soon' : 'Active'}</span>
                                </div>
                                <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                                    <ChevronRight size={10} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm relative overflow-hidden group mb-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0 border border-sky-100">
                    <Briefcase size={20} className="text-sky-500" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">{projectsData.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 leading-tight mt-1">
                        {projectsData.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Income;

