import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, RefreshCw, Coins, CheckCircle2, AlertTriangle, FastForward, ShieldCheck, MonitorPlay } from 'lucide-react';
import { useUser } from '../context/UserContext';

import api from '../../shared/services/api';
import UniversalVideoPlayer from '../../shared/components/UniversalVideoPlayer';

const AdPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addCoins, userData } = useUser();
    const [ad, setAd] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await api.get(`/public/ads/${id}`);
                if (res.success) {
                    setAd(res.data);
                    setTimeLeft(res.data.duration);
                    if (res.data.isWatched) {
                        setIsCompleted(true);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || "Ad not found");
            }
        };
        fetchAd();
    }, [id]);

    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0 && !isCompleted) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isCompleted && ad) {
            handleComplete();
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft, isCompleted]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const { refreshUserProfile } = useUser();
    const [claiming, setClaiming] = useState(false);

    const handleComplete = async () => {
        if (claiming || isCompleted) return;
        
        setIsPlaying(false);
        setClaiming(true);
        
        try {
            const res = await api.post('/user/data/ads/reward', { adId: id });
            if (res.success) {
                setIsCompleted(true);
                await refreshUserProfile();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to claim reward");
        } finally {
            setClaiming(false);
        }
    };

    if (error) return <div className="p-10 text-center font-black text-rose-500">{error}</div>;
    if (!ad) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col pt-0">
            {/* Immersive Header */}
            <header className="px-4 py-4 flex items-center justify-between z-50 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Coins size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[11px] font-black text-white">{userData.coins.total}</span>
                    </div>
                    <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Coins size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Reward: {ad.coinsReward} Coins</span>
                    </div>
                </div>
            </header>

            {/* Video Player Section */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <UniversalVideoPlayer 
                    url={ad.videoUrl} 
                    className="w-full h-auto max-h-screen object-contain"
                    onEnded={handleComplete}
                    autoPlay={false}
                />

                {/* Overlays */}
                {!isPlaying && !isCompleted && (
                    <button 
                        onClick={handlePlayPause}
                        className="absolute w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl animate-pulse group active:scale-90 transition-all"
                    >
                        <Play size={40} className="fill-white" />
                    </button>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        style={{ width: `${((ad.duration - timeLeft) / ad.duration) * 100}%` }}
                    ></div>
                </div>

                {/* Timer Countdown */}
                {!isCompleted && (
                    <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                        <div className="flex flex-col items-center">
                            <span className="text-[20px] font-black text-white leading-none">{timeLeft}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seconds</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Reward Card - Premium Design */}
            <div className="bg-white rounded-t-[2rem] p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                {!isCompleted ? (
                    <div className="space-y-4">
                        {/* Title & Live Indicator */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                                    <MonitorPlay size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">{ad.title}</h2>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sponsored Advertisement</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Watching</span>
                            </div>
                        </div>

                        {/* Earnings Card - High Impact */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                    <Coins size={20} className="text-yellow-300 fill-yellow-300" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Estimated Earnings</p>
                                    <p className="text-lg font-black text-white leading-none">+{ad.coinsReward} <span className="text-xs font-bold opacity-80">Coins</span></p>
                                </div>
                            </div>
                            <div className="bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">After {ad.duration}s</span>
                            </div>
                        </div>

                        {/* Instruction Note - Sleek */}
                        <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                            <ShieldCheck size={14} className="text-indigo-500 shrink-0" />
                            <p className="text-[8.5px] font-bold text-slate-500 leading-tight uppercase tracking-tight">
                                Do not close app while watching to verify reward.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-2 text-center space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 border-4 border-white">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reward Claimed!</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Coins successfully added to wallet</p>
                        </div>
                        
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between max-w-xs mx-auto">
                            <div className="text-center w-full">
                                <p className="text-[10px] font-black text-emerald-600 uppercase">Received</p>
                                <p className="text-2xl font-black text-emerald-800 tracking-tighter">+{ad.coinsReward} <span className="text-sm">Coins</span></p>
                            </div>
                            <button onClick={() => navigate('/user/watch')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                Next Ad
                            </button>
                        </div>

                        <button 
                            onClick={() => navigate('/user/watch')}
                            className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest pt-4 hover:text-indigo-600 transition-colors"
                        >
                            Return to list
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdPlayer;
