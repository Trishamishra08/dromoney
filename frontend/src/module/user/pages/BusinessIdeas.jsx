import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
    Briefcase, ChevronLeft, Sparkles, Star, 
    Gift, ArrowRight, CheckCircle2, TrendingUp,
    Rocket, Zap, Lock, Trophy, Shield, 
    Users, ClipboardList, CreditCard, Copy,
    ExternalLink, Loader2
} from 'lucide-react';
import api from '../../shared/services/api';
import PaymentModal from '../components/PaymentModal';

// Icon Map for dynamic rendering - using only confirmed working icons
const ICON_MAP = {
    TrendingUp, Rocket, Zap, Trophy,
    Sparkles, Gift, Shield, Users, 
    Briefcase, ClipboardList, CreditCard
};

const BusinessIdeas = () => {
    const navigate = useNavigate();
    const { userData, refreshUserProfile } = useUser();
    const [activeTab, setActiveTab] = useState('free');
    const [viewIdea, setViewIdea] = useState(null);
    const [showPayment, setShowPayment] = useState(null);
    const [allIdeas, setAllIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const res = await api.get('/public/business-ideas');
            if (res.success) {
                setAllIdeas(res.data);
            }
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };
    const freeIdeas = allIdeas.filter(i => i.type === 'Free');
    const premiumIdeas = allIdeas.filter(i => i.type === 'Premium');

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

    const renderIcon = (iconName, size = 28) => {
        const IconComponent = ICON_MAP[iconName] || Briefcase;
        return <IconComponent size={size} />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Loading Strategies...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] animate-in fade-in duration-500 pb-6 text-slate-900">
            {/* Header Section */}
            <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-slate-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 active:scale-90 transition-all border border-slate-100"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Business Hub</h2>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Start Your Journey Today</p>
                </div>
                <div className="w-10 h-10"></div>
            </div>

            <div className="px-2 mt-3">
                {/* Visual Tab Switcher */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <button 
                        onClick={() => setActiveTab('free')}
                        className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${activeTab === 'free' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Gift size={14} />
                        Free Ideas
                    </button>
                    <button 
                        onClick={() => setActiveTab('premium')}
                        className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${activeTab === 'premium' ? 'bg-[#1A1C30] text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Lock size={14} />
                        Premium Ideas
                    </button>
                </div>

                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'free' ? (
                        freeIdeas.map((idea) => (
                            <div key={idea._id} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="flex items-start gap-3">
                                    <div className={`w-14 h-14 ${idea.bg || 'bg-emerald-50'} rounded-2xl flex items-center justify-center ${idea.color || 'text-emerald-500'} shadow-sm border border-black/5`}>
                                        {renderIcon(idea.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-bold text-slate-900">{idea.title}</h3>
                                            <div className="bg-emerald-100/50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Active</span>
                                            </div>
                                        </div>
                                        <p className="text-[12px] font-medium text-slate-400 mt-1 line-clamp-2">{idea.desc}</p>
                                        
                                        <div className="mt-4 flex items-center justify-between bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-100/50">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Earning Potential</p>
                                                <p className="text-[13px] font-bold text-emerald-600">{idea.potential}</p>
                                            </div>
                                            <button 
                                                onClick={() => setViewIdea(idea)}
                                                className="bg-white text-slate-900 p-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-6">
                            {/* Premium Banner */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-7 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Premium Exclusive</span>
                                </div>
                                <h3 className="text-xl font-bold leading-snug">Upgrade to Access High-Ticket Frameworks</h3>
                                <p className="text-[12px] font-medium text-indigo-100 mt-2 opacity-80 leading-relaxed">
                                    Our premium members get access to pre-built business models and 1-on-1 mentorship sessions.
                                </p>
                            </div>

                            {premiumIdeas.map((idea) => {
                                return (
                                    <div key={idea._id} className={`bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm relative overflow-hidden group ${idea.isLocked ? 'opacity-90' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-14 h-14 ${idea.bg || 'bg-indigo-50'} rounded-2xl flex items-center justify-center ${idea.color || 'text-indigo-500'} border border-black/5 shadow-sm`}>
                                                {renderIcon(idea.icon)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-base font-bold text-slate-900">{idea.title}</h3>
                                                    {idea.isLocked && (
                                                        <div className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                                                            <Lock size={10} className="text-slate-400" />
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[12px] font-medium text-slate-400 mt-1">{idea.desc}</p>
                                                
                                                <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${!idea.isLocked ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-slate-50 border-slate-100'}`}>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Earning Potential</p>
                                                        <p className={`text-[13px] font-bold ${!idea.isLocked ? 'text-indigo-600' : 'text-slate-400'}`}>{idea.potential}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => !idea.isLocked ? setViewIdea(idea) : setShowPayment(idea)}
                                                        className={`p-2 rounded-xl border shadow-sm active:scale-90 transition-all flex items-center justify-center
                                                            ${!idea.isLocked ? 'bg-white text-indigo-600 border-indigo-100' : 'bg-[#1A1C30] text-white border-transparent'}`}
                                                    >
                                                        {idea.isLocked ? <Lock size={16} /> : <ArrowRight size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Razorpay Payment Modal */}
            <PaymentModal 
                isOpen={!!showPayment}
                onClose={() => setShowPayment(null)}
                plan={showPayment?.title}
                amount={showPayment?.price || 50}
                type="BUSINESS_IDEA_UNLOCK"
                itemId={showPayment?._id}
                onSuccess={() => {
                    fetchIdeas();
                    setShowPayment(null);
                }}
            />

            {/* Idea Detail Overlay */}
            {viewIdea && (
                <div className="fixed inset-0 z-[60] flex flex-col bg-white animate-in slide-in-from-bottom duration-500 pb-10">
                    <div className="p-6 relative overflow-hidden bg-slate-900 text-white">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            {renderIcon(viewIdea.icon, 150)}
                        </div>
                        <button 
                            onClick={() => setViewIdea(null)}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-6 active:scale-95 transition-all relative z-10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="relative z-10">
                            <h1 className="text-2xl font-black tracking-tight uppercase">{viewIdea.title}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Success Roadmap</p>
                                <div className="w-1 h-1 rounded-full bg-white/30"></div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{viewIdea.potential}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-white rounded-t-[2.5rem] -mt-6 relative z-10 shadow-2xl">
                        <div className="space-y-6">
                            {viewIdea.steps?.map((step, idx) => (
                                <div key={idx} className="flex gap-5 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[12px] shadow-lg shadow-slate-200 shrink-0">
                                            {idx + 1}
                                        </div>
                                        {idx !== viewIdea.steps.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-2"></div>}
                                    </div>
                                    <div className="pb-4">
                                        <h3 className="text-[15px] font-black text-slate-800 mb-1 leading-none">{step.title}</h3>
                                        <p className="text-[12px] font-bold text-slate-400 leading-relaxed italic">{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* YouTube Tutorial Section */}
                        {viewIdea.youtubeLink && (
                            <div className="mt-8 space-y-4">
                                <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] ml-1">Video Tutorial</h3>
                                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm shrink-0">
                                            <ExternalLink size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-800 tracking-tight">Watch Guide</p>
                                            <p className="text-[11px] font-bold text-slate-500/80 leading-tight line-clamp-1 max-w-[150px]">
                                                {viewIdea.youtubeLink}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(viewIdea.youtubeLink)}
                                        className="bg-white text-slate-900 border border-slate-200 p-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <Copy size={14} /> Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[13px] font-black text-slate-800 tracking-tight">Strategy Unlocked</p>
                                <p className="text-[11px] font-bold text-slate-500/80 leading-tight">Start working on these steps to see real growth.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setViewIdea(null)}
                            className="w-full bg-[#1A1C30] text-white py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 mt-10 active:scale-95 transition-all"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Info Banner */}
            <div className="px-2 mt-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-slate-800 tracking-tight">Verified Strategies</p>
                        <p className="text-[11px] font-medium text-slate-400 leading-tight">All ideas are tested by our expert team for success.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessIdeas;
