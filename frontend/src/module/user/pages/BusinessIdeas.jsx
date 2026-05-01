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
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
            {/* Header - Ultra Compact Dark Blue */}
            <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-4 rounded-b-[1.5rem] shadow-lg sticky top-[57px] z-40 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/user/home')}
                            className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">Business Hub</h1>
                            <p className="text-[9px] font-bold text-blue-300 opacity-80 uppercase tracking-widest mt-1">Start Your Journey</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Growth</span>
                    </div>
                </div>

                {/* Info Bar - Slim Version */}
                <div className="mt-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shrink-0">
                        <Briefcase size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[13px] font-black text-white leading-none">Verified Strategies</h2>
                        <p className="text-[8px] font-bold text-blue-100 opacity-60 mt-1">Tested by our expert team.</p>
                    </div>
                </div>
            </div>

            <div className="p-3 space-y-3">
                {/* Visual Tab Switcher - Compact Premium */}
                <div className="bg-slate-200/50 p-1 rounded-2xl flex items-center">
                    <button 
                        onClick={() => setActiveTab('free')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2
                            ${activeTab === 'free' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Gift size={14} />
                        Free
                    </button>
                    <button 
                        onClick={() => setActiveTab('premium')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2
                            ${activeTab === 'premium' ? 'bg-[#1A1C30] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Lock size={14} />
                        Premium
                    </button>
                </div>

                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'free' ? (
                        <div className="space-y-3">
                            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Available Strategies</h2>
                            {freeIdeas.map((idea, idx) => {
                                const THEMES = [
                                    { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-600', text: 'text-emerald-600', iconBg: 'bg-emerald-100', shadow: 'shadow-emerald-100' },
                                    { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-600', text: 'text-indigo-600', iconBg: 'bg-indigo-100', shadow: 'shadow-indigo-100' },
                                    { bg: 'bg-amber-50', border: 'border-amber-100', accent: 'bg-amber-600', text: 'text-amber-600', iconBg: 'bg-amber-100', shadow: 'shadow-amber-100' },
                                    { bg: 'bg-rose-50', border: 'border-rose-100', accent: 'bg-rose-600', text: 'text-rose-600', iconBg: 'bg-rose-100', shadow: 'shadow-rose-100' },
                                ];
                                const theme = THEMES[idx % THEMES.length];

                                return (
                                    <div key={idea._id} className={`${theme.bg} border ${theme.border} rounded-2xl p-4 shadow-sm relative overflow-hidden group`}>
                                        <div className={`absolute -right-6 -top-6 w-20 h-20 ${theme.accent} opacity-[0.03] rounded-full`}></div>
                                        
                                        <div className="flex justify-between items-start mb-3 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 ${theme.iconBg} rounded-xl flex items-center justify-center ${theme.text} shadow-inner`}>
                                                    {renderIcon(idea.icon, 24)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="text-[15px] font-black text-slate-800 leading-none tracking-tight">{idea.title}</h3>
                                                    <span className={`inline-block text-[8px] font-black ${theme.text} uppercase tracking-widest`}>Free Access</span>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-500 px-2 py-0.5 rounded-lg">
                                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>

                                        <p className="text-[11px] font-bold text-slate-400 mt-1 line-clamp-2 leading-relaxed">{idea.desc}</p>
                                        
                                        <div className="mt-4 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80 relative z-10">
                                            <div>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Earning Potential</p>
                                                <p className={`text-[13px] font-black ${theme.text} tracking-tight`}>{idea.potential}</p>
                                            </div>
                                            <button 
                                                onClick={() => setViewIdea(idea)}
                                                className={`${theme.accent} text-white p-2.5 rounded-xl shadow-lg ${theme.shadow} active:scale-95 transition-all`}
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Premium Banner - Ultra Premium */}
                            <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 rounded-[1.5rem] p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                        <Sparkles size={20} className="text-amber-300" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Premium Vault</span>
                                </div>
                                <h3 className="text-lg font-black leading-tight tracking-tight">High-Ticket Frameworks</h3>
                                <p className="text-[11px] font-bold text-indigo-100/70 mt-2 leading-relaxed">
                                    Access pre-built business models and 1-on-1 expert mentorship.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Exclusive Vault</h2>
                                {premiumIdeas.map((idea, idx) => {
                                    const THEMES = [
                                        { bg: 'bg-slate-900', border: 'border-slate-800', accent: 'bg-indigo-500', text: 'text-white', subText: 'text-slate-400', glass: 'bg-white/5 border-white/10' },
                                        { bg: 'bg-white', border: 'border-slate-100', accent: 'bg-[#1A1C30]', text: 'text-slate-800', subText: 'text-slate-400', glass: 'bg-slate-50 border-slate-100' }
                                    ];
                                    const theme = THEMES[idx % THEMES.length];

                                    return (
                                        <div key={idea._id} className={`${theme.bg} border ${theme.border} rounded-2xl p-4 shadow-sm relative overflow-hidden group`}>
                                            <div className="flex justify-between items-start mb-3 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                        {renderIcon(idea.icon, 24)}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h3 className={`text-[15px] font-black ${theme.text} leading-none tracking-tight`}>{idea.title}</h3>
                                                        <span className={`inline-block text-[8px] font-black ${theme.subText} uppercase tracking-widest`}>Premium</span>
                                                    </div>
                                                </div>
                                                {idea.isLocked && (
                                                    <div className="bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 flex items-center gap-1">
                                                        <Lock size={10} className="text-amber-500" />
                                                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Locked</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className={`text-[11px] font-bold ${theme.subText} mt-1 line-clamp-2 leading-relaxed`}>{idea.desc}</p>
                                            
                                            <div className={`mt-4 flex items-center justify-between rounded-xl p-3 border ${theme.glass} relative z-10`}>
                                                <div>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">Earning Potential</p>
                                                    <p className={`text-[13px] font-black ${idea.isLocked ? 'text-slate-400' : 'text-indigo-500'} tracking-tight`}>{idea.potential}</p>
                                                </div>
                                                <button 
                                                    onClick={() => !idea.isLocked ? setViewIdea(idea) : setShowPayment(idea)}
                                                    className={`${theme.accent} text-white p-2.5 rounded-xl shadow-lg active:scale-95 transition-all`}
                                                >
                                                    {idea.isLocked ? <Lock size={16} /> : <ArrowRight size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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

            {/* Idea Detail Overlay - Refined Premium */}
            {viewIdea && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in slide-in-from-bottom duration-500">
                    <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-6 pt-12 relative overflow-hidden text-white shrink-0">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>
                        
                        <button 
                            onClick={() => setViewIdea(null)}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 mb-6 active:scale-95 transition-all relative z-10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-2 block">Strategy Unlocked</span>
                            <h1 className="text-2xl font-black tracking-tight leading-none uppercase">{viewIdea.title}</h1>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="bg-emerald-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-950/20">
                                    <TrendingUp size={12} className="text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{viewIdea.potential}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8 bg-[#F8FAFC] rounded-t-[2rem] -mt-6 relative z-10 shadow-2xl">
                        <div className="space-y-1">
                            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 mb-4">Success Roadmap</h2>
                            <div className="space-y-4">
                                {viewIdea.steps?.map((step, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex gap-4 group">
                                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[12px] shadow-lg shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[14px] font-black text-slate-800 leading-tight">{step.title}</h3>
                                            <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* YouTube Tutorial Section */}
                        {viewIdea.youtubeLink && (
                            <div className="space-y-3">
                                <h2 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.25em] ml-1">Video Tutorial</h2>
                                <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shadow-inner">
                                            <ExternalLink size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-800 tracking-tight leading-none mb-1">Watch Guide</p>
                                            <p className="text-[10px] font-bold text-slate-400 truncate max-w-[140px] uppercase tracking-wider">YouTube Tutorial</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            copyToClipboard(viewIdea.youtubeLink);
                                            window.open(viewIdea.youtubeLink, '_blank');
                                        }}
                                        className="bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-rose-200 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Watch
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-emerald-100">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[13px] font-black text-slate-800 tracking-tight leading-none">Ready to Start?</p>
                                <p className="text-[10px] font-bold text-emerald-600/80 leading-tight uppercase tracking-wider">Execute steps for growth.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setViewIdea(null)}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 mt-4 active:scale-95 transition-all"
                        >
                            Got it
                        </button>
                        <div className="h-10"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessIdeas;
