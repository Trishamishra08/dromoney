import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Smartphone, Lock, User, Mail, Gift, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import logoImg from '../../../assets/WhatsApp_Image_2026-04-28_at_10.52.49_PM-removebg-preview.png';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useUser();
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', referral: '', phone: '' });
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || formData.phone.length < 10) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1200);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length < 4) return;
        
        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            referralCode: formData.referral
        });
        setLoading(false);

        if (result.success) {
            navigate('/user/home');
        } else {
            setError(result.error || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white animate-in fade-in duration-700 overflow-hidden">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                    body { font-family: 'Roboto', sans-serif; }
                `}
            </style>

            {/* ── Extreme Compact Curved Header ── */}
            <div className="bg-[#0f1d3a] pt-4 pb-8 px-8 rounded-br-[80px] relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={logoImg} alt="Dromoney" className="w-10 h-10 object-contain" />
                        <span className="text-[20px] font-black tracking-[0.1em] uppercase">
                            <span className="text-[#8B4513]">DRO</span>
                            <span className="text-white">MONEY</span>
                        </span>
                    </div>

                    <div className="mt-0">
                        <p className="text-white/60 text-[11px] font-normal mb-0 tracking-wide uppercase">Join the Network</p>
                        <h1 className="text-[30px] font-medium text-white tracking-tight leading-none">Sign Up</h1>
                    </div>
                </div>
            </div>

            {/* ── Registration Form Section ── */}
            <div className="flex-1 px-8 pt-4 pb-4 flex flex-col justify-start overflow-hidden">
                <div className="w-full max-w-sm mx-auto">
                    {error && (
                        <div className="mb-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
                            <p className="text-rose-500 text-[10px] font-medium">
                                {typeof error === 'object' ? error.message : error}
                            </p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-3">
                            <div className="grid grid-cols-1 gap-2.5">
                                <div className="space-y-0.5">
                                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-5 py-2.5 rounded-full border border-slate-100 focus:bg-white transition-all text-[12px]"
                                            required
                                        />
                                        <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-5 py-2.5 rounded-full border border-slate-100 focus:bg-white transition-all text-[12px]"
                                            required
                                        />
                                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Referral (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Code"
                                            value={formData.referral}
                                            onChange={(e) => setFormData({ ...formData, referral: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-5 py-2.5 rounded-full border border-slate-100 focus:bg-white transition-all text-[12px] tracking-widest uppercase"
                                        />
                                        <Gift className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-5 py-2.5 rounded-full border border-slate-100 focus:bg-white transition-all text-[12px]"
                                            required
                                        />
                                        <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0f1d3a] hover:bg-[#1a2c52] text-white py-3.5 rounded-full font-bold text-[14px] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign Up Now'}
                            </button>
                            <div className="text-center mt-3">
                                <p className="text-[11px] font-normal text-slate-400 uppercase tracking-widest">
                                    Already Have An Account? <Link to="/user/auth/login" className="text-[#0f1d3a] font-bold underline decoration-sky-500/20 underline-offset-4 ml-1">Sign In</Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in slide-in-from-right duration-500 pt-2">
                            <div className="text-center mb-2">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100 shadow-sm">
                                    <ShieldCheck size={28} className="text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0f1d3a]">Verify OTP</h3>
                                <p className="text-[10px] text-sky-500 font-bold mt-1 tracking-widest uppercase">Dev Code: 1234</p>
                            </div>

                            <div className="relative group max-w-[200px] mx-auto">
                                <input
                                    type="text"
                                    placeholder="0000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-5 py-3.5 rounded-3xl border border-slate-100 focus:bg-white transition-all text-center tracking-[0.8em] text-[18px] placeholder:text-slate-200 placeholder:tracking-normal shadow-sm"
                                    required
                                />
                                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 4}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-full font-bold text-[14px] transition-all shadow-xl shadow-emerald-50 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Register'}
                            </button>
                        </form>
                    )}
                </div>


            </div>
        </div>
    );
};

export default Register;
