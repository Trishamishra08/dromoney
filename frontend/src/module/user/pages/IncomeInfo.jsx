import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Share2, CheckSquare, TrendingUp, Trophy, 
    Sparkles, IndianRupee, Zap, ShieldCheck, Clock
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../../shared/services/api';
import PaymentModal from '../components/PaymentModal';

const IncomeInfo = () => {
    const navigate = useNavigate();
    const { userData, addNotification, refreshUserProfile } = useUser();
    const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: '', amount: 0 });

    // --- Dynamic Content State ---
    const [sections, setSections] = useState({
        menu_layout_refer: { headline: 'EARN ₹200 REWARD', steps: [] },
        menu_layout_tasks: { headline: 'COLLECT REWARD COINS', steps: [] },
        menu_layout_fund: { headline: 'PASSIVE INCOME SECURITY', steps: [] },
        menu_layout_events: { headline: 'WIN BIG PRIZES', steps: [] }
    });

    const fetchSections = async () => {
        const keys = ['menu_layout_refer', 'menu_layout_tasks', 'menu_layout_fund', 'menu_layout_events'];
        try {
            const res = await api.get(`/public/content/bulk?keys=${keys.join(',')}`);
            if (res.success && res.data) {
                const updated = {};
                keys.forEach(key => {
                    const item = res.data[key];
                    if (item && item.data) {
                        updated[key] = {
                            title: item.title,
                            headline: item.data.headline,
                            steps: item.data.steps || []
                        };
                    }
                });
                setSections(prev => ({ ...prev, ...updated }));
            }
        } catch (err) {
            console.error("Error fetching info sections:", err);
        }
    };

    // --- Auto Scroll Logic & Initial Fetch ---
    useEffect(() => {
        fetchSections();
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500);
            }
        }
    }, [window.location.hash]);

    const handleProtectedAction = (path) => {
        if (!userData.isPaid) {
            addNotification("Access Denied", "Please firstly take the 499 plan then access will be granted.", "error");
            setPaymentModal({ isOpen: true, plan: 'Lifetime Access Plan', amount: 499 });
            return;
        }
        navigate(path);
    };

    const onPaymentSuccess = async () => {
        await refreshUserProfile();
        setPaymentModal({ ...paymentModal, isOpen: false });
        addNotification("Success!", "Lifetime Access Activated.", "success");
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 animate-in fade-in duration-700 pb-4">
            {/* Immersive Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 active:scale-95 transition-all border border-slate-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Information Center</h1>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Guide to Earning Systems</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                
                {/* 1. REFERRAL SYSTEM */}
                <section id="refer" className="scroll-mt-24">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm shadow-blue-50">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none italic">{sections.menu_layout_refer.title || 'Referral System'}</h3>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{sections.menu_layout_refer.headline}</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-4">
                                {(sections.menu_layout_refer.steps.length > 0 ? sections.menu_layout_refer.steps : [
                                    { title: "Share Your Link", desc: "अपना referral link दोस्तों के साथ share करें।" },
                                    { title: "Earn ₹200 Instant", desc: "हर सफल registration पर आपको ₹200 का instant reward मिलेगा।" },
                                    { title: "Direct Wallet Credit", desc: "आपका reward amount सीधे आपके wallet में add कर दिया जायेगा जिसे आप withdraw कर सकते हैं।" }
                                ]).map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] border border-blue-100 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-800 leading-none mb-1.5 uppercase tracking-tight">{step.title}</h4>
                                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => handleProtectedAction('/user/marketing')}
                                className="w-full mt-2 bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Get Referral Link <ChevronLeft size={14} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 2. DAILY TASKS */}
                <section id="task" className="scroll-mt-24">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-50">
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none italic">{sections.menu_layout_tasks.title || 'Daily Tasks'}</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{sections.menu_layout_tasks.headline}</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-4">
                                {(sections.menu_layout_tasks.steps.length > 0 ? sections.menu_layout_tasks.steps : [
                                    { title: "Complete Tasks", desc: "रोजाना simple tasks को पूरा करें और reward coins earn करें।" },
                                    { title: "Redeem for Cash", desc: "इन coins को आप बाद में real cash में convert kar sakte hain।" },
                                    { title: "3X Booster Benefit", desc: "Booster active karke aap apni coin earnings ko 3X tak badha sakte hain।" }
                                ]).map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-[10px] border border-emerald-100 shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-800 leading-none mb-1.5 uppercase tracking-tight">{step.title}</h4>
                                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => handleProtectedAction('/user/earn')}
                                className="w-full mt-2 bg-emerald-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                View Tasks <Sparkles size={14} className="animate-pulse" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. FUTURE FUND */}
                <section id="fund" className="scroll-mt-24">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm shadow-sky-50">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none italic">{sections.menu_layout_fund.title || 'Future Fund'}</h3>
                                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1">{sections.menu_layout_fund.headline}</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-4">
                                {(sections.menu_layout_fund.steps.length > 0 ? sections.menu_layout_fund.steps : [
                                    { title: "Platform Stake", desc: "एक बार eligible होने पर, आपको platform के profits में हिस्सा मिलेगा।" },
                                    { title: "Monthly Payouts", desc: "Profit share har mahine aapke wallet mein auto-credit hoga।." },
                                    { title: "Long Term Growth", desc: "Jaise-jaise platform grow karega, aapki passive income badhti jayegi." }
                                ]).map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-black text-[10px] border border-sky-100 shrink-0 mt-0.5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-800 leading-none mb-1.5 uppercase tracking-tight">{step.title}</h4>
                                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => handleProtectedAction('/user/future-fund')}
                                className="w-full mt-2 bg-sky-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-sky-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Check Eligibility <ShieldCheck size={14} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 4. EVENTS & CONTESTS */}
                <section id="events" className="scroll-mt-24">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm shadow-indigo-50">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none italic">{sections.menu_layout_events.title || 'Events & Contests'}</h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{sections.menu_layout_events.headline}</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-4">
                                {(sections.menu_layout_events.steps.length > 0 ? sections.menu_layout_events.steps : [
                                    { title: "Weekly Contests", desc: "हर हफ्ते नए Exciting Events live होते हैं, jo limited time ke liye hote hain।" },
                                    { title: "Mega Jackpots", desc: "Contests mein bhag lekar aap ₹500 tak ka instant cash aur exciting prizes जीत सकते हैं।" },
                                    { title: "Leaderboard Rewards", desc: "Top earners ko special bonuses aur verification badges diye jaate hain।" }
                                ]).map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px] border border-indigo-100 shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-800 leading-none mb-1.5 uppercase tracking-tight">{step.title}</h4>
                                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => handleProtectedAction('/user/events')}
                                className="w-full mt-2 bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                View Events <Trophy size={14} className="text-amber-400" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer Quote */}
                <div className="text-center py-2 mt-4">
                    <div className="inline-block w-8 h-1 bg-slate-200 rounded-full mb-3"></div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">Grow Sustainably with Drowmoney</p>
                </div>
            </div>

            {/* Payment Integration */}
            <PaymentModal 
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
                plan={paymentModal.plan}
                amount={paymentModal.amount}
                onSuccess={onPaymentSuccess}
            />
        </div>
    );
};

export default IncomeInfo;
