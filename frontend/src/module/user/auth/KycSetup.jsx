import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, UploadCloud, Camera, ArrowLeft, AlertCircle, Fingerprint, Lock } from 'lucide-react';
import api from '../../shared/services/api';
import { useUser } from '../context/UserContext';

const KycSetup = () => {
    const navigate = useNavigate();
    const { userData, addNotification, refreshUserProfile, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);
    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = React.useRef(null);

    const kycStatus = (userData?.kycStatus || '').toLowerCase();

    React.useEffect(() => {
        if (userLoading) return;
        if (kycStatus === 'pending') {
            navigate('/user/auth/pending');
        } else if (kycStatus === 'approved' || kycStatus === 'verified') {
            navigate('/user/income');
        }
    }, [kycStatus, navigate, userLoading]);

    React.useEffect(() => {
        if (!aadhaarFile) {
            setPreviewUrl('');
            return;
        }

        const objectUrl = URL.createObjectURL(aadhaarFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [aadhaarFile]);

    if (userLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
        </div>
    );

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const ext = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['jpeg', 'jpg', 'png'];
        
        if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
            setError("Incorrect image format! Please use PNG, JPEG or JPG.");
            addNotification("Invalid Format", "Please select a valid image (JPEG, JPG, or PNG)!", "error");
            e.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File too large! Max limit is 5MB.");
            addNotification("File Too Large", "Aadhaar photo must be under 5MB!", "error");
            e.target.value = '';
            return;
        }

        setAadhaarFile(file);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!aadhaarFile) return addNotification("Error", "Please upload Aadhaar image", "error");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('documentNumber', aadhaar);
        formData.append('document', aadhaarFile);

        try {
            const res = await api.patch('/user/data/kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.success) {
                await refreshUserProfile();
                addNotification("Success", "KYC submitted successfully!", "success");
                navigate('/user/auth/pending');
            }
        } catch (err) {
            console.error(err);
            addNotification("Error", err.message || "Failed to submit KYC", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                    .font-outfit { font-family: 'Outfit', sans-serif; }
                `}
            </style>

            {/* Subtle Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-100 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Top Navigation */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
                <button 
                    onClick={() => navigate('/user/home')} 
                    className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 active:scale-95 transition-all shadow-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-amber-600 tracking-widest uppercase font-outfit">Verification</span>
                </div>
            </div>

            <div className="w-full max-w-[400px] relative z-10">
                {/* Compact Header Section */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 mb-3 shadow-lg shadow-amber-500/20">
                        <Fingerprint size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight font-outfit">Identity Setup</h1>
                    <p className="text-slate-500 text-[11px] font-bold leading-relaxed">
                        Secure your account and unlock withdrawals.
                    </p>
                </div>

                {/* Operating Window Notice (Compact) */}
                <div className="mb-4">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center justify-between shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-outfit">Service Window</span>
                        <span className="text-[10px] font-black text-amber-600 tabular-nums uppercase">07:00 AM — 07:00 PM</span>
                    </div>
                </div>

                {/* Main Card (Compact) */}
                <form 
                    onSubmit={handleSubmit} 
                    className="bg-white p-5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-5"
                >
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-2.5">
                            <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-rose-500 leading-tight">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Aadhaar Number Input */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-slate-400 ml-1 font-outfit">
                                <ShieldCheck size={10} className="text-amber-500" />
                                Aadhaar Card Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                className="w-full bg-slate-50 text-slate-900 font-black tracking-[0.2em] px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all placeholder:text-slate-300 text-base font-outfit"
                                required
                            />
                        </div>
                        
                        {/* Aadhaar Photo Upload (Compact) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-slate-400 ml-1 font-outfit">
                                <UploadCloud size={10} className="text-amber-500" />
                                Document Photo
                            </label>
                            <div 
                                onClick={triggerFileSelect}
                                className="relative border-2 border-dashed border-slate-100 hover:border-amber-500/40 rounded-2xl p-1.5 bg-slate-50/50 transition-all cursor-pointer group"
                            >
                                {!aadhaarFile ? (
                                    <div className="py-6 flex flex-col items-center justify-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-amber-500 transition-all shadow-sm">
                                            <UploadCloud size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Select Photo</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">PNG, JPEG (Max 5MB)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-xl">
                                                <Camera size={20} />
                                            </div>
                                            <span className="text-[9px] text-white font-black uppercase tracking-widest mt-2">Change Image</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Footnote (Compact) */}
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-center">
                        <Lock size={12} className="text-emerald-500 shrink-0" />
                        <p className="text-[9px] text-emerald-700 leading-snug font-bold">
                            Encrypted Storage. Your data is private and secure.
                        </p>
                    </div>

                    <button 
                        type="submit"
                        disabled={aadhaar.length < 12 || !aadhaarFile || loading}
                        className="w-full bg-[#0F172A] hover:bg-slate-800 disabled:opacity-30 text-white font-black uppercase text-[11px] tracking-[0.15em] py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-200 font-outfit"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Finalize Verification'}
                    </button>
                </form>

                {/* Compact Footer */}
                <p className="text-center mt-6 text-[10px] font-bold text-slate-400">
                    Questions? <button type="button" onClick={() => navigate('/user/help')} className="text-amber-600 hover:underline">Contact Support</button>
                </p>
            </div>

            {/* Hidden Input */}
            <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default KycSetup;
