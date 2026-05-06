import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck, XCircle, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const PendingApproval = () => {
    const navigate = useNavigate();
    const { userData, refreshUserProfile, loading: userLoading } = useUser();
    const status = (userData.kycStatus || 'pending').toLowerCase();

    useEffect(() => {
        if (userLoading) return;
        if (status === 'approved' || status === 'verified') {
            // Auto-redirect to income after a small success display
            setTimeout(() => {
                navigate('/user/income');
            }, 3000);
        } else if (status === 'not started') {
            navigate('/user/auth/kyc');
        }
    }, [status, navigate, userLoading]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'pending') refreshUserProfile();
        }, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, [status, refreshUserProfile]);

    if (userLoading) return <div className="min-h-screen bg-[#0B1221] flex items-center justify-center p-20 text-white"><Clock className="animate-spin text-amber-500" /></div>;

    return (
        <div className="min-h-screen bg-[#0B1221] text-white p-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="relative mb-8 mt-4">
                <div className={`w-28 h-28 bg-slate-900 border-2 border-dashed ${status === 'pending' ? 'border-amber-500/50' : status === 'rejected' ? 'border-red-500/50' : 'border-emerald-500'} rounded-full flex items-center justify-center z-10 relative`}>
                    {status === 'pending' ? (
                        <div className="relative flex items-center justify-center w-full h-full">
                            <Clock size={40} className="text-amber-500" />
                            <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-ping"></div>
                        </div>
                    ) : status === 'rejected' ? (
                        <XCircle size={48} className="text-red-500" />
                    ) : (
                         <CheckCircle2 size={48} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    )}
                </div>
                {/* Small badged icon overlapping */}
                <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2.5 rounded-full border border-slate-800 z-20">
                    <ShieldCheck size={20} className={status === 'pending' ? 'text-slate-400' : 'text-emerald-500'} />
                </div>
            </div>

            <h1 className="text-[26px] font-black text-white mb-3 tracking-tight leading-tight px-4">
                {status === 'pending' ? 'Verification Pending' : status === 'rejected' ? 'Verification Failed' : 'Account Verified'}
            </h1>
            
            <p className="text-slate-400 text-[12px] mb-12 max-w-[260px] leading-relaxed font-bold">
                {status === 'pending' 
                    ? "Your identity documents are under rigorous review by our Admin Team. You will receive an SMS upon approval."
                    : status === 'rejected'
                    ? `Reason: ${userData.kycRejectionReason || "Documents are not clear or mismatched."}`
                    : "Your documents have been verified. You now have full access to the earning platform."}
            </p>

            {status === 'pending' ? (
                <div className="w-full flex flex-col items-center gap-4">
                    <button 
                        disabled 
                        className="w-full max-w-[260px] bg-slate-900 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-xl cursor-not-allowed border border-slate-800 shadow-inner"
                    >
                        Awaiting Admin Action
                    </button>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Usually takes 2-4 hours</p>
                </div>
            ) : status === 'rejected' ? (
                <button 
                    onClick={() => navigate('/user/auth/kyc')}
                    className="w-full max-w-[260px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-2"
                >
                    Resubmit KYC <ChevronRight size={14} />
                </button>
            ) : (
                <button 
                    onClick={() => navigate('/user/home')}
                    className="w-full max-w-[260px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-xl shadow-[0_0_25px_rgba(14,165,233,0.3)] transition-all active:scale-95"
                >
                    Enter Platform
                </button>
            )}


        </div>
    );
};

export default PendingApproval;
