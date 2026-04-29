import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
    Users, Copy, Send, ChevronLeft,
    History, CheckCircle2, Share2, ArrowUpRight, Wallet
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
            handleCopy();
            alert("Referral Link Copied!");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f0f4f9] font-sans pb-20">
            {/* ── Compact Header ── */}
            <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 active:scale-95 transition-all">
                        <ChevronLeft size={22} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-[16px] font-bold text-slate-800 tracking-tight leading-none">Affiliate Center</h1>
                        <p className="text-[9px] font-bold text-sky-600 uppercase tracking-widest mt-0.5">Share & Earn</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 border border-emerald-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-2 space-y-2">
                {/* ── Main Invite Card (Fintech Style) ── */}
                <div className="bg-white border-b border-slate-100 p-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 bg-blue-600 rounded-none flex items-center justify-center text-white shadow-lg">
                            <Users size={22} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-slate-800 leading-tight">Affiliate Program</h3>
                            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mt-1 flex items-center gap-1">
                                ₹200 Reward per referral <CheckCircle2 size={10} className="text-emerald-500" />
                            </p>
                        </div>
                    </div>

                    {/* Referral Link Box */}
                    <div className="bg-slate-50 border border-slate-200 p-1 pl-4 flex items-center justify-between gap-3 mb-4">
                        <p className="text-[11px] font-medium text-slate-500 truncate tracking-tight">
                            {referralLink}
                        </p>
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shrink-0
                                ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600 border-l border-slate-200'}`}
                        >
                            {copied ? 'COPIED' : 'COPY'}
                        </button>
                    </div>

                    <button 
                        onClick={handleInvite}
                        className="w-full bg-[#1e293b] hover:bg-black active:scale-95 text-white font-bold uppercase tracking-widest py-3.5 rounded-none flex items-center justify-center gap-2.5 transition-all text-[11px] shadow-md"
                    >
                        <Send size={16} className="rotate-[-20deg]" />
                        INVITE & EARN NOW
                    </button>
                </div>

                {/* ── Stats Strip ── */}
                <div className="bg-white border-y border-slate-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center">
                            <Users size={16} className="text-blue-500" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Total Members</span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900">4 Participants</span>
                </div>

                {/* ── Earnings Section (Payment Style) ── */}
                <div className="bg-white border-y border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Total Affiliate Earnings</span>
                            <h4 className="text-2xl font-bold text-slate-800 tracking-tighter">₹800.00</h4>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <Wallet size={20} />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/user/marketing-history')}
                        className="w-full bg-slate-50 border border-slate-200 py-3 flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-95 transition-all group"
                    >
                        <History size={16} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Transaction History</span>
                        <ArrowUpRight size={14} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </button>
                </div>

                {/* ── Information Strip ── */}
                <div className="px-5 py-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h5 className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">How it works</h5>
                        <p className="text-[10px] font-medium text-blue-600 leading-relaxed">
                            Share your referral link with friends. When they join and verify their account, you instantly receive ₹200 in your wallet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketing;
