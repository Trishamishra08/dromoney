import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
    CreditCard, Wallet as WalletIcon, IndianRupee, ArrowUpRight, 
    ArrowDownLeft, History, Filter, AlertCircle, Sparkles, Coins, 
    TrendingUp, ChevronRight, CheckCircle2, Share2, Info, ArrowRightLeft
} from 'lucide-react';
import UnlockModal from '../components/UnlockModal';
import api from '../../shared/services/api';

const Wallet = () => {
    const navigate = useNavigate();
    const { userData, requestWithdrawal, addNotification, refreshUserProfile } = useUser();
    const { wallet, coins, name, isPaid } = userData;
    const [activeTab, setActiveTab] = useState('cash'); // 'cash' or 'coins'
    const [amount, setAmount] = useState('');
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [filter, setFilter] = useState('All'); // 'All', 'Earning', 'Payout'
    const [minWithdrawal, setMinWithdrawal] = useState(100);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Fetch dynamic minWithdrawal from settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/public/settings');
                if (res.success && res.data) {
                    setMinWithdrawal(Number(res.data.minWithdrawal) || 100);
                }
            } catch (err) {
                console.error("Failed to load wallet settings:", err);
            } finally {
                setLoadingSettings(false);
            }
        };
        fetchSettings();
    }, []);

    const handleWithdraw = async () => {
        if (!isPaid) {
            setIsUnlockOpen(true);
            return;
        }

        const val = parseFloat(amount);
        if (isNaN(val) || val < minWithdrawal) {
            addNotification("Invalid Amount", `Minimum withdrawal is ₹${minWithdrawal}.`, "warning");
            return;
        }

        // Check for 24-hour limit on client side
        const hasRecentWithdrawal = wallet.transactions && wallet.transactions.some(tx => {
            if (tx.type !== 'withdrawal') return false;
            const txDate = new Date(tx.date);
            const now = new Date();
            const diffTime = Math.abs(now - txDate);
            const diffHours = diffTime / (1000 * 60 * 60);
            return diffHours < 24;
        });

        if (hasRecentWithdrawal) {
            addNotification("Limit Exceeded", "You can only withdraw once every 24 hours.", "warning");
            return;
        }

        // Add ₹5 transition fee
        const totalDeduction = val + 5;

        if (totalDeduction > wallet.balance) {
            addNotification(
                "Insufficient Balance", 
                `You need ₹${totalDeduction} (₹${val} amount + ₹5 fee) to complete this transaction.`, 
                "warning"
            );
            return;
        }

        const res = await requestWithdrawal(val);
        if (res.success) {
            setAmount('');
            addNotification("Success", "Withdrawal requested successfully.", "success");
            await refreshUserProfile(); // Refresh user profile to update wallet balance
        } else {
            addNotification("Withdrawal Denied", res.message, "error");
        }
    };

    const filteredTransactions = activeTab === 'cash' 
        ? (wallet.transactions || []).filter(tx => {
            if (filter === 'Earning') return tx.type === 'credit';
            if (filter === 'Payout') return tx.type === 'withdrawal';
            return true;
        })
        : (coins.history || []).filter(tx => {
            if (filter === 'Earning') return tx.type === 'credit';
            if (filter === 'Payout') return tx.type === 'debit';
            return true;
        });

    return (
        <div className="flex flex-col gap-2.5 p-3 animate-in fade-in duration-700 min-h-screen bg-[#f8fafc] font-sans">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />

            {/* --- Compact Switcher --- */}
            <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200/50">
                <button 
                    onClick={() => { setActiveTab('cash'); setFilter('All'); }}
                    className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'cash' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 font-bold'}`}
                >
                    <IndianRupee size={14} />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Cash</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('coins'); setFilter('All'); }}
                    className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'coins' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 font-bold'}`}
                >
                    <Coins size={14} />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Coins</span>
                </button>
            </div>

            {/* --- My Cards Heading --- */}
            <div className="flex items-center justify-between px-1 mt-0.5">
                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">My Cards</h2>
                <div className="flex gap-1 opacity-30">
                    <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                </div>
            </div>

            <div className="relative rounded-xl p-4.5 shadow-lg overflow-hidden group bg-gradient-to-br from-[#0f1d3a] via-[#1a2c52] to-[#0f1d3a] transition-all duration-500">
                <div className="absolute top-0 right-0 w-[150%] h-[150%] border-[25px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-[145px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">{activeTab === 'cash' ? 'Cash Account' : 'Coin Assets'}</span>
                        <div className="flex relative items-center">
                            <div className="w-5.5 h-5.5 bg-white/20 rounded-full"></div>
                            <div className="w-5.5 h-5.5 bg-white/40 rounded-full -ml-2.5"></div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2.5 text-white/80 font-mono tracking-[0.1em] text-[13px]">
                             <span>••••</span> <span>••••</span> <span>••••</span> <span>5222</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-1">
                            {activeTab === 'cash' ? <IndianRupee size={18} className="opacity-80" /> : <Coins size={18} className="opacity-80" />}
                            {activeTab === 'cash' ? Number(wallet.balance).toFixed(2) : coins.total.toLocaleString()}
                        </h2>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <p className="text-[6.5px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Card Holder</p>
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">{name || 'USER'}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[6.5px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Expires</p>
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">07/27</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Refer & Earn Promo --- */}
            <div 
                onClick={() => navigate('/user/marketing')}
                className="bg-emerald-50 border border-emerald-100 rounded-lg p-3.5 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <Share2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-black text-emerald-900 uppercase tracking-tight leading-none mb-1">Refer & Earn</h4>
                        <p className="text-[9px] font-bold text-emerald-600/70">Get ₹200 for every friend!</p>
                    </div>
                </div>
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Invite
                </div>
            </div>

            {/* --- Withdrawal Section --- */}
            {activeTab === 'cash' && (
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    {/* Header with Fee Information */}
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ArrowRightLeft size={14} className="text-blue-500" />
                            Withdraw Cash
                        </h3>
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                            ₹5 Fee Added
                        </span>
                    </div>

                    {/* Dynamic Fee & Deduction Previewer */}
                    {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-1.5 animate-in slide-in-from-top-1 duration-300">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                <span>Requested Amount:</span>
                                <span className="text-slate-800">₹{parseFloat(amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                <span>Transaction Fee:</span>
                                <span className="text-amber-600">+ ₹5.00</span>
                            </div>
                            <div className="border-t border-slate-200/60 pt-1.5 flex justify-between items-center text-[11px] font-extrabold text-slate-800">
                                <span>Total Deducted from Wallet:</span>
                                <span className="text-blue-600">₹{(parseFloat(amount) + 5).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2.5">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Amount (Min. ₹${minWithdrawal})`}
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-3.5 text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                        />
                        
                        {/* 24-Hour Policy Alert Line (Highly Visible) */}
                        <div className="bg-amber-50/50 border border-amber-100/70 p-2.5 rounded-lg flex items-start gap-2.5">
                            <Info size={13} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[9px] font-bold text-amber-800 leading-normal">
                                नोट: आप 24 घंटे में केवल एक बार ही निकासी (withdraw) कर सकते हैं।
                            </p>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            className={`w-full py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                ${(!isPaid) || (amount >= minWithdrawal && (Number(amount) + 5) <= wallet.balance)
                                    ? 'bg-[#1a233b] hover:bg-black text-white shadow-md active:scale-95 cursor-pointer'
                                    : 'bg-slate-50 text-slate-300 pointer-events-none border border-slate-100'}`}
                        >
                            {isPaid ? 'Withdraw Now' : 'Unlock to Withdraw'}
                        </button>
                    </div>
                </div>
            )}

            {/* --- Wallet Actions --- */}
            <div className="px-1 mt-1">
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Settings</h3>
            </div>
            
            <div className="flex flex-col gap-2">
                {[
                    { id: 'withdraw', title: 'Instant Withdrawals', subtitle: 'Transfer to bank', icon: <ArrowUpRight size={16} className="text-blue-500" /> },
                    { id: 'refer', title: 'Referral Rewards', subtitle: 'Earn commission', icon: <Share2 size={16} className="text-emerald-500" /> },
                    { id: 'limits', title: 'Transfer Limits', subtitle: 'Daily cap', icon: <Filter size={16} className="text-indigo-500" />, check: true },
                    { id: 'security', title: 'Security', subtitle: 'Encrypted', icon: <AlertCircle size={16} className="text-sky-500" />, check: true },
                ].map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => item.id === 'refer' ? navigate('/user/marketing') : null}
                        className="bg-white border border-slate-100 rounded-lg p-2.5 flex items-center justify-between shadow-sm active:bg-slate-50 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-md flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-800 leading-tight">{item.title}</h4>
                                <p className="text-[9px] font-medium text-slate-400">{item.subtitle}</p>
                            </div>
                        </div>
                        {item.check ? (
                            <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={10} className="text-white" />
                            </div>
                        ) : (
                            <ChevronRight size={14} className="text-slate-300" />
                        )}
                    </div>
                ))}
            </div>

            {/* --- Info Note --- */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex gap-2.5 items-start">
                 <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                 <p className="text-[8.5px] font-medium text-slate-500 leading-relaxed">
                    Domestic transfers use UPI/Bank. Global payouts take 3-5 days.
                 </p>
            </div>

            {/* --- Transactions --- */}
            <div className="mt-1">
                <div className="flex items-center justify-between mb-2.5 px-1">
                    <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <History size={14} className="text-blue-500" /> History
                    </h3>
                    <div className="flex bg-slate-200/50 p-0.5 rounded-md border border-slate-200/50">
                        {['All', activeTab === 'cash' ? 'In' : 'Tasks', activeTab === 'cash' ? 'Out' : 'Spent'].map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(['All', 'Earning', 'Payout'][idx])}
                                className={`px-2.5 py-1 rounded-[4px] text-[8px] font-bold uppercase tracking-wider transition-all ${filter === ['All', 'Earning', 'Payout'][idx] ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 pb-24">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-slate-100 border-dashed rounded-lg">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Records</p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx, index) => (
                            <div key={tx.id || index} className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between transition-all active:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-md flex items-center justify-center border ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={16} strokeWidth={3} /> : <ArrowUpRight size={16} strokeWidth={3} />}
                                    </div>
                                    <div>
                                        <h4 className="text-[11.5px] font-bold text-slate-800 leading-tight">{tx.title || tx.source}</h4>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                            {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[13px] font-bold tracking-tighter ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}{activeTab === 'cash' ? '₹' : ''}{Number(tx.amount).toFixed(2)}
                                    </p>
                                    {activeTab === 'cash' && (
                                        <span className={`text-[7px] font-bold px-1 py-0.5 rounded tracking-widest uppercase inline-block mt-1 ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
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
