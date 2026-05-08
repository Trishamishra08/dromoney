import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import AdminStatCard from '../components/AdminStatCard';
import { Wallet, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import api from '../../shared/services/api';

const Wallets = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    
    // Toast state
    const [toast, setToast] = useState(null); // { message: '', type: 'success' | 'error' }

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/withdrawals');
            if (response.success) {
                const data = response.data.map(w => ({
                    id: w._id,
                    user: w.user?.name || 'Unknown',
                    walletBalance: w.user?.wallet?.balance || 0, // Extracting the balance
                    amount: `₹${w.amount}`,
                    method: w.paymentMethod || w.method || 'UPI',
                    upiId: w.upiId,
                    bankDetails: w.bankDetails,
                    date: new Date(w.createdAt).toLocaleDateString(),
                    status: w.status
                }));
                setList(data);
                
                // Calculate simple stats
                const s = { total: 0, approved: 0, pending: 0, rejected: 0 };
                response.data.forEach(x => {
                    s.total += x.amount;
                    if (x.status === 'Approved') s.approved += x.amount;
                    if (x.status === 'Pending') s.pending += x.amount;
                    if (x.status === 'Rejected') s.rejected += x.amount;
                });
                setStats(s);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const response = await api.put(`/admin/withdrawals/${id}`, { status });
            if (response.success) {
                showToast(`Withdrawal status updated to ${status} successfully!`, 'success');
                fetchWithdrawals();
            }
        } catch (err) {
            showToast(err.message || "Something went wrong", 'error');
        }
    };

    const approve = id => handleAction(id, 'Approved');
    const reject = id => handleAction(id, 'Rejected');

    const openBalanceModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <div className="p-6 animate-in fade-in duration-500 relative">
            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
                    toast.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                        : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-semibold">{toast.message}</span>
                </div>
            )}

            <PageHeader title="Wallet & Withdrawals" subtitle="Review and process withdrawal requests" />

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <AdminStatCard label="Total Value" value={`₹${stats.total}`} change={`${list.length} requests`} icon={Wallet} color="bg-slate-700" />
                <AdminStatCard label="Approved" value={`₹${stats.approved}`} change="Success" icon={IndianRupee} color="bg-emerald-500" />
                <AdminStatCard label="Pending" value={`₹${stats.pending}`} change="Awaiting" icon={Clock} color="bg-amber-500" />
                <AdminStatCard label="Rejected" value={`₹${stats.rejected}`} change="Declined" icon={AlertCircle} color="bg-rose-500" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                {['ID', 'User', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {list.map(w => (
                                <tr key={w.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-5 py-4 text-[12px] font-black text-sky-600">{w.id}</td>
                                    <td className="px-5 py-4 font-black text-slate-800 text-[13px]">{w.user}</td>
                                    <td className="px-5 py-4 font-black text-slate-900">{w.amount}</td>
                                    <td className="px-5 py-4">
                                        <p className="text-[12px] font-bold text-slate-600">{w.method}</p>
                                        {w.bankDetails ? (
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                                                <p>A/C: <span className="font-bold text-slate-700">{w.bankDetails.accountNumber}</span></p>
                                                <p>IFSC: {w.bankDetails.ifscCode}</p>
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-medium text-slate-400">{w.upiId || 'N/A'}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[12px] font-bold text-slate-400">{w.date}</td>
                                    <td className="px-5 py-4"><StatusBadge status={w.status} /></td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            {/* Wallet Icon for Balance Popup */}
                                            <button 
                                                onClick={() => openBalanceModal(w)}
                                                className="w-7 h-7 bg-amber-50 hover:bg-amber-100 text-amber-500 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-amber-100"
                                                title="View Wallet Balance"
                                            >
                                                <Wallet size={13} />
                                            </button>

                                            <button className="w-7 h-7 bg-sky-50 hover:bg-sky-100 text-sky-500 rounded-lg flex items-center justify-center transition-colors"><Eye size={13} /></button>
                                            
                                            {w.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => approve(w.id)} className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 text-emerald-500 rounded-lg flex items-center justify-center transition-colors"><CheckCircle size={13} /></button>
                                                    <button onClick={() => reject(w.id)} className="w-7 h-7 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center transition-colors"><XCircle size={13} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Wallet Balance Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-inner">
                                <Wallet size={32} className="text-amber-500" />
                            </div>
                            
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{selectedUser?.user}'s Account</h3>
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center justify-center gap-2">
                                <span className="text-slate-300 text-xl font-bold">₹</span>
                                {selectedUser?.walletBalance?.toLocaleString()}
                            </h2>
                            
                            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Withdrawal</span>
                                    <span className="text-xs font-black text-rose-500">{selectedUser?.amount}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-full bg-[#0F172A] text-white py-4 rounded-[22px] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
                            >
                                Close Balance View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallets;
