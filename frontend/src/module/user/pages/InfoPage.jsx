import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Sparkles, Headset, Building2, CheckCircle2, Shield, IndianRupee, Rocket } from 'lucide-react';
import api from '../../shared/services/api';

const InfoPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Keep UI styles mapped statically so the pages always look premium
    const STYLE_MAP = {
        'how-it-works': { icon: HelpCircle, color: 'text-sky-500', bg: 'bg-sky-50' },
        'benefits': { icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
        'support': { icon: Headset, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        'about': { icon: Building2, color: 'text-[#1A1C30]', bg: 'bg-slate-100' },
        'privacy': { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        'refund': { icon: IndianRupee, color: 'text-rose-600', bg: 'bg-rose-50' },
        'terms': { icon: Info, color: 'text-slate-700', bg: 'bg-slate-100' },
        'guidelines': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        'future-features': { icon: Rocket, color: 'text-sky-600', bg: 'bg-sky-50' }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPageData = async () => {
            setLoading(true);
            try {
                const dbKey = `menu_${type.replace(/-/g, '_')}`;
                const res = await api.get(`/public/content/${dbKey}`);
                if (res.success && res.data && res.data.data) {
                    const d = res.data.data;
                    setPageData({
                        title: d.title || res.data.title,
                        subtitle: d.subtitle || res.data.description,
                        sections: Array.isArray(d) ? d : (d.sections || [])
                    });
                } else {
                    setPageData({
                        title: 'Information',
                        subtitle: 'Page Details',
                        sections: [{ title: 'Info', text: 'This section is currently being updated.' }]
                    });
                }
            } catch (err) {
                console.error(err);
                setPageData({
                    title: 'Error',
                    subtitle: 'Connection Failed',
                    sections: [{ title: 'Problem', text: 'Failed to synchronize with server.' }]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, [type]);

    if (loading) {
        return <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimizing View...</p>
        </div>;
    }

    if (!pageData) return null;

    const style = STYLE_MAP[type] || STYLE_MAP['about'];
    const Icon = style.icon;

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in slide-in-from-right duration-500 pb-20">
            {/* Header */}
            <div className={`p-6 ${style.bg} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Icon size={120} />
                </div>
                
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center text-slate-800 shadow-sm mb-6 active:scale-95 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="relative z-10">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{pageData.title}</h1>
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] mt-1 ${style.color}`}>{pageData.subtitle}</p>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 p-6 -mt-4 bg-white rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <div className="space-y-8 mt-4">
                    {pageData.sections.map((section, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="mt-1">
                                <CheckCircle2 size={20} className={style.color} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 mb-1 group-hover:translate-x-1 transition-transform">{section.title}</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed">{section.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 border-dashed text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Need more help? Our experts are just a click away in the support section.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
