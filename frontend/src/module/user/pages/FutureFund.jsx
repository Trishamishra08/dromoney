import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, CheckCircle2, Timer, Calendar, ShieldCheck, Sparkles, IndianRupee, X, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';

const FutureFund = () => {
    const navigate = useNavigate();
    const { userData, addNotification } = useUser();
    const { futureFund } = userData;
    const [viewState, setViewState] = React.useState('initial'); // initial, eligible, active

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (viewState === 'initial') {
                setViewState('eligible');
                addNotification("Eligibility Updated!", "Congratulations! You are now eligible for Future Fund.", "success");
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [viewState]);

    if (viewState === 'active') {
        return (
            <div className="flex flex-col min-h-screen bg-[#F1F5F9] animate-in slide-in-from-right duration-500 pb-20">
                {/* Header */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-4">
                    <button onClick={() => setViewState('eligible')} className="text-slate-600"><ChevronLeft size={24} /></button>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Future Fund</h1>
                </div>

                <div className="p-4 space-y-4">
                    {/* Congratulations Banner */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🎉</span>
                            <div>
                                <h4 className="text-[13px] font-black text-slate-800 leading-tight">Congratulations!</h4>
                                <p className="text-[11px] font-bold text-slate-500">आप Future Fund के लिए eligible हो गए हैं</p>
                            </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Active</span>
                    </div>

                    {/* Today's Earning Box */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Today's Future Fund Earning</p>
                        <h2 className="text-3xl font-black text-slate-900 mb-1">₹ 45.00</h2>
                        <p className="text-[11px] font-bold text-slate-500">आज इतना amount आपकी Future Fund में add हुआ है</p>
                    </div>

                    {/* Last 7 Days Earnings */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Last 7 Days Earnings</h4>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { day: 'Today', amount: '45' },
                                { day: 'Yesterday', amount: '38' },
                                { day: 'Day 3', amount: '52' },
                                { day: 'Day 4', amount: '40' },
                                { day: 'Day 5', amount: '35' },
                                { day: 'Day 6', amount: '28' },
                                { day: 'Day 7', amount: '42' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[13px]">
                                    <span className="font-bold text-slate-500">{item.day}</span>
                                    <span className="font-black text-slate-800">₹ {item.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Future Fund */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex justify-between items-center">
                        <div>
                           <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-widest mb-1">Total Future Fund</h4>
                           <p className="text-[10px] font-bold text-slate-400">यह amount platform performance के हिसाब से रोज add होता है</p>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 shrink-0">₹ 210</h2>
                    </div>

                    {/* Today Activity Progress */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[12px] font-black text-slate-800 flex items-center gap-1.5">
                                <Timer size={14} className="text-slate-400" />
                                Today Activity
                            </h4>
                            <span className="text-[11px] font-black text-slate-400">45%</span>
                        </div>
                        <h3 className="text-[14px] font-black text-slate-800 mb-2">06:45 / 15:00 <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Minutes</span></h3>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-500 w-[45%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"></div>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 leading-none">🔥 8 मिनट और active रहें</p>
                    </div>
                </div>
            </div>
        );
    }

    const CRITERIA = [
        { 
            id: 1, 
            title: "Successful Sales", 
            target: "10-15 Sales", 
            current: futureFund.criteria.find(c => c.id === 1)?.current || 0,
            icon: ShieldCheck, 
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        { 
            id: 2, 
            title: "Daily Activity", 
            target: "15 Mins Daily", 
            current: "active",
            icon: Timer, 
            color: 'text-sky-500',
            bg: 'bg-sky-50'
        },
        { 
            id: 3, 
            title: "Active Days", 
            target: "7-10 Days", 
            current: futureFund.criteria.find(c => c.id === 2)?.current || 0,
            icon: Calendar, 
            color: 'text-indigo-500',
            bg: 'bg-indigo-50'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden animate-in slide-in-from-right duration-500 pb-6">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[50%] bg-purple-200/40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-20%] w-[70%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px]"></div>
            </div>

            <div className="flex-1 space-y-2.5 relative z-10">
                {/* Full Width Hero Card */}
                <div className="w-full bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-500 rounded-b-[2.5rem] p-4 pb-7 text-white relative overflow-hidden shadow-2xl">
                    {/* Back Button Integrated */}
                    <button 
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/user/home');
                            }
                        }}
                        className="absolute top-4 left-2 w-10 h-10 flex items-center justify-center text-white active:scale-75 transition-all z-[100] cursor-pointer"
                    >
                        <ChevronLeft size={28} strokeWidth={2.5} />
                    </button>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-sm flex items-center justify-center border border-white/20 shadow-lg">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[15px] font-black tracking-tight leading-none">Future Fund</h2>
                                <p className="text-[7px] font-bold text-white/60 uppercase tracking-widest mt-0.5">Eligibility Program</p>
                            </div>
                        </div>
                        
                        <div className="w-full max-w-[280px] bg-white/10 backdrop-blur-md rounded-sm px-3 py-2 border border-white/10 mx-auto">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[7px] font-black uppercase tracking-widest text-white/80">Progress</span>
                                <span className="text-[11px] font-black">{futureFund.progress}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                    style={{ width: `${futureFund.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-10 space-y-4">
                    {/* Description Section */}
                    <div className="bg-slate-900 p-5 shadow-2xl relative overflow-hidden border-b-4 border-purple-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <Sparkles size={12} />
                            PROGRAM INSIGHT
                        </h3>
                        <p className="text-[13px] font-medium text-slate-300 leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                            "Future Fund is a long-term earning opportunity. Once activated, users become eligible for cash rewards derived from platform profits."
                        </p>
                    </div>

                    {/* Eligibility Criteria Cards */}
                    {/* Eligibility Criteria Cards (Compact & Rounded) */}
                    <div className="grid grid-cols-1 gap-3">
                        {/* 1. Successful Sales */}
                        <div 
                            className="relative bg-gradient-to-br from-emerald-50 to-teal-100 p-4 shadow-lg shadow-emerald-100/50 border border-white active:scale-[0.98] transition-all overflow-hidden flex flex-col"
                            style={{ borderRadius: '2rem' }}
                        >
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/30 rounded-full blur-2xl"></div>
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex gap-1.5">
                                    <div className="w-8 h-8 bg-white/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white shadow-sm">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                    </div>
                                    <div className="w-8 h-8 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/50">
                                        <Zap size={14} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="bg-emerald-600/10 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    <span className="text-[11px] font-black text-emerald-700">7/10</span>
                                </div>
                            </div>
                            <div className="relative z-10 flex-1">
                                <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">Successful Sales</h4>
                                <p className="text-[10px] font-bold text-slate-500 leading-tight tracking-tight uppercase">Target Milestone</p>
                            </div>
                            <div className="w-full h-1 bg-white/50 rounded-full mt-3 overflow-hidden relative">
                                <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: '70%' }}></div>
                            </div>
                        </div>

                        {/* 2. Daily Activity */}
                        <div 
                            className="relative bg-gradient-to-br from-amber-50 to-orange-100 p-4 shadow-lg shadow-amber-100/50 border border-white active:scale-[0.98] transition-all overflow-hidden flex flex-col"
                            style={{ borderRadius: '2rem' }}
                        >
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/30 rounded-full blur-2xl"></div>
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex gap-1.5">
                                    <div className="w-8 h-8 bg-white/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white shadow-sm">
                                        <Timer size={16} className="text-amber-600" />
                                    </div>
                                    <div className="w-8 h-8 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/50">
                                        <Sparkles size={14} className="text-amber-400" />
                                    </div>
                                </div>
                                <div className="bg-amber-600/10 px-2.5 py-0.5 rounded-full border border-amber-200">
                                    <span className="text-[11px] font-black text-amber-700">12:30m</span>
                                </div>
                            </div>
                            <div className="relative z-10 flex-1">
                                <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">Daily Activity</h4>
                                <p className="text-[10px] font-bold text-slate-500 leading-tight tracking-tight uppercase">Time Tracker</p>
                            </div>
                            <div className="w-full h-1 bg-white/50 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: '83%' }}></div>
                            </div>
                        </div>

                        {/* 3. Active Days */}
                        <div 
                            className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-4 shadow-lg shadow-blue-100/50 border border-white active:scale-[0.98] transition-all overflow-hidden flex flex-col"
                            style={{ borderRadius: '2rem' }}
                        >
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/30 rounded-full blur-2xl"></div>
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex gap-1.5">
                                    <div className="w-8 h-8 bg-white/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white shadow-sm">
                                        <Calendar size={16} className="text-blue-600" />
                                    </div>
                                    <div className="w-8 h-8 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/50">
                                        <Zap size={14} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="bg-blue-600/10 px-2.5 py-0.5 rounded-full border border-blue-200">
                                    <span className="text-[11px] font-black text-blue-700">6/10</span>
                                </div>
                            </div>
                            <div className="relative z-10 flex-1">
                                <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">Active Days</h4>
                                <p className="text-[10px] font-bold text-slate-500 leading-tight tracking-tight uppercase">Continuity Goal</p>
                            </div>
                            <div className="w-full h-1 bg-white/50 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-1000" style={{ width: '60%' }}></div>
                            </div>
                        </div>

                        {/* Info Box (Compact & Rounded) */}
                        <div 
                            className="bg-slate-900 text-white p-5 shadow-2xl relative overflow-hidden"
                            style={{ borderRadius: '2rem' }}
                        >
                            <div className="flex gap-3 items-center relative z-10">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white shrink-0 border border-white/10">
                                    <Sparkles size={16} className="text-purple-400" />
                                </div>
                                <p className="text-[10px] font-medium text-slate-300 leading-relaxed flex-1">
                                    आपका समय <span className="text-white font-bold">स्वचालित रूप से</span> गिना जाएगा। 15 मिनट = 1 दिन।
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 space-y-3">
                            <button className="w-full bg-slate-900 text-white font-black py-4 shadow-2xl active:scale-[0.98] transition-all text-[15px] tracking-[0.1em] uppercase border-b-4 border-purple-600 flex items-center justify-center gap-3 group">
                                UNLOCK FUTURE FUND
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <button 
                                onClick={() => navigate('/user/home')}
                                className="w-full bg-white text-slate-500 font-black py-3.5 text-[11px] active:scale-[0.98] transition-all tracking-[0.2em] uppercase border border-slate-200 shadow-sm"
                            >
                                Continue Earning
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FutureFund;
