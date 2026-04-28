import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Sparkles, Headset, Building2, CheckCircle2 } from 'lucide-react';
import api from '../../shared/services/api';

const InfoPageView = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState({ title: 'Loading...', subtitle: '', sections: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPageContent = async () => {
            setLoading(true);
            try {
                const dbKey = `menu_${pageId.replace(/-/g, '_')}`;
                const res = await api.get(`/public/content/${dbKey}`);
                if (res.success && res.data && res.data.data) {
                    setPageData({
                        title: res.data.data.title || res.data.title,
                        subtitle: res.data.data.subtitle || res.data.description,
                        sections: res.data.data.sections || []
                    });
                } else {
                    setPageData({ title: 'Page Not Found', subtitle: '', sections: [] });
                }
            } catch (err) {
                console.error(err);
                setPageData({ title: 'Error', subtitle: 'Failed to load content.', sections: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchPageContent();
    }, [pageId]);

    const getIcon = () => {
        switch(pageId) {
            case 'how-it-works': return <HelpCircle size={32} className="text-sky-500" />;
            case 'benefits': return <Sparkles size={32} className="text-amber-500" />;
            case 'support': return <Headset size={32} className="text-emerald-500" />;
            case 'about': return <Building2 size={32} className="text-indigo-500" />;
            default: return <Info size={32} className="text-slate-500" />;
        }
    };

    if (loading) {
        return <div className="flex flex-col min-h-screen bg-[#F8FAFC] items-center justify-center">
            <Rocket className="text-sky-500 animate-bounce" size={48} />
            <p className="mt-4 text-slate-400 font-bold animate-pulse">Fetching Content...</p>
        </div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-[57px] z-50">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-slate-600 active:scale-95 transition-transform"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase truncate">
                    {pageData.title}
                </h1>
            </div>

            <div className="flex-1 p-5 animate-in slide-in-from-bottom-4 duration-500 pb-20 mt-2">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-100/50">
                        {getIcon()}
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                        {pageData.title}
                    </h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">{pageData.subtitle}</p>
                    
                    <div className="space-y-8">
                        {pageData.sections?.map((section, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div className="absolute left-0 top-1">
                                    <CheckCircle2 size={18} className="text-sky-500" />
                                </div>
                                <h4 className="text-[14px] font-black text-slate-800 mb-1">{section.title}</h4>
                                <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPageView;
