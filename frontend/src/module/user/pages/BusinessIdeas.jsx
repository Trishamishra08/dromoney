import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Rocket, ChevronLeft, ArrowRight, 
    Sparkles, Briefcase, MessageSquare,
    Play, TrendingUp, Copy, Users,
    Crown, ShieldCheck, Zap, Star, Video
} from 'lucide-react';
import api from '../../shared/services/api';
import UniversalVideoPlayer from '../../shared/components/UniversalVideoPlayer';
import { useUser } from '../context/UserContext';
import PaymentModal from '../components/PaymentModal';

const BusinessIdeas = () => {
    const navigate = useNavigate();
    const { ideaId, section, cardId } = useParams();
    const { userData } = useUser();

    const isSubscribed = userData?.supportExpiry && new Date(userData.supportExpiry) > new Date();

    // Derive step from URL
    const getStepFromUrl = () => {
        if (!ideaId) return -1;           // Intro
        if (ideaId === 'all') return 0;   // Listing
        if (section === 'ecosystem' && cardId) return 4;
        if (section === 'ecosystem') return 3;
        if (section === 'subscription') return 2;
        return 1;                         // idea detail
    };

    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedEcoCard, setSelectedEcoCard] = useState(null);
    const [settings, setSettings] = useState({ businessPlans: [] });

    const step = getStepFromUrl();

    useEffect(() => {
        fetchIdeas();
        fetchSettings();
    }, []);

    // When ideas load and ideaId is in URL, auto-select the idea
    useEffect(() => {
        if (ideaId && ideas.length > 0) {
            const found = ideas.find(i => i._id === ideaId);
            if (found) {
                setSelectedIdea(found);
                // Restore eco card from cardId if present
                if (cardId && found.ecosystemCards) {
                    const ecoColors = [
                        { color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
                        { color: 'text-indigo-500',  bg: 'bg-indigo-50',  ring: 'ring-indigo-200' },
                        { color: 'text-blue-500',    bg: 'bg-blue-50',    ring: 'ring-blue-200' },
                        { color: 'text-amber-500',   bg: 'bg-amber-50',   ring: 'ring-amber-200' }
                    ];
                    const cardIdx = found.ecosystemCards.findIndex(c => c.id === cardId);
                    if (cardIdx !== -1) {
                        setSelectedEcoCard({ ...found.ecosystemCards[cardIdx], colorStyle: ecoColors[cardIdx % 4] });
                    }
                }
            }
        }
    }, [ideaId, cardId, ideas]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/public/settings');
            if (res.success) setSettings({ businessPlans: res.data.businessPlans || [] });
        } catch (err) { console.error('Settings fetch error:', err); }
    };

    const fetchIdeas = async () => {
        try {
            const res = await api.get('/public/business-ideas');
            if (res.success) setIdeas(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleIdeaSelect = (idea) => {
        setSelectedIdea(idea);
        setIsPlaying(false);
        navigate(`/user/business-ideas/${idea._id}`);
    };

    const getTimeRemaining = (expiryDate) => {
        if (!expiryDate) return null;
        const diff = new Date(expiryDate) - new Date();
        if (diff <= 0) return null;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return { days, hours };
    };

    const timeRem = getTimeRemaining(userData?.supportExpiry);

    // --- SCREEN -1: INTRO (Premium Rocket Welcome) ---
    const IntroScreen = () => (
        <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center p-6">
            <style>
                {`
                @keyframes boost {
                    0%, 100% { transform: translate(0, 0) rotate(-45deg); }
                    25% { transform: translate(2px, -2px) rotate(-44deg); }
                    50% { transform: translate(-1px, -4px) rotate(-46deg); }
                    75% { transform: translate(1px, -2px) rotate(-45deg); }
                }
                @keyframes puff {
                    0% { transform: scale(0.8) translate(0, 0); opacity: 0; }
                    50% { transform: scale(1.2) translate(10px, 10px); opacity: 0.5; }
                    100% { transform: scale(1.5) translate(20px, 20px); opacity: 0; }
                }
                .animate-boost {
                    animation: boost 0.5s ease-in-out infinite;
                }
                .animate-puff {
                    animation: puff 0.8s ease-out infinite;
                }
                `}
            </style>
            <div className="absolute top-8 left-6 z-50">
                <button onClick={() => navigate('/user/home')} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 active:scale-90 transition-all">
                    <ChevronLeft size={22} />
                </button>
            </div>
            <div className="w-full max-w-sm flex flex-col items-center gap-8">
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-[#5D38F0] via-[#7C5DFF] to-[#A855F7] rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(93,56,240,0.3)] flex flex-col items-center justify-center p-10 relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFE03D]/10 rounded-full -ml-20 -mb-20 blur-3xl" />
                    
                    <div className="text-center space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Star size={14} className="text-[#FFE03D]" fill="#FFE03D" />
                            <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.3em]">महीने की कमाई</p>
                            <Star size={14} className="text-[#FFE03D]" fill="#FFE03D" />
                        </div>
                        <p className="text-[38px] font-black text-white leading-none drop-shadow-lg">
                            ₹50k - <span className="text-[#FFE03D]">₹{selectedIdea?.potentialEarnings || '1 Lakh'}</span>
                        </p>
                    </div>

                    <div className="my-10 relative z-10">
                        {/* Boost Glow */}
                        <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-150 animate-pulse" />
                        
                        <div className="animate-boost relative">
                            {/* White Splash / Smoke Puffs */}
                            <div className="absolute -bottom-8 -right-8 z-0 flex gap-1">
                                <div className="animate-puff w-8 h-8 bg-white/40 rounded-full blur-md" style={{ animationDelay: '0s' }} />
                                <div className="animate-puff w-10 h-10 bg-white/20 rounded-full blur-lg" style={{ animationDelay: '0.2s' }} />
                                <div className="animate-puff w-6 h-6 bg-white/30 rounded-full blur-sm" style={{ animationDelay: '0.4s' }} />
                            </div>

                            <Rocket size={150} className="text-white drop-shadow-[0_20px_20px_rgba(255,255,255,0.3)] relative z-10" fill="white" fillOpacity={0.2} />
                        </div>
                    </div>

                    <div className="text-center space-y-2 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl">
                            <p className="text-[14px] font-black text-[#00FF94] leading-tight uppercase tracking-widest">बहुत कम इन्वेस्टमेंट से</p>
                        </div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-2">Start Your Own Brand Today</p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/user/business-ideas/all')}
                    className="w-full bg-[#5D38F0] hover:bg-[#4C2CD9] text-white font-black text-[16px] py-5 rounded-[2.5rem] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest border-b-4 border-indigo-800"
                >
                    LET'S START <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );

    // --- SCREEN 0: PREMIUM CARDS LISTING ---
    const ListingScreen = () => (
        <div className="min-h-screen bg-[#F8FAFF] pb-10">
            <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-indigo-50/50 rounded-b-[2.5rem]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/user/business-ideas')} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-slate-100">
                        <ChevronLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Business Hub</h1>
                        <p className="text-[10px] font-bold text-[#5D38F0] uppercase tracking-widest">Explore Opportunities</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-12 h-12 border-4 border-[#5D38F0] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Searching Best Ideas...</p>
                    </div>
                ) : (
                    ideas.map((idea) => (
                        <div 
                            key={idea._id}
                            onClick={() => handleIdeaSelect(idea)}
                            className="bg-white rounded-[2.5rem] p-5 flex flex-col gap-4 shadow-[0_15px_30px_-10px_rgba(93,56,240,0.1)] border border-slate-50 group hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-8 -mt-8" />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#5D38F0] to-[#8643FF] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                    {idea.bannerImage ? (
                                        <img src={idea.bannerImage} className="w-full h-full object-cover relative z-10" alt="" />
                                    ) : (
                                        <Rocket size={32} className="text-white -rotate-45 relative z-10 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" fill="white" fillOpacity={0.2} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {(idea.badges && idea.badges.length > 0 ? idea.badges : ['Trending']).map((badge, idx) => (
                                            <span key={idx} className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${idx % 2 === 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-[#5D38F0]'}`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-[17px] font-black text-slate-900 leading-tight truncate">{idea.title}</h3>
                                    <p className="text-[11px] text-[#5D38F0] font-black mt-1 line-clamp-1 uppercase tracking-tight">₹{idea.potentialEarnings || "50,000"}+ Potential Monthly</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2 relative z-10">
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-[70%] line-clamp-2">
                                    {idea.desc || "विशेषज्ञ मार्गदर्शन के साथ अपनी व्यावसायिक यात्रा शुरू करें..."}
                                </p>
                                <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#5D38F0] group-hover:bg-[#5D38F0] group-hover:text-white transition-all shadow-sm">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    // --- SCREEN 1: START JOURNEY (Business Details) ---
    const DetailsScreen = () => (
        <div className="min-h-screen bg-white pb-40">
            <div className="px-6 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-40">
                <button onClick={() => navigate('/user/business-ideas/all')} className="w-10 h-10 flex items-center justify-center text-slate-900">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-black text-slate-900">Start Journey</h1>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 border-2 border-slate-100 rounded-full">
                    <span className="font-bold text-sm">?</span>
                </button>
            </div>
            <div className="px-6 py-6 flex items-center justify-center">
                <div className="flex items-center w-full max-w-sm relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 w-1/4 h-0.5 bg-[#5D38F0] -translate-y-1/2 z-0"></div>
                    {[
                        { num: 1, label: 'Idea', active: true },
                        { num: 2, label: 'Upgrade', active: false },
                        { num: 3, label: 'Ecosystem', active: false },
                        { num: 4, label: 'Finish', active: false }
                    ].map((s, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${s.active ? 'bg-[#5D38F0] text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>{s.num}</div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${s.active ? 'text-[#5D38F0]' : 'text-slate-300'}`}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-6 mt-4">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-100 shrink-0">
                        {selectedIdea?.bannerImage ? <img src={selectedIdea.bannerImage} className="w-full h-full object-cover" alt="icon" /> : <Rocket size={36} className="text-[#5D38F0]" />}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-[#1E293B] leading-tight">{selectedIdea?.hindiTitle || "बिजनेस आइडिया"}</h2>
                        <p className="text-base font-bold text-slate-500 mt-1">{selectedIdea?.title}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 leading-snug">कम निवेश में शुरू करें और हर महीने ₹{selectedIdea?.potentialEarnings || "50,000"} तक कमाएं।</p>
                    </div>
                </div>
            </div>
            <div className="px-6 mt-10 space-y-6">
                <h3 className="text-lg font-black text-slate-900">बिजनेस डिटेल्स</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3"><Sparkles size={24} /></div>
                        <h4 className="text-[10px] font-black text-slate-900 leading-tight">कैसे करें<br/>(How it work 🤔)</h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-2">स्टेप बाय स्टेप प्रोसेस से समझें।</p>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3"><Briefcase size={24} /></div>
                        <h4 className="text-[10px] font-black text-slate-900 leading-tight">इन्वेस्टमेंट<br/>(खर्च)</h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-2">शुरुआत करने में कुल कितना खर्च आएगा।</p>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3"><TrendingUp size={24} /></div>
                        <h4 className="text-[10px] font-black text-slate-900 leading-tight">प्रॉफिट</h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-2">आपकी कमाई कितनी होगी जानें।</p>
                    </div>
                </div>
            </div>
            
            <div className="px-6 mt-10 space-y-4">
                <h3 className="text-lg font-black text-slate-900">सपोर्ट वीडियो</h3>
                <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white" onClick={() => setIsPlaying(!isPlaying)}>
                    {selectedIdea?.videoUrl ? (
                        <UniversalVideoPlayer 
                            url={selectedIdea.videoUrl} 
                            className="w-full h-full object-cover"
                            autoPlay={false}
                            playing={isPlaying}
                            controls={true}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-800">
                            <Video size={48} className="text-white/20" />
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Video Not Available</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-6 mt-6 bg-[#EEF2FF] rounded-2xl p-4 flex items-center gap-4 shadow-sm shadow-indigo-100">
                <Sparkles size={20} className="text-[#5D38F0]" fill="currentColor" />
                <p className="text-[11px] font-black text-[#5D38F0]">यह एक लो इन्वेस्टमेंट हाई प्रॉफिट बिजनेस आइडिया है।</p>
            </div>

            <div className="fixed bottom-24 left-6 right-6 z-50 max-w-sm mx-auto">
                <button 
                    onClick={() => navigate(`/user/business-ideas/${ideaId}/subscription`)} 
                    className="w-full bg-[#5D38F0] hover:bg-[#4C2CD9] text-white font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest border border-white/20"
                >
                    Next <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );

    // --- SCREEN 2: SUBSCRIPTION ---
    const SubscriptionScreen = () => (
        <div className="min-h-screen bg-[#F8FAFF] pb-40">
            <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-40 bg-[#F8FAFF]/80 backdrop-blur-md">
                <button onClick={() => navigate(`/user/business-ideas/${ideaId}`)} className="w-10 h-10 flex items-center justify-center text-slate-900 bg-white rounded-xl shadow-sm"><ChevronLeft size={24} /></button>
                <h1 className="text-lg font-black text-slate-900">Unlock Premium</h1>
                <div className="w-10" />
            </div>

            {settings.businessPlans.length > 1 && (
                <div className="px-6 mt-4 overflow-x-auto flex gap-3 pb-2" style={{ scrollbarWidth: 'none' }}>
                    {settings.businessPlans.map((plan, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedPlanIdx(idx)}
                            className={`shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedPlanIdx === idx ? 'bg-[#5D38F0] text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100'}`}
                        >
                            {plan.title.split(' ')[0]} {plan.duration.replace('/ ', '')}
                        </button>
                    ))}
                </div>
            )}

            <div className="px-6 mt-8">
                {settings.businessPlans.length > 0 ? (
                    <div className="bg-gradient-to-br from-[#5D38F0] to-[#8643FF] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <Crown size={32} className="text-[#FFE03D] mb-6" fill="#FFE03D" fillOpacity={0.4} />
                        <h2 className="text-3xl font-black mb-2">{settings.businessPlans[selectedPlanIdx]?.title}</h2>
                        <p className="text-white/80 font-bold text-sm">{settings.businessPlans[selectedPlanIdx]?.subtitle}</p>
                        <div className="mt-8 flex items-baseline gap-2">
                            <span className="text-4xl font-black">₹{settings.businessPlans[selectedPlanIdx]?.price}</span>
                            <span className="text-white/60 font-bold text-sm">{settings.businessPlans[selectedPlanIdx]?.duration}</span>
                        </div>

                        {isSubscribed && timeRem && (
                            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Plan Active Until</p>
                                <p className="text-lg font-black text-white">
                                    {timeRem.days} Days {timeRem.hours} Hours <span className="text-[10px] font-bold text-white/50 lowercase ml-1">remaining</span>
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-indigo-50 rounded-[3rem] p-12 text-center">
                        <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">Loading Premium Plans...</p>
                    </div>
                )}
            </div>

            <div className="px-6 mt-10 space-y-4">
                <h3 className="text-lg font-black text-slate-900 ml-2">Premium Benefits</h3>
                {settings.businessPlans.length > 0 && (settings.businessPlans[selectedPlanIdx]?.benefits?.length > 0 ? settings.businessPlans[selectedPlanIdx].benefits : [
                    { title: '24/7 Expert Support', subtitle: 'Premium Benefit unlocked', iconType: 'support', colorType: 'emerald' },
                    { title: 'Weekly Live Meetings', subtitle: 'Premium Benefit unlocked', iconType: 'meeting', colorType: 'indigo' },
                    { title: 'Daily Strategies', subtitle: 'Premium Benefit unlocked', iconType: 'zap', colorType: 'amber' }
                ]).map((benefit, i) => {
                    const Icon = benefit.iconType === 'meeting' ? Users :
                                 benefit.iconType === 'zap' ? Zap :
                                 benefit.iconType === 'shield' ? ShieldCheck : MessageSquare;
                    const colorClasses = benefit.colorType === 'indigo' ? 'text-indigo-500 bg-indigo-50' :
                                         benefit.colorType === 'amber' ? 'text-amber-500 bg-amber-50' :
                                         benefit.colorType === 'rose' ? 'text-rose-500 bg-rose-50' :
                                         'text-emerald-500 bg-emerald-50';
                    return (
                        <div key={i} className="bg-white rounded-3xl p-5 flex items-start gap-4 border border-slate-50 shadow-sm">
                            <div className={`w-12 h-12 ${colorClasses} rounded-2xl flex items-center justify-center shrink-0`}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-slate-900 leading-tight">{benefit.title}</h4>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{benefit.subtitle}</p>
                            </div>
                            <ShieldCheck size={18} className="ml-auto text-emerald-500" />
                        </div>
                    );
                })}
            </div>
            <div className="fixed bottom-24 left-6 right-6 z-50 max-w-sm mx-auto">
                <button 
                    onClick={() => {
                        if (isSubscribed) {
                            navigate(`/user/business-ideas/${ideaId}/ecosystem`);
                        } else {
                            setShowPaymentModal(true);
                        }
                    }} 
                    className="w-full bg-[#5D38F0] hover:bg-[#4C2CD9] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest border border-white/20"
                >
                    {isSubscribed ? 'Continue to Ecosystem' : 'Unlock Journey'} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );

    // --- SCREEN 3: ECOSYSTEM ---
    const EcosystemScreen = () => {
        // Redirection Guard: If not subscribed, go to subscription
        useEffect(() => {
            if (!isSubscribed) {
                navigate(`/user/business-ideas/${ideaId}/subscription`, { replace: true });
            }
        }, [isSubscribed, ideaId]);

        const ecoColors = [
            { color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
            { color: 'text-indigo-500',  bg: 'bg-indigo-50',  ring: 'ring-indigo-200' },
            { color: 'text-blue-500',    bg: 'bg-blue-50',    ring: 'ring-blue-200' },
            { color: 'text-amber-500',   bg: 'bg-amber-50',   ring: 'ring-amber-200' }
        ];
        const cards = selectedIdea?.ecosystemCards?.length > 0
            ? selectedIdea.ecosystemCards
            : [
                { id: 'daily-plan',    title: 'डेली प्लान' },
                { id: 'new-updates',   title: 'न्यू अपडेट्स' },
                { id: 'tools-contact', title: 'टूल्स एंड कांटेक्ट' },
                { id: 'calculation',   title: 'कैलकुलेशन' }
            ];

        return (
            <div className="min-h-screen bg-white pb-40">
                <div className="px-6 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-40">
                    <button onClick={() => navigate(`/user/business-ideas/${ideaId}/subscription`)} className="w-10 h-10 flex items-center justify-center text-slate-900"><ChevronLeft size={24} /></button>
                    <h1 className="text-lg font-black text-slate-900">Premium Access</h1>
                    <div className="w-10" />
                </div>
                <div className="px-6 py-6 flex items-center justify-center">
                    <div className="flex items-center w-full max-sm relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#5D38F0] -translate-y-1/2"></div>
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                                <div className="w-8 h-8 rounded-full bg-[#5D38F0] text-white flex items-center justify-center font-bold text-xs">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-6 mt-6">
                    <h2 className="text-2xl font-black text-[#1E293B]">अपने बिजनेस को आगे बढ़ाएं</h2>
                    <p className="text-[12px] font-bold text-slate-400">सभी जरूरी जानकारी और सपोर्ट यहां पाएं</p>
                </div>
                <div className="px-6 mt-8 grid grid-cols-2 gap-4">
                    {cards.map((card, i) => {
                        const c = ecoColors[i % ecoColors.length];
                        return (
                            <div
                                key={card.id || i}
                                onClick={() => { setSelectedEcoCard({ ...card, colorStyle: c }); navigate(`/user/business-ideas/${ideaId}/ecosystem/${card.id}`); }}
                                className={`bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm group hover:shadow-xl hover:ring-2 ${c.ring} transition-all cursor-pointer active:scale-95`}
                            >
                                <span className={`text-[10px] font-black ${c.bg} ${c.color} px-2 py-0.5 rounded-lg`}>0{i+1}</span>
                                <h4 className={`text-[13px] font-black ${c.color} mt-4 leading-snug`}>{card.title}</h4>
                                <div className="mt-4 flex justify-end">
                                    <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center ${c.color} group-hover:bg-[#5D38F0] group-hover:text-white transition-all`}>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mx-6 mt-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-sm font-black text-slate-900 mb-2">मीटिंग जॉइन करें</h4>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-slate-500 truncate">{selectedIdea?.meetingLink || "Link not set"}</p>
                        <button 
                            onClick={() => {
                                const link = selectedIdea?.meetingLink;
                                if (!link) return;
                                try {
                                    navigator.clipboard.writeText(link).then(() => {
                                        alert('Link copied!');
                                    }).catch(() => {
                                        // Fallback for older browsers/http
                                        const el = document.createElement('textarea');
                                        el.value = link;
                                        document.body.appendChild(el);
                                        el.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(el);
                                        alert('Link copied!');
                                    });
                                } catch(e) {
                                    alert('Could not copy: ' + link);
                                }
                            }}
                            className="text-indigo-600 hover:text-indigo-800 active:scale-90 transition-all"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            const link = selectedIdea?.meetingLink;
                            if (link) {
                                window.open(link, '_blank', 'noopener,noreferrer');
                            } else {
                                alert('Meeting link not available yet.');
                            }
                        }}
                        className="w-full bg-[#5D38F0] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                        <Play size={16} fill="currentColor" /> जॉइन मीटिंग
                    </button>
                </div>
                <div className="mx-6 mt-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
                    <h4 className="text-sm font-black text-slate-900 mb-2">सपोर्ट चैट</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-4">किसी भी समस्या के लिए हमसे चैट करें।</p>
                    <button onClick={() => navigate('/user/chat-support')} className="bg-white border border-indigo-100 text-[#5D38F0] px-6 py-2 rounded-xl font-black text-[11px] flex items-center gap-2 hover:bg-indigo-50 transition-all"><MessageSquare size={14} /> चैट शुरू करें</button>
                </div>
            </div>
        );
    };

    // --- SCREEN 4: ECO CARD DETAIL ---
    const EcoCardDetailScreen = () => {
        const c = selectedEcoCard?.colorStyle || { color: 'text-indigo-500', bg: 'bg-indigo-50' };
        return (
            <div className="min-h-screen bg-[#F8FAFF] pb-24">
                <div className="px-6 pt-12 pb-4 flex items-center gap-4 bg-[#F8FAFF]/90 backdrop-blur-md sticky top-0 z-40">
                    <button onClick={() => navigate(`/user/business-ideas/${ideaId}/ecosystem`)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100"><ChevronLeft size={22} /></button>
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedIdea?.title}</p>
                        <h1 className="text-lg font-black text-slate-900 leading-tight">{selectedEcoCard?.title}</h1>
                    </div>
                </div>

                <div className="px-6 mt-4">
                    <div className={`${c.bg} rounded-[2.5rem] p-6 flex items-center gap-4`}>
                        <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm`}>
                            <span className={`text-2xl font-black ${c.color}`}>📋</span>
                        </div>
                        <div>
                            <p className={`text-xs font-black ${c.color} uppercase tracking-widest`}>Premium Content</p>
                            <h2 className="text-xl font-black text-slate-900 mt-0.5">{selectedEcoCard?.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="px-6 mt-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 min-h-[300px]">
                        {selectedEcoCard?.description ? (
                            <div className="prose prose-sm max-w-none">
                                {selectedEcoCard.description.split('\n').map((line, i) => (
                                    line.trim() ? (
                                        <p key={i} className="text-[14px] font-medium text-slate-700 leading-relaxed mb-4">{line}</p>
                                    ) : <br key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <div className={`w-16 h-16 ${c.bg} rounded-full flex items-center justify-center`}>
                                    <span className="text-3xl">📝</span>
                                </div>
                                <p className="font-black text-slate-300 text-xs uppercase tracking-widest">Content Coming Soon</p>
                                <p className="text-slate-300 text-[11px]">Admin is updating this section...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen font-inter shadow-xl relative overflow-x-hidden">
            {step === -1 && <IntroScreen />}
            {step === 0 && <ListingScreen />}
            {step === 1 && <DetailsScreen />}
            {step === 2 && <SubscriptionScreen />}
            {step === 3 && <EcosystemScreen />}
            {step === 4 && <EcoCardDetailScreen />}

            {showPaymentModal && settings.businessPlans[selectedPlanIdx] && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    plan={settings.businessPlans[selectedPlanIdx].title}
                    amount={settings.businessPlans[selectedPlanIdx].price}
                    type="BUSINESS_HUB_PLAN"
                    itemId={ideaId}
                    extraData={{
                        planName: settings.businessPlans[selectedPlanIdx].title,
                        planDuration: settings.businessPlans[selectedPlanIdx].duration
                    }}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        // refreshUserProfile is already called inside PaymentModal
                    }}
                />
            )}
        </div>
    );
};

export default BusinessIdeas;
