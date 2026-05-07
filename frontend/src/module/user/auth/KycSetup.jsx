import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, UploadCloud, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import api from '../../shared/services/api';
import { useUser } from '../context/UserContext';

const KycSetup = () => {
    const navigate = useNavigate();
    const { userData, addNotification, refreshUserProfile, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);
    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
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

        // Cleanup the object URL when file changes or component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    }, [aadhaarFile]);

    if (userLoading) return <div className="min-h-screen bg-[#0B1221] flex items-center justify-center p-20 text-white"><Loader2 className="animate-spin text-amber-500" /></div>;

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Front-end early validation of allowed image types to prevent stuck state
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            addNotification("Invalid Format", "Please select a valid image (JPEG, JPG, or PNG)!", "error");
            e.target.value = '';
            return;
        }

        // Limit to 5MB
        if (file.size > 5 * 1024 * 1024) {
            addNotification("File Too Large", "Aadhaar photo must be under 5MB!", "error");
            e.target.value = '';
            return;
        }

        setAadhaarFile(file);
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
        <div className="min-h-screen bg-[#0B1221] text-white p-6 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative pt-16">
            {/* Arrow Back Button */}
            <div className="absolute left-6 top-6 z-50">
                <button 
                    onClick={() => navigate('/user/home')} 
                    className="w-10 h-10 flex items-center justify-center bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-300 hover:text-white hover:border-amber-500/50 active:scale-95 transition-all shadow-md backdrop-blur-md"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="flex justify-center mb-6">
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <ShieldAlert size={12} className="text-amber-500" />
                    <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase">Verification Required</span>
                </div>
            </div>

            <h1 className="text-[24px] font-black text-white text-center mb-2 tracking-tight">Complete KYC</h1>
            <p className="text-slate-400 text-[11px] text-center mb-8 px-4 font-bold leading-relaxed">Provide your government IDs to verify identity and enable withdrawals.</p>

            {/* Hidden Input outside the clickable card to avoid any event bubbling recursion */}
            <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
            />

            <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-amber-500/20 p-5 rounded-2xl flex flex-col gap-5 shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Aadhaar Card Number</label>
                    <input 
                        type="text" 
                        placeholder="XXXX XXXX XXXX"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="w-full bg-slate-950 text-white font-black tracking-[0.2em] px-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600 text-sm placeholder:tracking-normal placeholder:font-normal shadow-inner"
                        required
                    />
                    
                    {/* Aadhaar Photo Upload */}
                    <div 
                        onClick={triggerFileSelect}
                        className="mt-3 relative border-2 border-dashed border-slate-700/50 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/30 transition-colors cursor-pointer group"
                    >
                        {!aadhaarFile ? (
                            <>
                                <UploadCloud size={20} className="text-slate-500 group-hover:text-amber-500 mb-2 transition-colors" />
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-1">Tap to Upload Aadhaar</span>
                                <span className="text-[8px] text-slate-600 mt-1 uppercase tracking-widest">PNG, JPEG, JPG up to 5MB</span>
                            </>
                        ) : (
                            <div className="relative w-full h-28 rounded-lg overflow-hidden group-hover:opacity-80 transition-opacity border border-slate-700/50">
                                <img 
                                    src={previewUrl} 
                                    alt="Aadhaar Preview" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon size={20} className="text-white mb-1" />
                                    <span className="text-[9px] text-emerald-400 font-bold truncate max-w-[200px] px-2">{aadhaarFile.name}</span>
                                    <span className="text-[8px] text-slate-300 uppercase tracking-widest mt-1">Tap to change</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Removed PAN Card Section */}

                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl mt-2">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold text-center">
                        <span className="text-emerald-400">Secure 256-bit Encryption.</span><br/>
                        Documents are sent directly to the Admin Panel for manual verification. This maintains a safe and fraud-free platform.
                    </p>
                </div>

                <button 
                    type="submit"
                    disabled={aadhaar.length < 12 || !aadhaarFile || loading}
                    className="w-full bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 disabled:opacity-50 disabled:bg-slate-900 disabled:text-slate-600 font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_15px_rgba(245,158,11,0.1)]"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Document'}
                </button>
            </form>
        </div>
    );
};

export default KycSetup;
