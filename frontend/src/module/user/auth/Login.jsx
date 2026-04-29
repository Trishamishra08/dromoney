import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Smartphone, Lock, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import logoImg from '../../../assets/WhatsApp_Image_2026-04-28_at_10.52.49_PM-removebg-preview.png';

const Login = () => {
    const navigate = useNavigate();
    const { sendLoginOtp, verifyLoginOtp } = useUser();
    
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
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
                    <div className="flex items-center gap-2 mb-2">
                        <img src={logoImg} alt="Dromoney" className="w-7 h-7 object-contain" />
                        <span className="text-[15px] font-black text-white tracking-[0.2em] uppercase">DROMONEY</span>
                    </div>

                    <div className="mt-0">
                        <p className="text-white/60 text-[11px] font-normal mb-0 tracking-wide uppercase">Welcome Back!</p>
                        <h1 className="text-[30px] font-medium text-white tracking-tight leading-none">Sign In</h1>
                    </div>
                </div>
            </div>

            {/* ── Login Form Section ── */}
            <div className="flex-1 px-8 pt-8 pb-4 flex flex-col justify-start">
                <div className="w-full max-w-sm mx-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                            <p className="text-rose-500 text-[11px] font-medium">
                                {typeof error === 'object' ? error.message : error}
                            </p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <input
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-6 py-3.5 rounded-full border border-slate-100 focus:bg-white focus:border-[#0f1d3a]/20 transition-all placeholder:text-slate-300 text-[14px]"
                                        required
                                        maxLength={10}
                                    />
                                    <Smartphone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={phone.length < 10 || loading}
                                className="w-full bg-[#0f1d3a] hover:bg-[#1a2c52] text-white py-4 rounded-full font-bold text-[14px] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right duration-500">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Verification</label>
                                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-sky-600 uppercase">Change</button>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="0000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-slate-50 text-[#0f1d3a] font-medium px-6 py-3.5 rounded-full border border-slate-100 focus:bg-white focus:border-[#0f1d3a]/20 transition-all text-center tracking-[1em] text-[18px] placeholder:text-slate-300 placeholder:tracking-normal"
                                        required
                                        maxLength={4}
                                    />
                                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                </div>
                                <p className="text-center text-[10px] font-bold text-sky-500 mt-2 tracking-widest uppercase">Dev Code: 1234</p>
                            </div>

                            <button
                                type="submit"
                                disabled={otp.length !== 4 || loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-full font-bold text-[14px] transition-all shadow-xl shadow-emerald-50 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Account'}
                            </button>
                        </form>
                    )}

                    <div className="mt-3 text-center">
                        <button className="text-[11px] font-medium text-slate-400 hover:text-[#0f1d3a] transition-colors uppercase tracking-widest">Forget Password?</button>
                    </div>

                    <div className="flex items-center gap-4 my-6 px-4">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">Or login with</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 px-2">
                        <button className="flex items-center justify-center gap-3 py-3 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 active:scale-95 transition-all">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-40" alt="Google" />
                            <span className="text-[11px] font-semibold text-[#0f1d3a]">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 active:scale-95 transition-all">
                            <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4 grayscale opacity-40" alt="Facebook" />
                            <span className="text-[11px] font-semibold text-[#0f1d3a]">Facebook</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto pb-4 text-center">
                    <p className="text-[12px] font-normal text-slate-400 uppercase tracking-widest">
                        Don't Have An Account? <Link to="/user/auth/register" className="text-[#0f1d3a] font-bold underline decoration-sky-500/20 underline-offset-4 ml-1">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
