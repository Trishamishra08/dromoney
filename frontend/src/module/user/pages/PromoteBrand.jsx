import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, Mail, Briefcase, Link, IndianRupee, Users, AlertTriangle, FileText, Rocket, CheckCircle2, ChevronDown, Plus, Clock, ExternalLink } from 'lucide-react';
import { promotionStorage } from '../../shared/services/promotionStorage';

const PromoteBrand = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [myPromotions, setMyPromotions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        whatsapp: '',
        category: '',
        link: '',
        budget: '',
        usersRequired: '',
        description: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const costPerUser = 1;

    useEffect(() => {
        const promos = promotionStorage.getPromotions();
        setMyPromotions(promos);
        if (promos.length === 0) {
            setView('form');
        }
    }, [isSubmitted]);

    const categories = [
        'App Download',
        'Video Watch',
        'Instagram Follow',
        'YouTube Subscribe',
        'Website Visit',
        'Custom Task'
    ];

    const handleBudgetChange = (val) => {
        const budget = val === '' ? '' : Number(val);
        setFormData(prev => ({
            ...prev,
            budget: val,
            usersRequired: budget === '' ? '' : budget / costPerUser
        }));
    };

    const handleUsersChange = (val) => {
        const users = val === '' ? '' : Number(val);
        setFormData(prev => ({
            ...prev,
            usersRequired: val,
            budget: users === '' ? '' : users * costPerUser
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Save to simulated backend
        promotionStorage.savePromotion(formData);

        setIsSubmitted(true);
        setView('list');
        // Reset form
        setFormData({ name: '', mobile: '', whatsapp: '', category: '', link: '', budget: '', usersRequired: '', description: '' });
        
        setTimeout(() => {
            setIsSubmitted(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#F1F9F3] pb-24 relative overflow-hidden">
            {/* Ultra-Compact Header Row - Navy Blue Theme */}
            <div className="relative h-16 bg-gradient-to-br from-[#0B1221] to-[#1E293B] rounded-b-3xl shadow-lg overflow-hidden flex items-center px-5 fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
                {/* Decorative Elements */}
                <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] pointer-events-none">
                    <Rocket size={100} className="text-white" />
                </div>
                
                {/* Compact Row: Back + Title */}
                <div className="flex items-center gap-3 relative z-20 w-full">
                    <button onClick={() => view === 'form' && myPromotions.length > 0 ? setView('list') : navigate('/user/home')} className="w-8 h-8 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-lg text-white active:scale-90 transition-all border border-white/10">
                        <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex flex-col">
                        <p className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                            Brand Portal
                        </p>
                        <h1 className="text-base font-black text-white tracking-tight leading-none uppercase">
                            {view === 'form' ? 'Promotion Details' : 'My Promotions'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="pt-[64px] px-4 pb-24 max-w-md mx-auto">
                
                {/* LIST VIEW: Show existing requests */}
                {view === 'list' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {isSubmitted && (
                             <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-200 animate-bounce">
                                <CheckCircle2 size={24} />
                                <span className="text-xs font-black uppercase tracking-widest">Promotion Form Submitted Successfully!</span>
                             </div>
                        )}

                        <div className="mb-2">
                            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Ad Requests History</h2>
                        </div>

                        {myPromotions.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                                <Rocket size={32} className="text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-bold text-[12px] leading-relaxed">No active promotions. Start your first campaign!</p>
                            </div>
                        ) : (
                            myPromotions.map((promo) => (
                                <div key={promo.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-blue-100 transition-all active:scale-[0.99] mb-4">
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 border border-blue-100">
                                                    <Briefcase size={14} />
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">{promo.category}</h3>
                                            </div>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                                promo.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                                {promo.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                                                <p className="text-[13px] font-black text-slate-800">₹{promo.budget}</p>
                                            </div>
                                            <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Users</p>
                                                <p className="text-[13px] font-black text-slate-800">{promo.usersRequired}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 border-t border-slate-50 pt-3">
                                            <span className="flex items-center gap-1"><Clock size={10}/> {promo.date}</span>
                                            <a href={promo.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">View Campaign <ExternalLink size={10}/></a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {/* FORM VIEW: Original Promotion Form */}
                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center border-r border-slate-100 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    <User size={16} />
                                </div>
                                <input 
                                    required
                                    type="text"
                                    placeholder="Enter business name"
                                    className="w-full bg-white border border-slate-100 rounded-xl pl-14 pr-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Mobile & Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center border-r border-slate-100 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <input required type="tel" placeholder="Mobile" className="w-full bg-white border border-slate-100 rounded-xl pl-14 pr-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Details</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center border-r border-slate-100 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <input required type="text" placeholder="WhatsApp / Email" className="w-full bg-white border border-slate-100 rounded-xl pl-14 pr-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Task Category & Link Row */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category & Target Link</label>
                            <div className="flex flex-col gap-3">
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center border-r border-slate-100 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Briefcase size={16} />
                                    </div>
                                    <select 
                                        required
                                        className="w-full bg-white border border-slate-100 rounded-xl pl-14 pr-10 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 appearance-none shadow-sm"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="" disabled>Select Task Type</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronDown size={14} /></div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center border-r border-slate-100 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Link size={16} />
                                    </div>
                                    <input required type="url" placeholder="Paste campaign link here" className="w-full bg-white border border-slate-100 rounded-xl pl-14 pr-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Target Users */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget (₹)</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center border-r border-slate-100 text-slate-300 transition-colors"><IndianRupee size={14} /></div>
                                    <input required type="number" placeholder="Budget" className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-3 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm" value={formData.budget} onChange={(e) => handleBudgetChange(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Users</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center border-r border-slate-100 text-slate-300 transition-colors"><Users size={14} /></div>
                                    <input required type="number" placeholder="Users" className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-3 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm" value={formData.usersRequired} onChange={(e) => handleUsersChange(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-[#0B1221] rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
                            <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Campaign Summary</p>
                            <div className="text-2xl font-black text-white leading-none mb-1">₹{formData.budget || 0}</div>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">for {formData.usersRequired || 0} Verified Users</p>
                        </div>

                        {/* Submit Button - Compact & Premium */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0B1221] to-[#1E293B] hover:from-[#1E293B] hover:to-[#0B1221] text-white font-black uppercase tracking-[0.15em] py-3.5 rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all text-[13px] mt-4 border border-white/5 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <Rocket size={18} className="text-blue-400" />
                                    Launch Campaign
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Import Roboto Font */}
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
            `}} />

            {/* Floating Plus Button (Attractive Add Icon) */}
            {view === 'list' && (
                <button 
                    onClick={() => setView('form')}
                    className="fixed bottom-10 right-6 w-14 h-14 bg-sky-500 text-white rounded-full shadow-[0_8px_25px_rgba(14,165,233,0.4)] flex items-center justify-center active:scale-90 transition-all z-[100] border-4 border-white animate-in zoom-in-50 duration-500"
                >
                    <Plus size={30} strokeWidth={3} />
                </button>
            )}
        </div>
    );
};

export default PromoteBrand;
