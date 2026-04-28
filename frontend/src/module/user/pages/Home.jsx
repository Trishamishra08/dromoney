import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
    IndianRupee, Coins, Users, CreditCard, ChevronRight, Zap,
    Wallet, Sparkles, Send, Trophy, Gift, Shield, Rocket, CheckCircle2, BarChart2, ClipboardList, ChevronDown, Share2, TrendingUp,
    Video, X, DollarSign, ArrowUp, ArrowDown, RotateCcw, QrCode, Smartphone, Receipt, Building, Clock, Lightbulb, Film, PlusSquare, MoreHorizontal
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import api from '../../shared/services/api';
import UniversalVideoPlayer from '../../shared/components/UniversalVideoPlayer';

const FALLBACK_BANNERS = [
    {
        _id: '1',
        tag: 'Affiliate Program',
        title: 'Earn ₹200 Per Sale',
        subtitle: 'Share your link & get instant commission on every referral',
        ctaText: 'Invite Now',
        path: '/user/profile',
        gradient: 'from-sky-500 to-sky-700',
        iconName: 'Users',
    },
    {
        _id: '2',
        tag: '3X Booster Active',
        title: 'Multiply Your Coins',
        subtitle: 'Upgrade to Monthly Booster and earn 3x coins on every task',
        ctaText: 'Upgrade Now',
        path: '/user/profile',
        gradient: 'from-indigo-500 to-indigo-700',
        iconName: 'Zap',
    },
    {
        _id: '3',
        tag: 'Live Contest',
        title: 'Win Up To ₹500',
        subtitle: 'Join the Mega Jackpot Night — limited seats, big rewards!',
        ctaText: 'Join Event',
        path: '/user/events',
        gradient: 'from-emerald-500 to-teal-600',
        iconName: 'Trophy',
    },
];

// Mapping helper for dynamic string icon loading
import * as Icons from 'lucide-react';

const AdBanners = ({ navigate }) => {
    const [active, setActive] = useState(0);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const response = await api.get('/public/banners');
                if (response.success && response.data && response.data.length > 0) {
                    setBanners(response.data);
                } else {
                    setBanners(FALLBACK_BANNERS);
                }
            } catch (err) {
                console.error("Banner fetch error", err);
                setBanners(FALLBACK_BANNERS);
            } finally {
                setLoading(false);
            }
        };
        loadBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (loading || banners.length === 0) {
        return <div className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>;
    }

    const banner = banners[active];
    // Resolve string icon to component, default to Megaphone if not found
    const BannerIcon = Icons[banner.iconName] || Icons.Megaphone;

    return (
        <div className="relative">
            <div
                onClick={() => navigate(banner.path || '/user/home')}
                className={`cursor-pointer bg-gradient-to-r ${banner.gradient || 'from-sky-500 to-sky-700'} rounded-2xl p-4 shadow-lg relative overflow-hidden transition-all duration-500 group`}
            >
                {/* Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <BannerIcon size={110} />
                </div>

                <div className="relative z-10 text-white">
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] bg-white/20 px-2 py-0.5 rounded-full">
                        {banner.tag}
                    </span>
                    <h2 className="text-xl font-black tracking-tight mt-2 leading-none">{banner.title}</h2>
                    <p className="text-[10px] font-bold text-white/70 mt-1 mb-3 leading-tight max-w-[65%]">{banner.subtitle}</p>
                    <div className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all active:scale-95">
                        <span className="text-[9px] font-black uppercase tracking-widest">{banner.ctaText || 'View More'}</span>
                        <ChevronRight size={12} />
                    </div>
                </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all duration-300 ${i === active ? 'w-4 h-1.5 bg-sky-500' : 'w-1.5 h-1.5 bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Custom Social Icons (SVG) to avoid library issues ---
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
);

const Home = () => {
    const { userData, addNotification, refreshUserProfile } = useUser();
    const { earnings, coins, referrals, futureFund, isPaid } = userData;
    const navigate = useNavigate();

    // Custom States for Booster Cards
    const [isSupportExpanded, setIsSupportExpanded] = useState(false);
    const [isTaskExpanded, setIsTaskExpanded] = useState(false);
    const [introConfig, setIntroConfig] = useState(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [paymentConfig, setPaymentConfig] = useState({ isOpen: false, plan: '', amount: 0 });
    const [lifetimePromo, setLifetimePromo] = useState(null);
    const [boosters, setBoosters] = useState({
        support: { title: '₹11 Support Booster', subtitle: 'Boost participation & win more!', benefits: [] },
        task: { title: '₹49 Task Booster', subtitle: 'Increase coin value 3X now!', benefits: [] }
    });
    const [footerPolicies, setFooterPolicies] = useState([
        { label: 'Privacy Policy', path: 'privacy' },
        { label: 'Terms & Conditions', path: 'terms' },
        { label: 'Guidelines', path: 'guidelines' }
    ]);

    const fetchHomeData = async () => {
        const keys = ['lifetime_promo', 'menu_privacy', 'menu_terms', 'menu_guidelines', 'platform_intro_video'];
        try {
            const res = await api.get(`/public/content/bulk?keys=${keys.join(',')}`);
            if (res.success && res.data) {
                const data = res.data;
                
                // 1. Lifetime Promo
                if (data['lifetime_promo'] && data['lifetime_promo'].data) {
                    setLifetimePromo(data['lifetime_promo'].data);
                }

                // 2. Intro Video Config
                if (data['platform_intro_video'] && data['platform_intro_video'].data) {
                    setIntroConfig(data['platform_intro_video'].data);
                }
                
                // 3. Footer Policies
                const policyKeys = ['menu_privacy', 'menu_terms', 'menu_guidelines'];
                const policies = policyKeys.map(key => {
                    const item = data[key];
                    if (item && item.data) {
                        return { 
                            label: item.data.title || item.title, 
                            path: key.replace('menu_', '') 
                        };
                    }
                    // Fallback
                    const label = key === 'menu_privacy' ? 'Privacy Policy' : key === 'menu_terms' ? 'Terms & Conditions' : 'Guidelines';
                    return { label, path: key.replace('menu_', '') };
                });
                setFooterPolicies(policies);
            }
        } catch (err) {
            console.error('Error fetching home bulk data:', err);
        }
    };

    const fetchBoosters = async () => {
        try {
            const res = await api.get('/public/boosters');
            if (res.success && res.data) {
                const results = { ...boosters };
                res.data.forEach(item => {
                    if (item.type === 'support' || item.type === 'task') {
                        results[item.type] = item;
                    }
                });
                setBoosters(results);
            }
        } catch (err) {
            console.error('Error fetching boosters:', err);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchHomeData();
        fetchBoosters();
    }, []);

    const handleBuy = (plan, amount) => {
        if (!isPaid) {
            // Must buy ₹499 first — show the main 499 plan modal
            setPaymentConfig({ isOpen: true, plan: 'Lifetime Access Plan', amount: 499 });
        } else {
            // User has already paid — boosters not yet active, show a toast
            addNotification("Coming Soon!", "Booster packs will be available soon.", "info");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(referrals.link);
        addNotification("Copied!", "Link copied to clipboard.", "success");
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-700 min-h-full">
            {/* Main Content Area */}
            <div className="flex flex-col gap-4 p-4 pb-2">
                {/* --- Wallet Card (Replacing Earnings StatCards) --- */}
                <div className="bg-gradient-to-r from-teal-800 to-emerald-700 rounded-[28px] p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex items-center gap-2 text-teal-50">
                            <Wallet size={16} />
                            <span className="text-[12px] font-medium">Your wallet Balance</span>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center text-teal-50/80 border border-teal-50/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors" onClick={() => navigate('/user/wallet')}>
                            <QrCode size={20} />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-6 tracking-tight relative z-10">$ {Number(earnings.total || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</h2>
                    
                    <div className="flex justify-between items-center relative z-10 px-1">
                        {[
                            { icon: DollarSign, label: 'Balance', action: () => navigate('/user/income') },
                            { icon: Wallet, label: 'Add Money', action: () => navigate('/user/wallet') },
                            { icon: ArrowUp, label: 'Send', action: () => navigate('/user/history') },
                            { icon: ArrowDown, label: 'Receive', action: () => navigate('/user/history') },
                            { icon: RotateCcw, label: 'History', action: () => navigate('/user/history') },
                        ].map((action, i) => (
                            <div key={i} onClick={action.action} className="flex flex-col items-center gap-2 cursor-pointer group/btn w-[48px]">
                                <div className="w-11 h-11 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-teal-50 transition-all group-hover/btn:bg-white/20">
                                    <action.icon size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] text-teal-100 font-medium group-hover/btn:text-white transition-colors text-center w-full">{action.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Other Services --- */}
                <div className="mt-2 mb-2">
                    <h3 className="text-[12px] font-bold text-slate-600 mb-3 ml-1">Other Services</h3>
                    <div className="grid grid-cols-4 gap-y-4 gap-x-2 bg-white rounded-[24px] p-4 shadow-sm border border-slate-50">
                        {[
                            { icon: Share2, label: 'Refer', color: 'bg-emerald-50 text-emerald-500', path: '/user/income-info#refer' },
                            { icon: ClipboardList, label: 'Task', color: 'bg-amber-50 text-amber-500', path: '/user/income-info#task' },
                            { icon: TrendingUp, label: 'Fund', color: 'bg-pink-50 text-pink-500', path: '/user/income-info#fund' },
                            { icon: Sparkles, label: 'Events', color: 'bg-purple-50 text-purple-500', path: '/user/income-info#events' },
                            { icon: Lightbulb, label: 'Electricity', color: 'bg-rose-50 text-rose-500', path: '/user/home' },
                            { icon: Film, label: 'Movie', color: 'bg-indigo-50 text-indigo-500', path: '/user/home' },
                            { icon: PlusSquare, label: 'Add Money', color: 'bg-teal-50 text-teal-500', path: '/user/wallet' },
                            { icon: MoreHorizontal, label: 'Others', color: 'bg-yellow-50 text-yellow-500', path: '/user/home' }
                        ].map((service, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(service.path)}
                                className="flex flex-col items-center gap-2 group transition-all"
                            >
                                <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:-translate-y-1 transition-transform`}>
                                    <service.icon size={20} strokeWidth={2} />
                                </div>
                                <span className="text-[10px] font-medium text-slate-600">{service.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Transactions --- */}
                <div className="mt-2 mb-4">
                    <h3 className="text-[12px] font-bold text-slate-800 mb-3 ml-1">Transactions</h3>
                    <div className="bg-white rounded-[24px] p-4 shadow-sm space-y-4 border border-slate-50">
                        {[
                            { name: 'Alex Macculam', type: 'Send Money', amount: '-$66.02', date: '25-12-2022', time: '6:00pm', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', isNegative: true },
                            { name: 'Mac Dinner', type: 'Cashout', amount: '-$120.02', date: '01-01-2023', time: '8:00pm', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80', isNegative: true },
                            { name: 'Brandon King', type: 'Add Money', amount: '+$250.00', date: '02-01-2023', time: '10:00am', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80', isNegative: false },
                        ].map((tx, i) => (
                            <div key={i} className={`flex items-center justify-between ${i !== 2 ? 'border-b border-slate-50 pb-4' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <img src={tx.image} alt={tx.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                    <div>
                                        <h4 className="text-[13px] font-bold text-slate-800 leading-tight mb-0.5">{tx.name}</h4>
                                        <p className="text-[10px] text-blue-500 font-medium leading-none">{tx.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className={`text-[13px] font-bold leading-tight mb-0.5 ${tx.isNegative ? 'text-slate-800' : 'text-emerald-500'}`}>{tx.amount}</h4>
                                    <p className="text-[9px] text-slate-400 font-medium leading-none">{tx.date} {tx.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 3 Promotional Ad Banners (Auto-Scroll) --- */}
                <div className="mb-4">
                    <AdBanners navigate={navigate} />
                </div>

                {/* Video Modal */}
                {isVideoPlaying && introConfig && (
                    <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col animate-in fade-in duration-300">
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-sm">{introConfig.title}</h4>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVideoPlaying(false);
                                }}
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4">
                            <UniversalVideoPlayer 
                                url={introConfig.videoUrl} 
                                className="w-full max-h-[70vh] shadow-2xl"
                            />
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{introConfig.subtitle}</p>
                        </div>
                    </div>
                )}

                {/* --- Platform Intro Video Card --- */}
                {introConfig && introConfig.isActive && (
                    <div 
                        onClick={() => setIsVideoPlaying(true)}
                        className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl relative group cursor-pointer active:scale-[0.98] transition-all border border-slate-800 mb-4"
                    >
                        <div className="absolute inset-0">
                            <img src={introConfig.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Intro"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        </div>

                        <div className="relative z-10 p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-4 group-hover:scale-110 transition-all shadow-xl">
                                <Video size={28} className="text-white fill-white/20" />
                            </div>
                            <h3 className="text-lg font-black text-white tracking-tight uppercase leading-none">
                                {introConfig.title}
                            </h3>
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mt-2">
                                {introConfig.subtitle}
                            </p>
                        </div>
                    </div>
                )}

                {/* --- ₹11 Support Booster Section --- */}
                <div className="bg-[#FFFBEB] border border-amber-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-amber-50">
                                <Coins className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-amber-900 tracking-tight leading-none">{boosters.support.title}</h4>
                                <p className="text-[10px] font-bold text-amber-600/70 mt-1">{boosters.support.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsSupportExpanded(!isSupportExpanded)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isSupportExpanded ? 'bg-amber-200 text-amber-900 rotate-180' : 'bg-white text-slate-300'}`}
                            >
                                <ChevronDown size={18} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => handleBuy('Support Booster', 11)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight shadow-lg shadow-blue-100 active:scale-95 transition-all"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                    {isSupportExpanded && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="bg-white/50 rounded-2xl p-3 border border-amber-50 space-y-2.5">
                                {boosters.support.benefits.map((text, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={10} className="text-amber-600" />
                                        </div>
                                        <span className="text-[11px] font-bold text-amber-900/80">{text}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/user/earn')} className="w-full mt-3 py-2 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-1">
                                My Coins: {coins.total} • Earn More <ChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </div>

                {/* --- ₹49 Task Booster Section --- */}
                <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-sky-50">
                                <Zap className="text-sky-500" size={24} />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-sky-900 tracking-tight leading-none">{boosters.task.title}</h4>
                                <p className="text-[10px] font-bold text-sky-600/70 mt-1">{boosters.task.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsTaskExpanded(!isTaskExpanded)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isTaskExpanded ? 'bg-sky-200 text-sky-900 rotate-180' : 'bg-white text-slate-300'}`}
                            >
                                <ChevronDown size={18} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => handleBuy('Task Booster', 49)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight shadow-lg shadow-blue-100 active:scale-95 transition-all"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                    {isTaskExpanded && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="bg-white/50 rounded-2xl p-3 border border-sky-50 space-y-2.5">
                                {boosters.task.benefits.map((text, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={10} className="text-sky-600" />
                                        </div>
                                        <span className="text-[11px] font-bold text-sky-900/80">{text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 px-3 py-2 bg-sky-100/50 rounded-xl text-center">
                                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest leading-none">Valid for 30 Days</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Lifetime Service Info --- */}
                {lifetimePromo && (
                    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group mb-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                    <Rocket size={20} className="text-sky-400" />
                                </div>
                                <h3 className="text-lg font-black text-white tracking-tight uppercase">{lifetimePromo.title}</h3>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                <p className="text-[13px] font-black text-sky-400 italic leading-none">{lifetimePromo.priceTag}</p>
                                <p className="text-[11px] font-bold text-white/70 mt-2 leading-tight">{lifetimePromo.note}</p>
                            </div>

                            <div className="space-y-3 pl-1">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">इसके बाद यूज़र:</p>
                                {lifetimePromo.features.map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 group/item">
                                        <div className="w-5 h-5 bg-sky-500/20 rounded-full flex items-center justify-center border border-sky-500/30">
                                            <CheckCircle2 size={10} className="text-sky-400" />
                                        </div>
                                        <span className="text-[12px] font-black text-white/90 tracking-tight leading-none">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Integrated Professional Footer (Connected to Navbar) --- */}
            <footer className="bg-white border-t border-slate-100 p-5 pt-6 pb-4 mt-auto">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-black/5">
                                <Shield size={18} className="text-sky-400" />
                            </div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Drowmoney</h2>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 max-w-[150px] leading-tight mt-1">
                            India's most trusted affiliate and task-based earning platform.
                        </p>
                    </div>

                    <div className="flex gap-2.5">
                        <div className="w-9 h-9 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer active:scale-95 shadow-sm">
                            <InstagramIcon />
                        </div>
                        <div className="w-9 h-9 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer active:scale-95 shadow-sm">
                            <FacebookIcon />
                        </div>
                        <div className="w-9 h-9 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-black hover:bg-slate-100 transition-all cursor-pointer active:scale-95 shadow-sm">
                            <XIcon />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-6 border-t border-slate-50 mb-6">
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1 opacity-40">Policies</p>
                        {footerPolicies.slice(0, 2).map((p, idx) => (
                            <button 
                                key={idx}
                                onClick={() => navigate(`/user/info/${p.path}`)} 
                                className="text-[10px] font-black text-slate-400 hover:text-sky-500 text-left transition-colors uppercase tracking-tight leading-none italic"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1 opacity-40">Company</p>
                        {footerPolicies.slice(2).map((p, idx) => (
                            <button 
                                key={idx}
                                onClick={() => navigate(`/user/info/${p.path}`)} 
                                className="text-[10px] font-black text-slate-400 hover:text-sky-500 text-left transition-colors uppercase tracking-tight leading-none italic"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-50 text-center pb-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 Drowmoney • All rights reserved</p>
                </div>
            </footer>

            <PaymentModal 
                isOpen={paymentConfig.isOpen}
                onClose={() => setPaymentConfig({ ...paymentConfig, isOpen: false })}
                plan={paymentConfig.plan}
                amount={paymentConfig.amount}
                onSuccess={async () => {
                    setPaymentConfig({ ...paymentConfig, isOpen: false });
                    await refreshUserProfile();
                    addNotification("Unlocked!", "Platform access granted. Welcome!", "success");
                }}
            />
        </div>
    );
};

export default Home;
