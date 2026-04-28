import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PaymentModal from '../components/PaymentModal';
import {
    Share2, TrendingUp, CheckSquare, Trophy, Briefcase,
    Sparkles, ChevronRight, Lock, Loader2, ShieldCheck, Zap,
    UploadCloud, Fingerprint, Image as ImageIcon, CheckCircle2, Clock
} from 'lucide-react';
import { contentStorage } from '../../shared/services/contentStorage';

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
            addNotification("Error", err, "error");
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
        return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-sky-500" /></div>;
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

            {/* Main Referral Highlight Card (Full Width) */}
            <div
                onClick={() => handleCardClick(INCOME_OPTIONS[0].route)}
                className="w-full p-4 rounded-[1.25rem] bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-400 shadow-xl shadow-blue-100 flex flex-col relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
            >
                {/* Abstract Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/30">
                        <Share2 size={20} className="text-white" />
                    </div>
                    <div className="bg-black/10 backdrop-blur rounded-full px-3 py-1 border border-white/20">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest animate-pulse">Hot Deal</span>
                    </div>
                </div>

                <div className="mt-6 relative z-10">
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">{INCOME_OPTIONS[0].title}</h3>
                    <p className="text-[10px] font-bold text-white/80 mt-1 uppercase tracking-wide">{INCOME_OPTIONS[0].subtitle}</p>
                </div>

                <button className="mt-4 w-full bg-white text-blue-600 font-black text-[11px] py-3.5 rounded-xl uppercase tracking-[0.15em] shadow-lg shadow-black/5 active:bg-blue-50 transition-colors">
                    {INCOME_OPTIONS[0].cta}
                </button>
            </div>

            {/* 5-Card Grid (Other Features) */}
            <div className="grid grid-cols-2 gap-3">
                {INCOME_OPTIONS.slice(1).map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <div
                            key={opt.id}
                            onClick={() => handleCardClick(opt.route)}
                            className={`${opt.bg} border ${opt.borderColor || 'border-slate-100'} rounded-[1.25rem] p-4 flex flex-col items-center text-center shadow-md shadow-slate-100/30 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            {/* Centered Top Icon */}
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-black/[0.03] group-hover:scale-110 transition-transform">
                                <Icon size={18} className="text-slate-800" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center mb-3">
                                <h3 className="text-[11px] font-black text-slate-800 leading-tight mb-1">{opt.title}</h3>
                                <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-tight line-clamp-2">
                                    {opt.subtitle}
                                </p>
                            </div>

                            {/* Progress Bar for Future Fund */}
                            {opt.hasProgress && (
                                <div className="w-full h-1 bg-indigo-100 rounded-full mb-3 overflow-hidden">
                                    <div className="w-[45%] h-full bg-indigo-500 rounded-full animate-pulse shadow-sm"></div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button className={`w-full ${opt.locked ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-black text-white shadow-md shadow-slate-200'} text-[9px] font-bold py-2.5 rounded-xl uppercase tracking-widest relative z-10 transition-all active:scale-95`}>
                                {opt.locked ? 'Coming Soon' : opt.cta}
                            </button>
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

