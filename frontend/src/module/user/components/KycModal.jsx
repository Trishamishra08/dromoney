import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Clock, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const KycModal = ({ isOpen, onClose }) => {
    const { userData } = useUser();
    const status = (userData?.kycStatus || 'Not Started').toLowerCase();

    if (!isOpen) return null;

    // --- Dynamic UI Config based on status ---
    const config = {
        approved: {
            title: 'KYC Verified',
            subtitle: 'Account is 100% secure',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            iconBg: 'bg-emerald-100 text-emerald-500',
            icon: ShieldCheck,
            buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
            statusText: 'Verified'
        },
        pending: {
            title: 'Under Review',
            subtitle: 'Expect update within 24 hours',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            iconBg: 'bg-amber-100 text-amber-500',
            icon: Clock,
            buttonBg: 'bg-amber-500 hover:bg-amber-600',
            statusText: 'Pending'
        },
        rejected: {
            title: 'KYC Rejected',
            subtitle: 'Aadhaar photo was not clear',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            iconBg: 'bg-rose-100 text-rose-500',
            icon: AlertCircle,
            buttonBg: 'bg-rose-500 hover:bg-rose-600',
            statusText: 'Rejected'
        }
    }[status] || {
        title: 'KYC Required',
        subtitle: 'Complete KYC to withdraw funds',
        bg: 'bg-slate-50',
        border: 'border-slate-100',
        iconBg: 'bg-slate-100 text-slate-400',
        icon: ShieldCheck,
        buttonBg: 'bg-slate-900 hover:bg-black',
        statusText: 'Not Started'
    };

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            
            <div className={`relative bg-white w-full max-w-xs rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border ${config.border}`}>
                <div className={`p-6 ${config.bg} border-b ${config.border} flex justify-between items-start`}>
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 ${config.iconBg} rounded-2xl flex items-center justify-center shadow-inner`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg tracking-tight leading-tight">{config.title}</h3>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mt-0.5">{config.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="p-3">
                    <div className="p-5 flex items-center justify-between bg-slate-50/50 rounded-3xl mx-1 my-1 border border-black/[0.03]">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-black/[0.03]">
                                <FileText className="text-slate-400" size={18} />
                            </div>
                            <div>
                                <span className="font-bold text-slate-800 text-[13px]">Identity Verification</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Aadhaar Authentication</p>
                            </div>
                        </div>
                        {status === 'approved' ? (
                            <CheckCircle2 size={20} className="text-emerald-500" strokeWidth={3} />
                        ) : status === 'pending' ? (
                            <Clock size={20} className="text-amber-500 animate-pulse" />
                        ) : (
                            <AlertCircle size={20} className="text-rose-400" />
                        )}
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-50">
                    <button onClick={onClose} className={`w-full py-4 ${config.buttonBg} text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2`}>
                        {status === 'approved' ? 'Great, Close' : 'Understood'} <Icon size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KycModal;
