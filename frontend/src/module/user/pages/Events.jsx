import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
    ChevronLeft, ChevronDown, Trophy, Users,
    Sparkles, Zap, Coins, Clock, Lightbulb, Rocket, Award, CheckCircle2, AlertCircle
} from 'lucide-react';
import UnlockModal from '../components/UnlockModal';
import PaymentModal from '../components/PaymentModal';
import { eventStorage } from '../../shared/services/eventStorage';
import api from '../../shared/services/api';

const Events = () => {
    const { userData, addCoins, addNotification, refreshUserProfile } = useUser();
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [isBoosterExpanded, setIsBoosterExpanded] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [toast, setToast] = useState(null);
    const [eventList, setEventList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load events from Backend API
        const fetchEvents = async () => {
            try {
                const res = await api.get('/public/events');
                if (res.success && res.data && res.data.length > 0) {
                    setEventList(res.data);
                    if (res.joinedEvents) {
                        setJoinedEvents(res.joinedEvents);
                        localStorage.setItem('dromoney_joined_events', JSON.stringify(res.joinedEvents));
                    } else {
                        setJoinedEvents([]);
                    }
                } else {
                    // Fallback to local storage if DB is empty
                    const allEvents = eventStorage.getEvents();
                    setEventList(allEvents.filter(e => e.status === 'Active'));
                    const saved = JSON.parse(localStorage.getItem('dromoney_joined_events') || '[]');
                    setJoinedEvents(saved);
                }
            } catch (err) {
                console.error("Failed to fetch events from DB:", err);
                const allEvents = eventStorage.getEvents();
                setEventList(allEvents.filter(e => e.status === 'Active'));
                const saved = JSON.parse(localStorage.getItem('dromoney_joined_events') || '[]');
                setJoinedEvents(saved);
            }
        };

        fetchEvents();
    }, []);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleBuyBooster = () => {
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentOpen(false);
        addNotification("Booster Activated!", "₹11 Event Support Booster successfully activated for 30 days.", "success");
        setIsBoosterExpanded(false);
    };

    const navigateToEvent = (event) => {
        const id = event._id || event.id;
        switch (event.tag) {
            case 'Quiz': navigate(`/user/quiz/${id}`); break;
            case 'Draw': navigate(`/user/lucky-draw/${id}`); break;
            case 'Brain': navigate(`/user/memory-master/${id}`); break;
            default: break;
        }
    };

    const handleJoinEvent = async (event) => {
        if (!userData.isPaid) {
            setIsUnlockOpen(true);
            return;
        }

        const id = event._id || event.id;

        // Strict double-check: If already joined, just navigate and block any API calls
        if (joinedEvents.includes(id)) {
            navigateToEvent(event);
            return;
        }

        try {
            const res = await api.post(`/user/data/events/${id}/join`);
            if (res.success) {
                // Refresh profile to see updated coins
                await refreshUserProfile(false);
                
                // Save joined status locally and update state
                const newJoined = [...joinedEvents, id];
                setJoinedEvents(newJoined);
                localStorage.setItem('dromoney_joined_events', JSON.stringify(newJoined));

                showToast(`Successfully joined ${event.title}!`, "success");
                setTimeout(() => navigateToEvent(event), 900);
            } else {
                showToast(res.message || "Failed to join event", "error");
            }
        } catch (err) {
            showToast(err.message || "Something went wrong", "error");
        }
    };

    // Pastel palette styles configuration per event tag
    const getPastelTheme = (tag) => {
        switch (tag) {
            case 'Quiz':
                return {
                    cardBg: 'bg-gradient-to-br from-[#F5F3FF] via-[#FAF9FF] to-[#EEF2FF]', // Soft Lavender-Indigo
                    border: 'border-purple-100/80',
                    tagBadge: 'bg-purple-100/60 text-purple-600 border border-purple-200/40',
                    statsBg: 'bg-white/60 border border-purple-100/40',
                    button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100',
                    accentIcon: <Trophy size={14} className="text-indigo-500" />
                };
            case 'Draw':
                return {
                    cardBg: 'bg-gradient-to-br from-[#FFF1F2] via-[#FFF8F8] to-[#FFF5F5]', // Soft Rose-Pink
                    border: 'border-rose-100/80',
                    tagBadge: 'bg-rose-100/60 text-rose-600 border border-rose-200/40',
                    statsBg: 'bg-white/60 border border-rose-100/40',
                    button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100',
                    accentIcon: <Sparkles size={14} className="text-rose-500" />
                };
            case 'Brain':
                return {
                    cardBg: 'bg-gradient-to-br from-[#ECFDF5] via-[#F9FEFB] to-[#F0FDF4]', // Soft Mint-Emerald
                    border: 'border-emerald-100/80',
                    tagBadge: 'bg-emerald-100/60 text-emerald-700 border border-[#A7F3D0]/40',
                    statsBg: 'bg-white/60 border border-emerald-100/40',
                    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100',
                    accentIcon: <Lightbulb size={14} className="text-emerald-600" />
                };
            default:
                return {
                    cardBg: 'bg-gradient-to-br from-slate-50 via-white to-slate-100', // Neutral Pastel
                    border: 'border-slate-200/60',
                    tagBadge: 'bg-slate-100 text-slate-600 border border-slate-200/30',
                    statsBg: 'bg-white/60 border border-slate-100',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    accentIcon: <Sparkles size={14} className="text-blue-500" />
                };
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-28">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />
            
            {/* Header - Compact Dark Blue gradient consistent with DroMoney branding */}
            <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-4 rounded-b-[1.5rem] shadow-lg sticky top-[57px] z-40 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="flex items-center justify-between relative z-10 max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/user/home')}
                            className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex flex-col text-left">
                            <h1 className="text-base font-black text-white tracking-tight leading-none">Events</h1>
                            <p className="text-[9px] font-bold text-blue-300 opacity-80 uppercase tracking-widest mt-1">Win Big Rewards</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Coins size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[12px] font-black text-white">{userData.coins.total}</span>
                    </div>
                </div>

                {/* Trophy Banner */}
                <div className="mt-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3 max-w-md mx-auto">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shrink-0">
                        <Trophy size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                        <h2 className="text-[13px] font-black text-white leading-none">Join & Win Prizes!</h2>
                        <p className="text-[8px] font-bold text-blue-100 opacity-60 mt-1">Use coins to participate and earn huge Cash payouts.</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 max-w-md mx-auto w-full">
                {/* Event Cards Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Active Live Events</h2>
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border border-emerald-100/50 animate-pulse">Live Dashboard</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {eventList.map((event) => {
                            const id = event._id || event.id;
                            const isJoined = joinedEvents.includes(id);
                            const isComingSoon = event.status !== 'Active';
                            const theme = getPastelTheme(event.tag);

                            return (
                                <div 
                                    key={id} 
                                    onClick={() => isJoined && navigateToEvent(event)}
                                    className={`border rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col gap-3.5 group cursor-pointer ${theme.cardBg} ${theme.border}`}
                                >
                                    {/* Top row: Title, tag, button */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 flex-1 pr-2 text-left">
                                            <div className="flex items-center gap-1.5">
                                                {theme.accentIcon}
                                                <h3 className="text-[15px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{event.title}</h3>
                                            </div>
                                            <span className={`inline-block text-[8px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase w-fit ${theme.tagBadge}`}>
                                                {event.tag}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card onClick trigger
                                                if (isJoined) {
                                                    navigateToEvent(event);
                                                } else {
                                                    handleJoinEvent(event);
                                                }
                                            }}
                                            disabled={isComingSoon}
                                            className={`px-4.5 py-2.5 rounded-2xl text-[9px] font-black tracking-widest uppercase transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer ${
                                                isJoined 
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100 font-extrabold' 
                                                : isComingSoon
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                : `${theme.button}`
                                            }`}
                                        >
                                            {isJoined ? "JOINED" : isComingSoon ? "Soon" : "JOIN EVENT"}
                                        </button>
                                    </div>

                                    {/* Compact 2x2 stats block with theme-specific pastel border and backdrop */}
                                    <div className={`grid grid-cols-2 gap-3 p-3 rounded-2xl ${theme.statsBg}`}>
                                        <div className="space-y-0.5 text-left">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Entry Fee</p>
                                            <div className="flex items-center gap-1">
                                                <Coins size={11} className="text-amber-500 fill-amber-500" />
                                                <span className="text-[11px] font-black text-slate-700">{event.fee} Coins</span>
                                            </div>
                                        </div>

                                        <div className="space-y-0.5 text-left">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Pool Prize</p>
                                            <p className="text-[11px] font-black text-emerald-600 leading-none">{event.prize || '₹500'}</p>
                                        </div>

                                        <div className="flex items-center gap-1 text-slate-500 pt-1 border-t border-slate-100 text-left">
                                            <Clock size={11} className="text-slate-400" />
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                                                {event.startTime}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-slate-500 pt-1 border-t border-slate-100 text-left">
                                            <Users size={11} className="text-slate-400" />
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                                                {event.participantsCount || event.participants || 0} Joined
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Support Booster - Premium Compact */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl mt-2">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center border border-amber-400/20 shadow-inner shrink-0">
                                <Zap size={20} className="text-amber-400 fill-amber-400" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[13px] font-black text-white tracking-tight leading-none mb-1">₹11 Support Booster</h4>
                                <p className="text-[9px] font-bold text-slate-400 leading-none">Activate 60% Winning Chance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => setIsBoosterExpanded(!isBoosterExpanded)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${isBoosterExpanded ? 'bg-amber-400 text-slate-900 rotate-180' : 'bg-white/5 text-white/40 border border-white/10'}`}
                            >
                                <ChevronDown size={16} />
                            </button>
                            <button
                                onClick={handleBuyBooster}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
                            >
                                Buy
                            </button>
                        </div>
                    </div>

                    {isBoosterExpanded && (
                        <div className="bg-white/5 border-t border-white/5 p-4 space-y-3 animate-in slide-in-from-top-4 duration-300">
                            {[
                                { icon: <Zap size={14} />, title: "60% Winning Boost", desc: "Win big in every event with high prioritization", color: "text-amber-400" },
                                { icon: <Lightbulb size={14} />, title: "Quiz Support", desc: "Platform support in 6/10 questions automatically", color: "text-yellow-400" },
                                { icon: <Rocket size={14} />, title: "Priority Entry", desc: "Early access to premium and high prize events", color: "text-orange-400" },
                                { icon: <Award size={14} />, title: "Elite Badge", desc: "Exclusive profile support badge next to your user name", color: "text-blue-400" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-left">
                                    <div className={`w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-white leading-tight">{item.title}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Toast */}
            {toast && (
                <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-xs p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 z-[100] ${
                    toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
                </div>
            )}

            <PaymentModal 
                isOpen={isPaymentOpen} 
                onClose={() => setIsPaymentOpen(false)} 
                amount={11} 
                plan="Event Support Booster" 
                onSuccess={handlePaymentSuccess} 
            />
        </div>
    );
};

export default Events;
