import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, Mail, Gift, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', referral: '', phone: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOTP = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
        }, 1500);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length < 4) return;
        
        setLoading(true);
        const success = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            referralCode: formData.referral
        });
        setLoading(false);

        if (success.success) {
            navigate('/user/home');
        }
    };

    return (
        <div className="flex flex-col min-h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="text-center mb-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 active:scale-95 transition-transform cursor-pointer" onClick={() => navigate('/user/home')}>
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                        <svg className="w-6 h-6 text-white -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1.3-2.1c.42-.6.44-1.37.04-2.13L3 3l5.3 2.34c.76.4 1.53.38 2.13-.04C11.5 4.5 12.5 4 12.5 4L12 9z" /></svg>
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase">Dromoney</span>
                </div>

                <div className="inline-flex items-center gap-2.5 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full mb-6">
                    <Sparkles size={12} className="text-sky-400 rotate-12" />
                    <span className="text-[10px] font-black text-sky-400 tracking-[0.2em] uppercase">Start Earning Today</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
                <p className="text-slate-400 text-[11px] font-bold tracking-wide uppercase opacity-70">Complete 2-step verification to join us</p>
            </div>

            {/* Auth Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[60px] -ml-16 -mt-16"></div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                    <Link to="/user/auth/login" className="flex-1 py-3 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:text-white transition-all text-center flex items-center justify-center">Login</Link>
                    <button className="flex-1 py-3 bg-sky-500 text-slate-950 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95">Register</button>
                </div>

                <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-5 relative z-10">
                    {!otpSent ? (
                        <>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <User size={10} className="text-sky-500" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter as per Bank/PAN"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950/50 text-white font-bold px-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[13px]"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Mail size={10} className="text-sky-500" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="yourname@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-950/50 text-white font-bold px-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[13px]"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Gift size={10} className="text-sky-500" /> Referral Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. JOINNOW"
                                    value={formData.referral}
                                    onChange={(e) => setFormData({ ...formData, referral: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-950/50 text-white font-black px-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[13px] tracking-widest uppercase"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Phone size={10} className="text-sky-500" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    className="w-full bg-slate-950/50 text-white font-bold px-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[13px]"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 py-4 animate-in fade-in zoom-in-95 duration-500 text-center">
                            <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-500/20 relative">
                                <ShieldCheck size={32} className="text-sky-400" />
                                <div className="absolute inset-0 bg-sky-500/10 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Verification</h3>
                                <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Simulated OTP for +91 {formData.phone}</p>
                            </div>

                            <input
                                type="text"
                                placeholder="Any 4 Digits"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="w-full bg-slate-950/50 text-white font-black tracking-[0.8em] text-center px-5 py-5 rounded-2xl border border-sky-500/30 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-800 text-2xl shadow-[0_0_20px_rgba(14,165,233,0.05)]"
                                required
                            />
                            <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-black text-slate-400 uppercase hover:text-sky-500 transition-colors tracking-widest">Change Information?</button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={(!otpSent && (formData.phone.length < 10 || !formData.name)) || (otpSent && otp.length < 4) || loading}
                        className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-30 disabled:hover:bg-sky-500 font-black uppercase text-[12px] tracking-widest py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 active:scale-95 group mt-4"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : (
                            <>
                                {otpSent ? 'Create My Account' : 'Confirm & Continue'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <p className="text-center text-[9px] text-slate-600 font-black mt-8 uppercase tracking-[0.15em] leading-relaxed">
                By clicking "Verify My Identity", you agree to our <br />
                <span className="text-slate-400 underline decoration-slate-700 underline-offset-4 cursor-pointer mt-1 inline-block">Terms & Data Privacy Policy</span>
            </p>
        </div>
    );
};

export default Register;
