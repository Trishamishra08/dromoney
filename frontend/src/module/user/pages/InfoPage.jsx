import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Sparkles, Headset, Building2, CheckCircle2, Shield, IndianRupee, Rocket, Star } from 'lucide-react';
import api from '../../shared/services/api';

const InfoPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    if (type === 'refund-policy') {
                        setPageData({
                            title: 'Refund Policy',
                            subtitle: 'Cancellation & Refund Rules',
                            sections: [{ title: 'Strict No Refund Policy', text: 'Please note that all purchases and payments made on Dromoney are final. We do not offer any refunds or cancellations once a transaction is completed or a service is activated.' }]
                        });
                    } else {
                        setPageData({
                            title: 'Information',
                            subtitle: 'Page Details',
                            sections: [{ title: 'Info', text: 'This section is currently being updated.' }]
                        });
                    }
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

    const getIcon = (size = 24, className = "") => {
        const props = { size, className };
        switch(type) {
            case 'how-it-works': return <HelpCircle {...props} />;
            case 'benefits': return <Sparkles {...props} />;
            case 'support': return <Headset {...props} />;
            case 'about': return <Building2 {...props} />;
            default: return <Info {...props} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Design...</p>
            </div>
        );
    }

    if (!pageData) return null;

    // Premium Layout for Information Pages
    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans pb-24 relative overflow-hidden">
            {/* Ultra-Compact Header Row - Navy Blue Theme */}
            <div className="relative h-16 bg-gradient-to-br from-[#0B1221] to-[#1E293B] rounded-b-3xl shadow-lg overflow-hidden flex items-center px-5">
                {/* Decorative Elements */}
                <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] pointer-events-none">
                    {getIcon(100, "text-white")}
                </div>
                
                {/* Compact Row: Back + Title */}
                <div className="flex items-center gap-3 relative z-20 w-full">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-8 h-8 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-lg text-white active:scale-90 transition-all border border-white/10"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex flex-col">
                        <p className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                            User Guide
                        </p>
                        <h1 className="text-base font-black text-white tracking-tight leading-none uppercase">
                            {pageData.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-8 flex flex-col gap-4 relative z-10">
                {/* Subtitle / Intro - Compact */}
                <div className="px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        {pageData.subtitle}
                    </p>
                </div>

                {/* Content Sections as Compact Cards */}
                <div className="grid gap-3">
                    {pageData.sections.map((section, idx) => (
                        <div key={idx} className="bg-white p-4 border border-slate-100 rounded-xl shadow-sm group active:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 border border-blue-100 text-blue-500">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[13px] font-bold text-slate-800 mb-0.5 uppercase tracking-wide">
                                        {section.title}
                                    </h4>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                        {section.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
