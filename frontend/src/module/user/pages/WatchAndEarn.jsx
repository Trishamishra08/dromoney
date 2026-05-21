import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Coins, ChevronRight, MonitorPlay, Sparkles, TrendingUp, CheckCircle2, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

import api from '../../shared/services/api';
import { useUser } from '../context/UserContext';

const WatchAndEarn = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [viewAds, setViewAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dailyAdCount, setDailyAdCount] = useState(0);
    const [nextAdAvailableAt, setNextAdAvailableAt] = useState(null);
    const [maxDailyLimit, setMaxDailyLimit] = useState(10);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await api.get('/public/ads');
            if (res.success) {
                setViewAds(res.data);
                setDailyAdCount(res.dailyAdCount ?? 0);
                setNextAdAvailableAt(res.nextAdAvailableAt || null);
                // Use limit from DB, fallback to 10
                setMaxDailyLimit(res.maxDailyLimit ?? 10);
            }
        } catch (err) {
            console.error('Error fetching ads:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cooldown countdown
    useEffect(() => {
        if (!nextAdAvailableAt) { setCooldownRemaining(0); return; }
        const update = () => {
            const ms = new Date(nextAdAvailableAt) - Date.now();
            setCooldownRemaining(ms <= 0 ? 0 : Math.ceil(ms / 1000));
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [nextAdAvailableAt]);

    const handleAdClick = (adId, isWatched) => {
        if (isWatched) { showToast("Reward already claimed for this ad.", "error"); return; }
        if (dailyAdCount >= maxDailyLimit) { showToast(`Daily limit reached! You can only watch ${maxDailyLimit} videos per day.`, "error"); return; }
        if (cooldownRemaining > 0) { showToast(`Wait ${cooldownRemaining}s before next video.`, "error"); return; }
        navigate(`/user/ad-player/${adId}`);
    };

    const slotsLeft = Math.max(0, maxDailyLimit - dailyAdCount);

    return (
        <div className="pb-24 bg-[#F8FAFC] font-['Poppins']">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 w-[88%] max-w-sm ${
                    toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                    {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span className="text-[11px]">{toast.message}</span>
                </div>
            )}

            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 px-4 pt-3 pb-4 shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 bg-white/15 px-2 py-0.5 rounded-full w-fit border border-white/10">
                            <Sparkles size={9} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-[8px] text-white uppercase tracking-widest">Bonus Daily Ads</span>
                        </div>
                        <h1 className="text-[18px] text-white leading-tight">Watch & Earn</h1>
                        <p className="text-indigo-200 text-[10px] opacity-70">Get extra coins daily!</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full border border-white/15">
                            <Coins size={11} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-[11px] text-white">{userData.coins.total}</span>
                        </div>
                        <div className="w-9 h-9 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
                            <MonitorPlay size={18} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 bg-white/10 rounded-xl p-2.5 flex items-center gap-3 border border-white/5">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp size={14} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] text-indigo-200 uppercase tracking-wider leading-none mb-1">Today's Progress</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                                    style={{ width: maxDailyLimit > 0 ? `${Math.min((dailyAdCount / maxDailyLimit) * 100, 100)}%` : '0%' }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-white shrink-0">{dailyAdCount}/{maxDailyLimit}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status banners */}
            {dailyAdCount >= maxDailyLimit ? (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2.5 mx-3 mt-3 shadow-sm">
                    <AlertTriangle className="text-rose-500 w-4 h-4 shrink-0" />
                    <div>
                        <p className="text-rose-800 text-[11px] uppercase tracking-tight">Daily Limit Reached</p>
                        <p className="text-rose-500 text-[9px]">Come back tomorrow for more!</p>
                    </div>
                </div>
            ) : cooldownRemaining > 0 ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between mx-3 mt-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <RefreshCw size={14} className="text-amber-500 animate-spin shrink-0" />
                        <div>
                            <p className="text-amber-800 text-[11px] uppercase tracking-tight">Cooldown Active</p>
                            <p className="text-amber-500 text-[9px]">Wait for validation gap to finish.</p>
                        </div>
                    </div>
                    <div className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[11px]">
                        {cooldownRemaining}s
                    </div>
                </div>
            ) : null}

            {/* Ad list */}
            <div className="px-3 mt-3 space-y-2">
                <div className="flex items-center justify-between px-0.5 mb-1">
                    <h2 className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Available Ad Slots</h2>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse inline-block"></span>
                        {slotsLeft} Left Today
                    </span>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-300 text-[11px] uppercase tracking-widest">Loading...</div>
                ) : viewAds.length === 0 ? (
                    <div className="py-12 text-center text-slate-300 text-[11px] uppercase tracking-widest">No ads available</div>
                ) : viewAds.map((ad) => {
                    const isWatched = ad.isWatched;
                    const isBlocked = dailyAdCount >= maxDailyLimit || cooldownRemaining > 0;

                    return (
                        <button
                            key={ad._id}
                            disabled={isWatched}
                            onClick={() => handleAdClick(ad._id, isWatched)}
                            className={`w-full text-left bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex transition-all active:scale-[0.98] group ${
                                isWatched ? 'opacity-60 grayscale-[0.3]' : isBlocked ? 'opacity-85' : 'hover:shadow-md'
                            }`}
                        >
                            {/* Thumbnail */}
                            <div className="w-[72px] h-[72px] relative shrink-0">
                                <img src={ad.thumbnailUrl} alt={ad.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-1 left-1.5 flex items-center gap-0.5 text-white">
                                    <PlayCircle size={7} className="fill-white" />
                                    <span className="text-[7px]">{ad.duration}s</span>
                                </div>
                                {isWatched && (
                                    <div className="absolute inset-0 bg-indigo-600/50 flex items-center justify-center">
                                        <CheckCircle2 size={20} className="text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-3 py-2 flex flex-col justify-between">
                                <div>
                                    <p className="text-[7px] text-indigo-500 uppercase tracking-widest leading-none mb-0.5">Sponsored Content</p>
                                    <h3 className="text-[12px] text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {ad.title}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                            <Coins size={9} className="text-amber-500 fill-amber-500" />
                                            <span className="text-[9px] text-amber-600">+{ad.coinsReward}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 text-slate-400">
                                            <Clock size={8} />
                                            <span className="text-[8px]">{ad.duration}s</span>
                                        </div>
                                    </div>
                                    {isWatched ? (
                                        <span className="text-[8px] text-emerald-500 uppercase">Claimed</span>
                                    ) : (
                                        <ChevronRight size={13} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WatchAndEarn;
