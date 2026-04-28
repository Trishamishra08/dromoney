import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { CreditCard, Wallet as WalletIcon, IndianRupee, ArrowUpRight, ArrowDownLeft, History, Filter, AlertCircle, Sparkles, Coins, TrendingUp } from 'lucide-react';
import UnlockModal from '../components/UnlockModal';

const Wallet = () => {
    const { userData, requestWithdrawal, addNotification } = useUser();
    const { wallet, coins, name, isPaid } = userData;
    const [activeTab, setActiveTab] = useState('cash'); // 'cash' or 'coins'
    const [amount, setAmount] = useState('');
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [filter, setFilter] = useState('All'); // 'All', 'Earning', 'Payout'

    const handleWithdraw = () => {
        if (!isPaid) {
            setIsUnlockOpen(true);
            return;
        }

        const val = parseFloat(amount);
        if (isNaN(val) || val < 500) {
            addNotification("Invalid Amount", "Minimum withdrawal is ₹500.", "warning");
            return;
        }

        if (val > wallet.balance) {
            addNotification("Insufficient Balance", "You don't have enough balance.", "warning");
            return;
        }

        const success = requestWithdrawal(val);
        if (success) {
            setAmount('');
            addNotification("Success", "Withdrawal requested successfully.", "success");
        }
    };

    const filteredTransactions = activeTab === 'cash' 
        ? wallet.transactions.filter(tx => {
            if (filter === 'Earning') return tx.type === 'credit';
            if (filter === 'Payout') return tx.type === 'withdrawal';
            return true;
        })
        : coins.history.filter(tx => {
            if (filter === 'Earning') return tx.type === 'credit';
            if (filter === 'Payout') return tx.type === 'debit';
            return true;
        });

    return (
        <div className="flex flex-col gap-5 p-4 animate-in fade-in duration-700 min-h-screen">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />

            {/* --- Switcher Tabs --- */}
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 shadow-sm mx-1">
                <button 
                    onClick={() => { setActiveTab('cash'); setFilter('All'); }}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all ${activeTab === 'cash' ? 'bg-white text-sky-600 shadow-md shadow-slate-200' : 'text-slate-400 font-bold'}`}
                >
                    <IndianRupee size={16} />
                    <span className="text-[10px] uppercase font-black tracking-widest leading-none">Cash Balance</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('coins'); setFilter('All'); }}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all ${activeTab === 'coins' ? 'bg-white text-amber-500 shadow-md shadow-slate-200' : 'text-slate-400 font-bold'}`}
                >
                    <Coins size={16} />
                    <span className="text-[10px] uppercase font-black tracking-widest leading-none">Coin Wallet</span>
                </button>
            </div>

            {/* --- Balance Display (Conditional) --- */}
            {activeTab === 'cash' ? (
                /* --- Original Card Style (Cash) --- */
                <div className="relative rounded-2xl p-5 shadow-2xl overflow-hidden group bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 mt-2 animate-in slide-in-from-top duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 opacity-90">
                                <div className="w-7 h-5 bg-white/20 rounded border border-white/30 flex items-center justify-center">
                                    <Sparkles size={10} className="text-white" />
                                </div>
                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">Virtual Card</span>
                            </div>
                            <CreditCard size={20} className="text-white/60" />
                        </div>

                        <div className="mt-1">
                            <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                                <WalletIcon size={12} /> Net Available Balance
                            </p>
                            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-0.5 transition-transform group-hover:scale-[1.02]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                <IndianRupee size={24} className="translate-y-0.5 opacity-80" />
                                {Number(wallet.balance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </h2>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-1">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black mb-0.5">Card Holder</p>
                                <p className="font-extrabold text-white text-[11px] tracking-widest uppercase">{name || 'USER'}</p>
                            </div>
                            <div className="bg-white/20 px-2 py-1 rounded text-[8px] font-black text-white/80 uppercase tracking-tighter">Verified</div>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- Gold Card Style (Coins) --- */
                <div className="relative rounded-2xl p-5 shadow-2xl overflow-hidden group bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 mt-2 animate-in slide-in-from-top duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 opacity-90">
                                <div className="w-7 h-5 bg-white/20 rounded border border-white/30 flex items-center justify-center">
                                    <Coins size={10} className="text-white" />
                                </div>
                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">Reward Pool</span>
                            </div>
                            <Sparkles size={20} className="text-white/60" />
                        </div>

                        <div className="mt-1">
                            <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                                <Coins size={12} /> Total Digital Coins
                            </p>
                            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2 transition-transform group-hover:scale-[1.02]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                <div className="bg-white/20 p-1 rounded-lg border border-white/20">
                                    <Coins size={20} className="text-white" />
                                </div>
                                {coins.total.toLocaleString()}
                            </h2>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-1">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black mb-0.5">Asset Status</p>
                                <p className="font-extrabold text-white text-[11px] tracking-widest uppercase">Verified Earner</p>
                            </div>
                            <div className="bg-white/20 px-2 py-1 rounded text-[8px] font-black text-white/80 uppercase tracking-tighter">PLATINUM</div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Withdrawal Section (Only for Cash) --- */}
            {activeTab === 'cash' && (
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden animate-in fade-in duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                        <ArrowUpRight size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-4">
                            <h3 className="text-base font-black text-slate-800 tracking-tight leading-none">Instant Transfer</h3>
                            <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Withdraw cash to bank</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="relative flex items-center">
                                <div className="absolute left-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <IndianRupee size={16} className="text-sky-600" strokeWidth={3} />
                                </div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter Amount (Min. ₹500)"
                                    className="w-full bg-slate-50 border border-slate-100/50 rounded-2xl py-4.5 pl-16 pr-4 text-[15px] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-bold focus:outline-none focus:bg-white focus:border-sky-500 transition-all shadow-inner"
                                />
                            </div>

                            <button
                                onClick={handleWithdraw}
                                className={`w-full py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 
                                    ${amount >= 500 && amount <= wallet.balance
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-black active:scale-95'
                                        : 'bg-slate-50 border border-slate-100 text-slate-300 pointer-events-none'}`}
                            >
                                REQUEST WITHDRAWAL <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Unified Transaction Ledger --- */}
            <div className="mt-1 flex-1">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                        {activeTab === 'cash' ? <History size={18} className="text-sky-500" /> : <TrendingUp size={18} className="text-amber-500" />}
                        {activeTab === 'cash' ? 'Cash Ledger' : 'Coin History'}
                    </h3>

                    {/* Filter Segmented Control */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                        {['All', activeTab === 'cash' ? 'Earning' : 'Tasks', activeTab === 'cash' ? 'Payout' : 'Spent'].map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(['All', 'Earning', 'Payout'][idx])}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${filter === ['All', 'Earning', 'Payout'][idx] ? 'bg-white text-slate-900 shadow-sm shadow-slate-200' : 'text-slate-400 opacity-60'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 pb-24">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-slate-100 border-dashed rounded-[2.5rem]">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-50">
                                <Filter size={28} className="text-slate-200" />
                            </div>
                            <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">No Records Found</h4>
                        </div>
                    ) : (
                        filteredTransactions.map((tx, index) => (
                            <div key={tx.id} style={{ animationDelay: `${index * 50}ms` }} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between group animate-in slide-in-from-bottom duration-500 fill-mode-both relative active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                            (tx.type === 'withdrawal' || tx.type === 'debit') ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-sky-50 text-sky-500 border-sky-100'
                                        }`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={22} strokeWidth={3} /> : <ArrowUpRight size={22} strokeWidth={3} />}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-black text-slate-900 leading-tight mb-1">{tx.title || tx.source}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60 leading-none">{tx.date}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-[15px] font-black tracking-tighter leading-none ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}{activeTab === 'cash' ? '₹' : ''}{Number(tx.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })} {activeTab === 'coins' ? 'C' : ''}
                                    </p>
                                    {activeTab === 'cash' && (
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-lg tracking-widest uppercase inline-block mt-2 ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {tx.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
