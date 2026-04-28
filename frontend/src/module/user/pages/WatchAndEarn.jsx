import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Coins, ChevronRight, MonitorPlay, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

import api from '../../shared/services/api';
import { Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const WatchAndEarn = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [viewAds, setViewAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchedCount, setWatchedCount] = useState(0);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await api.get('/public/ads');
            if (res.success) {
                setViewAds(res.data);
                setWatchedCount(res.data.filter(a => a.isWatched).length);
            }
        } catch (err) {
            console.error('Error fetching ads:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Initializing Campaigns...</p>
            </div>
        );
    }

    return (
        <div className="pb-24 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-b-[2.5rem] shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
                
                <div className="relative flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-white/10">
                            <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Bonus Daily Ads</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Watch & Earn</h1>
                        <p className="text-indigo-100 text-xs font-bold flex items-center gap-1.5 opacity-80">
                            Watch simple ads to get daily extra coins!
                        </p>
                    </div>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-inner">
                            <Coins size={14} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-[12px] font-black text-white">{userData.coins.total}</span>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-inner">
                            <MonitorPlay size={32} className="text-white drop-shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-tighter">Your Progress</p>
                            <p className="text-sm font-black text-white">{watchedCount}/{viewAds.length} <span className="text-[10px] font-bold opacity-60 ml-1">Ads Watched</span></p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-500 overflow-hidden shadow-lg">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Ad${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ads List */}
            <div className="px-4 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Available Ad Slots</h2>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
                        {viewAds.filter(a => !a.isWatched).length} Ads Live Now
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {viewAds.map((ad) => {
                        const isWatched = ad.isWatched;
                        return (
                            <button 
                                key={ad._id}
                                disabled={isWatched}
                                onClick={() => navigate(`/user/ad-player/${ad._id}`)}
                                className={`w-full text-left bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex transition-all active:scale-[0.97] group ${isWatched ? 'opacity-70 grayscale-[0.5]' : 'hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5'}`}
                            >
                                {/* Thumbnail Section */}
                                <div className="w-28 h-28 relative shrink-0">
                                    <img src={ad.thumbnailUrl} alt={ad.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-white">
                                        <PlayCircle size={10} className="fill-white" />
                                        <span className="text-[9px] font-black">{ad.duration}s</span>
                                    </div>
                                    {isWatched && (
                                        <div className="absolute inset-0 bg-indigo-600/60 backdrop-blur-[1px] flex items-center justify-center">
                                            <CheckCircle2 size={32} className="text-white fill-white/20" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-4 flex flex-col justify-between relative overflow-hidden">
                                    {/* Background decorative path */}
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors"></div>

                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Sponsored Content</p>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{ad.title}</h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                <Coins size={12} className="text-amber-500 fill-amber-500" />
                                                <span className="text-[11px] font-black text-amber-600">+{ad.coinsReward}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Clock size={10} />
                                                <span className="text-[9px] font-bold">{ad.duration} sec</span>
                                            </div>
                                        </div>
                                        {isWatched ? (
                                             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Claimed</span>
                                        ) : (
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WatchAndEarn;
