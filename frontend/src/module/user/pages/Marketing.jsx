import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
    Users, Copy, Send, ChevronLeft, ArrowRight,
    History, CheckCircle2, DollarSign, Share2, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketing = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [copied, setCopied] = useState(false);

    const referralLink = `https://earningapp.com/join/${userData?.name?.split(' ')[0] || 'USER'}${userData?.id || '777'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInvite = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Drowmoney & Earn',
                    text: `Hey! Join Drowmoney using my link and start earning ₹200 per referral easily! 🚀`,
                    url: referralLink,
                });
            } catch (err) {
                console.log('Share failed or cancelled');
            }
        } else {
            // Fallback for desktop: Copy to clipboard
            handleCopy();
            alert("Referral Link Copied! You can now paste and share it on any platform.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in zoom-in-95 duration-700 pb-20">
            {/* Minimal Header */}
            <div className="px-6 pt-12 pb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-800 active:scale-90 transition-all hover:bg-slate-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">SHARE <span className="text-sky-500">& EARN</span></h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">Affiliate Center</p>
                </div>
                <div className="w-12 h-12"></div>
            </div>

            <div className="px-6 space-y-8">
                {/* Main Invite Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-15px_rgba(15,118,110,0.12)] border border-slate-50 relative overflow-hidden group">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-60"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-500 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <Users size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-none">Affiliate Invite</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                                    ₹200 REWARD <CheckCircle2 size={10} className="fill-emerald-50 text-emerald-500" />
                                </p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-pulse">
                            Active
                        </div>
                    </div>

                    {/* Referral Link Box */}
                    <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 mb-8 group-hover:border-sky-300 transition-colors relative z-10">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-black text-slate-400 truncate tracking-tight opacity-80">
                                {referralLink}
                            </p>
                            <button
                                onClick={handleCopy}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 shrink-0
                                    ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-sky-600 border border-sky-100'}`}
                            >
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                    </div>

                    {/* Invite Button */}
                    <button 
                        onClick={handleInvite}
                        className="w-full bg-[#1A1C30] hover:bg-black active:scale-95 text-white font-black uppercase tracking-[0.15em] py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all relative z-10 text-[11px]"
                    >
                        <Send size={18} className="rotate-[-20deg]" />
                        INVITE & EARN NOW
                    </button>
                </div>

                {/* Simplified Bottom Section */}
                <div className="flex flex-col gap-6 pt-4">
                    {/* Small Stat Strip */}
                    <div className="bg-slate-50/50 rounded-full px-6 py-4 flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                <Users size={16} className="text-sky-500" />
                            </div>
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Total Members</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">4 Participants</span>
                    </div>

                    {/* VIEW HISTORY BUTTON */}
                    <button
                        onClick={() => navigate('/user/marketing-history')}
                        className="w-full bg-white border border-slate-100 py-4 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-slate-50 active:scale-95 transition-all group shadow-sm shadow-slate-100/50"
                    >
                        <History size={18} className="text-slate-400 group-hover:text-blue-500" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">VIEW HISTORY</span>
                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-emerald-500 translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </button>

                    {/* Total Earned Section */}
                    <div className="bg-emerald-500 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-emerald-50/50 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 text-white/5 -translate-y-2 translate-x-2">
                            <DollarSign size={80} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-0.5">TOTAL EARNINGS</p>
                            <p className="text-2xl font-black text-white tracking-tighter">₹800.00</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20 relative z-10">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketing;
