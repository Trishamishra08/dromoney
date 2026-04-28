import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Phone, ShieldCheck, Lock, ArrowRight, Smartphone } from 'lucide-react';

import { useUser } from '../context/UserContext';

const Login = () => {
    const navigate = useNavigate();
    const { sendLoginOtp, verifyLoginOtp } = useUser();
    
    // Form States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    
    // Flow States
    const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expectedOtp, setExpectedOtp] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await sendLoginOtp(phone);
        setLoading(false);
        
        if (result.success) {
            setExpectedOtp(result.dev_otp);
            setStep(2);
        } else {
            setError(result.error);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await verifyLoginOtp(phone, otp, expectedOtp);
        setLoading(false);
        
        if (result.success) {
            navigate('/user/home');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="flex flex-col min-h-[500px] animate-in fade-in zoom-in-95 duration-700">
            {/* Header: Platform Branding */}
            <div className="text-center mb-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 active:scale-95 transition-transform cursor-pointer" onClick={() => navigate('/user/home')}>
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                        <svg className="w-6 h-6 text-white -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1.3-2.1c.42-.6.44-1.37.04-2.13L3 3l5.3 2.34c.76.4 1.53.38 2.13-.04C11.5 4.5 12.5 4 12.5 4L12 9z" /></svg>
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase">Dromoney</span>
                </div>

                <div className="inline-flex items-center gap-2.5 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full mb-6">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.8)]"></div>
                    <span className="text-[10px] font-black text-sky-400 tracking-[0.2em] uppercase">Secure Access</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back!</h1>
                <p className="text-slate-400 text-[11px] font-bold tracking-wide uppercase opacity-70">
                    {step === 1 ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
                </p>
            </div>

            {/* Auth Card: Modern Glassmorphism */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                {/* Tabs */}
                <div className="flex p-1.5 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                    <button className="flex-1 py-3 bg-sky-500 text-slate-950 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95">Login</button>
                    <Link to="/user/auth/register" className="flex-1 py-3 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:text-white transition-all text-center flex items-center justify-center">Register</Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                        <p className="text-rose-400 text-[12px] font-bold text-center">{error}</p>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6 relative z-10 transition-all">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                <Smartphone size={12} className="text-sky-500" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-slate-950/50 text-white font-bold px-5 py-4 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[14px]"
                                required
                                maxLength={10}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={phone.length < 10 || loading}
                            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-30 disabled:hover:bg-sky-500 font-black uppercase text-[12px] tracking-widest py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 active:scale-95 group"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                <>
                                    Send Security Code
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1 mb-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Lock size={12} className="text-sky-500" />
                                    Security Code
                                </label>
                                <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-sky-500 hover:text-sky-400 transition-colors uppercase">Change Number</button>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Enter 4-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-slate-950/50 text-white font-bold px-5 py-4 rounded-2xl border border-white/10 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-700 text-[20px] tracking-[0.5em] text-center"
                                required
                                maxLength={4}
                            />
                            {/* Dev Helper - Shows OTP since we have no SMS Gateway */}
                            {expectedOtp && (
                                <p className="text-[11px] font-bold text-sky-400/80 text-center mt-2">
                                    Dev Code: {expectedOtp}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.length !== 4 || loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-30 disabled:hover:bg-emerald-500 font-black uppercase text-[12px] tracking-widest py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 group"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                <>
                                    Verify & Access
                                    <ShieldCheck size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Support/Footer info */}
            <div className="mt-12 text-center">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.15em] mb-4">Secured by industry standard encryption</p>
                <div className="flex justify-center gap-8 items-center opacity-40 grayscale">
                    <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    <div className="h-4 w-12 bg-slate-800 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
