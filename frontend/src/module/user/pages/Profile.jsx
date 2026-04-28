import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../../shared/services/api';
import { User, ShieldCheck, Rocket, Zap, MessageCircle, LogOut, ChevronRight, Copy, Share2, Plus, Sparkles, Headset, MessageSquare } from 'lucide-react';
import UnlockModal from '../components/UnlockModal';
import PaymentModal from '../components/PaymentModal';
import KycModal from '../components/KycModal';
import ReferralsModal from '../components/ReferralsModal';
import ContactModal from '../components/ContactModal';
import FeedbackModal from '../components/FeedbackModal';

const Profile = () => {
    const navigate = useNavigate();
    const { userData, addNotification, upgradeBooster, updateProfileImage, logout } = useUser();
    const { name, id, referrals, isBoosterActive, isPaid, profileImage, kycStatus } = userData;
    const [isUploading, setIsUploading] = useState(false);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [paymentConfig, setPaymentConfig] = useState({ isOpen: false, plan: '', amount: 0 });
    const [isKycOpen, setIsKycOpen] = useState(false);
    const [isReferralsOpen, setIsReferralsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleAction = (title) => {
        if (!isPaid) {
            setIsUnlockOpen(true);
            return;
        }

        if (title === 'Help & Support') {
            navigate('/user/help');
            return;
        }

        if (title === 'App Feedback') {
            setIsFeedbackOpen(true);
            return;
        }

        if (title === 'KYC Status') {
            setIsKycOpen(true);
            return;
        }

        if (title === 'My Referrals') {
            setIsReferralsOpen(true);
            return;
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Optimistic UI update
            const reader = new FileReader();
            reader.onloadend = () => updateProfileImage(reader.result);
            reader.readAsDataURL(file);

            // Real backend update
            setIsUploading(true);
            try {
                const uploadFormData = new FormData();
                uploadFormData.append('photo', file);
                const res = await api.patch('/user/data/photo', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.success) {
                    updateProfileImage(res.data); // Update global state with Cloudinary URL
                    addNotification("Success!", "Profile photo updated.", "success");
                }
            } catch (err) {
                addNotification("Sync Error", "Photo failed to sync.", "warning");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const sections = [
        { id: 1, title: 'KYC Status', status: kycStatus || 'Not Started', action: 'View' },
        { id: 2, title: 'My Referrals', status: `${referrals.count} Total active`, action: 'View' },
        { id: 4, title: 'Help & Support', status: '24/7 technical assistance' },
        { id: 5, title: 'App Feedback', status: 'Tell us how to improve' },
    ];

    return (
        <div className="flex flex-col gap-6 p-5 bg-[#F8FAFC] animate-in fade-in duration-700">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />
            <KycModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
            <ReferralsModal isOpen={isReferralsOpen} onClose={() => setIsReferralsOpen(false)} referralCount={referrals.count} />
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

            <div className="flex flex-col items-center mt-0 mb-2 text-center">
                <label className="relative cursor-pointer group mb-3">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center ring-4 ring-white shadow-xl shadow-slate-200/50 overflow-hidden transition-transform group-active:scale-95">
                        {isUploading ? (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : null}
                        
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <User size={32} className="text-slate-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Plus size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </label>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{name}</h2>
                <div className="bg-slate-900/5 px-2.5 py-1 rounded-full mt-1.5 inline-block border border-slate-900/5">
                    <p className="text-[9px] font-black text-slate-500 capitalize tracking-widest leading-none">{id}</p>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                {sections.map((item, idx) => (
                    <button 
                        key={item.id} 
                        onClick={() => handleAction(item.title)}
                        className={`w-full p-5 flex items-center justify-between group transition-all active:bg-slate-50 ${idx !== sections.length - 1 ? 'border-b border-slate-50' : ''}`}>
                         
                         <div className="text-left">
                            <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-tight mb-1">{item.title}</h4>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight opacity-70">{item.status}</p>
                         </div>
                         
                         <div className="flex items-center gap-3">
                             {item.action ? (
                                 <div className="bg-[#EBF6FF] text-[#2D9AFF] hover:bg-[#2D9AFF] hover:text-white px-5 py-2.5 rounded-2xl text-[12px] font-black transition-all">
                                     {item.action}
                                 </div>
                             ) : (
                                 <ChevronRight size={20} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                             )}
                         </div>
                    </button>
                ))}
            </div>

            <div className="mt-4 flex flex-col items-center pb-2">
                <button 
                    onClick={logout}
                    className="bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white px-10 py-4 rounded-full flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-100/50 transition-all active:scale-95 group"
                >
                    <LogOut size={18} /> Logout Account
                </button>
            </div>
        </div>
    );
};

export default Profile;
