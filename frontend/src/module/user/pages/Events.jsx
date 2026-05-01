import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
    ChevronLeft, ChevronRight, ChevronDown, Trophy, Timer, Users, Calendar,
    CircleHelp, Sparkles, Zap, Coins, Clock, Info, Lightbulb, Rocket, Award, CheckCircle2, AlertCircle
} from 'lucide-react';
import UnlockModal from '../components/UnlockModal';
import PaymentModal from '../components/PaymentModal';
import { eventStorage } from '../../shared/services/eventStorage';
import api from '../../shared/services/api';

const Events = () => {
    const { userData, addCoins, addNotification } = useUser();
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [isBoosterExpanded, setIsBoosterExpanded] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [toast, setToast] = useState(null);
    const [eventList, setEventList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('dromoney_joined_events') || '[]');
        setJoinedEvents(saved);
        
        // Load events from Backend API
        const fetchEvents = async () => {
            try {
                const res = await api.get('/public/events');
                if (res.success && res.data && res.data.length > 0) {
                    setEventList(res.data);
                    if (res.joinedEvents) {
                        setJoinedEvents(res.joinedEvents);
                    }
                } else {
                    // Fallback to local storage if DB is empty
                    const allEvents = eventStorage.getEvents();
                    setEventList(allEvents.filter(e => e.status === 'Active'));
                }
            } catch (err) {
                console.error("Failed to fetch events from DB:", err);
                const allEvents = eventStorage.getEvents();
                setEventList(allEvents.filter(e => e.status === 'Active'));
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
        switch (event.tag) {
            case 'Quiz': navigate(`/user/quiz/${event.id}`); break;
            case 'Draw': navigate(`/user/lucky-draw/${event.id}`); break;
            case 'Prediction': navigate(`/user/gold-prediction/${event.id}`); break;
            case 'Brain': navigate(`/user/memory-master/${event.id}`); break;
            default: break;
        }
    };

    const handleJoinEvent = async (event) => {
        if (!userData.isPaid) {
            setIsUnlockOpen(true);
            return;
        }

        // If already joined, just navigate
        if (joinedEvents.includes(event._id)) {
            navigateToEvent(event);
            return;
        }

        try {
            const res = await api.post(`/user/data/events/${event._id}/join`);
            if (res.success) {
                // Refresh profile to see updated coins
                await refreshUserProfile();
                
                // Save joined status locally and update state
                const newJoined = [...joinedEvents, event._id];
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

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />
            
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
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">Events</h1>
                            <p className="text-[9px] font-bold text-blue-300 opacity-80 uppercase tracking-widest mt-1">Win Big Rewards</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Coins size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[12px] font-black text-white">{userData.coins.total}</span>
                    </div>
                </div>

                {/* Trophy Banner - Slim Version */}
                <div className="mt-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shrink-0">
                        <Trophy size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[13px] font-black text-white leading-none">Join & Win Prizes!</h2>
                        <p className="text-[8px] font-bold text-blue-100 opacity-60 mt-1">Use coins to participate.</p>
                    </div>
                </div>
            </div>

            <div className="p-3 space-y-3">
                {/* Event Cards - Colored & High Density */}
                <div className="space-y-3">
                    <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Active Events</h2>
                    {eventList.map((event, idx) => {
                        const isJoined = joinedEvents.includes(event._id);
                        const isComingSoon = event.status !== 'Active';

                        // Theme Mapping
                        const THEMES = [
                            { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-600', text: 'text-indigo-600', iconBg: 'bg-indigo-100', shadow: 'shadow-indigo-100' },
                            { bg: 'bg-rose-50', border: 'border-rose-100', accent: 'bg-rose-600', text: 'text-rose-600', iconBg: 'bg-rose-100', shadow: 'shadow-rose-100' },
                            { bg: 'bg-amber-50', border: 'border-amber-100', accent: 'bg-amber-600', text: 'text-amber-600', iconBg: 'bg-amber-100', shadow: 'shadow-amber-100' },
                            { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'bg-emerald-600', text: 'text-emerald-600', iconBg: 'bg-emerald-100', shadow: 'shadow-emerald-100' },
                        ];
                        const theme = THEMES[idx % THEMES.length];

                        return (
                            <div key={event._id} className={`${theme.bg} border ${theme.border} rounded-2xl p-4 shadow-sm relative overflow-hidden group`}>
                                {/* Decorative circle */}
                                <div className={`absolute -right-6 -top-6 w-20 h-20 ${theme.accent} opacity-[0.03] rounded-full`}></div>

                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${theme.iconBg} rounded-xl flex items-center justify-center ${theme.text} shadow-inner`}>
                                            {event.tag === 'Quiz' ? <Zap size={20} /> : event.tag === 'Draw' ? <Sparkles size={20} /> : <Rocket size={20} />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-[15px] font-black text-slate-800 leading-none tracking-tight">{event.title}</h3>
                                            <span className={`inline-block text-[8px] font-black ${theme.text} uppercase tracking-widest`}>{event.tag}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleJoinEvent(event)}
                                        disabled={isComingSoon}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-md active:scale-95 ${
                                            isJoined 
                                            ? 'bg-emerald-500 text-white shadow-emerald-100' 
                                            : isComingSoon
                                            ? 'bg-slate-200 text-slate-400'
                                            : `${theme.accent} text-white ${theme.shadow}`
                                        }`}
                                    >
                                        {isJoined ? "Joined" : isComingSoon ? "Soon" : "Join"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80 relative z-10">
                                    <div className="flex flex-col">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Entry Fee</p>
                                        <div className="flex items-center gap-1">
                                            <Coins size={10} className="text-amber-500" />
                                            <p className="text-[12px] font-black text-slate-800">{event.fee}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Pool Prize</p>
                                        <p className={`text-[12px] font-black ${theme.text}`}>{event.prize}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Clock size={12} className="opacity-60" />
                                        <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">
                                            {event.startTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Users size={12} className="opacity-60" />
                                        <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">
                                            {event.participants} Users
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Support Booster - Premium Compact */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center border border-amber-400/20 shadow-inner">
                                <Zap size={20} className="text-amber-400 fill-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-white tracking-tight leading-none mb-1">₹11 Support Booster</h4>
                                <p className="text-[9px] font-bold text-slate-400 leading-none">Activate 60% Winning Chance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => setIsBoosterExpanded(!isBoosterExpanded)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isBoosterExpanded ? 'bg-amber-400 text-slate-900 rotate-180' : 'bg-white/5 text-slate-400 border border-white/10'}`}
                            >
                                <ChevronDown size={16} />
                            </button>
                            <button
                                onClick={handleBuyBooster}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                            >
                                Buy
                            </button>
                        </div>
                    </div>

                    {isBoosterExpanded && (
                        <div className="bg-white/5 border-t border-white/5 p-4 space-y-3 animate-in slide-in-from-top-4 duration-300">
                            {[
                                { icon: <Zap size={14} />, title: "60% Winning Boost", desc: "Win big in every event", color: "text-amber-400" },
                                { icon: <Lightbulb size={14} />, title: "Quiz Support", desc: "Platform support in 6/10 questions", color: "text-yellow-400" },
                                { icon: <Rocket size={14} />, title: "Priority Entry", desc: "Early access to premium events", color: "text-orange-400" },
                                { icon: <Award size={14} />, title: "Elite Badge", desc: "Exclusive profile support badge", color: "text-blue-400" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
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
