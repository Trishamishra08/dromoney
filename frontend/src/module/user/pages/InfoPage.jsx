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
                            title: 'Refund & Cancellation Policy (रिफंड और रद्दीकरण नीति)',
                            subtitle: 'Rules regarding digital content, technical issues, bans, and user errors.',
                            sections: [
                                {
                                    title: '1. डिजिटल कंटेंट (Digital Content)',
                                    text: 'हमारे प्लेटफॉर्म पर ₹499 का कोर्स और ₹49/₹11 के बूस्टर "Digital Goods" की श्रेणी में आते हैं। एक बार पेमेंट सफल होने और कंटेंट का एक्सेस (Access) मिलने के बाद, कोई भी रिफंड प्रदान नहीं किया जाएगा। \n\nOnce the course or booster is activated, no refund will be issued.'
                                },
                                {
                                    title: '2. तकनीकी खराबी (Technical Issues)',
                                    text: 'यदि आपके बैंक से पैसे कट गए हैं लेकिन ऐप में कोर्स या बूस्टर एक्टिवेट नहीं हुआ है, तो कृपया 24-48 घंटे प्रतीक्षा करें। यदि फिर भी समस्या हल नहीं होती, तो आप हमारे सपोर्ट सेक्शन में ट्रांजैक्शन आईडी (Transaction ID) भेज सकते हैं। जांच के बाद यदि पेमेंट हमें प्राप्त हुआ है, तो सर्विस एक्टिवेट कर दी जाएगी, लेकिन पैसा वापस नहीं होगा। \n\nIn case of payment failure where money is deducted but service not active, contact support. No cash refund, only service activation.'
                                },
                                {
                                    title: '3. अकाउंट बैन (Account Ban)',
                                    text: 'यदि कोई यूजर धोखाधड़ी, फेक रेफरल, या नियमों का उल्लंघन करते हुए पाया जाता है और उसका अकाउंट बैन किया जाता है, तो उस स्थिति में उसकी बची हुई कोई भी राशि या सब्सक्रिप्शन फीस रिफंड नहीं की जाएगी। \n\nNo refunds for banned accounts due to violation of community guidelines.'
                                },
                                {
                                    title: '4. यूजर की गलती (User Error)',
                                    text: 'गलती से खरीदे गए बूस्टर या कोर्स के लिए कंपनी जिम्मेदार नहीं होगी और न ही इसके लिए कोई रिफंड दिया जाएगा। \n\nNo refunds for accidental purchases.'
                                }
                            ]
                        });
                    } else if (type === 'privacy') {
                        setPageData({
                            title: 'Privacy Policy (गोपनीयता नीति)',
                            subtitle: 'Your Data Privacy & Security',
                            sections: [
                                {
                                    title: 'A. डेटा जो हम इकट्ठा करते हैं (Data We Collect)',
                                    text: '• व्यक्तिगत जानकारी: आपका नाम, फोन नंबर, और ईमेल एड्रेस。\n• KYC डेटा: आधार कार्ड/पैन कार्ड की जानकारी (केवल आपकी पहचान सत्यापित करने और धोखाधड़ी रोकने के लिए)।\n• बैंक विवरण: विड्रॉल भेजने के लिए आपके द्वारा दी गई बैंक जानकारी。\n• डिवाइस जानकारी: आपका IP एड्रेस और डिवाइस ID (ताकि एक फोन में एक ही अकाउंट चले)。'
                                },
                                {
                                    title: 'B. डेटा का उपयोग (How We Use Data)',
                                    text: '• आपके वॉलेट में पैसे भेजने और केवाईसी (KYC) वेरिफिकेशन के लिए。\n• विज्ञापनों और टास्क की सत्यता की जांच करने के लिए。\n• ऐप की सुरक्षा बढ़ाने और स्पैम रोकने के लिए।'
                                },
                                {
                                    title: 'C. डेटा सुरक्षा (Data Security)',
                                    text: 'हम आपका डेटा किसी भी तीसरी पार्टी को नहीं बेचते हैं। आपका डेटा हमारे सुरक्षित सर्वर पर एन्क्रिप्टेड (Encrypted) रूप में रहता है।'
                                },
                                {
                                    title: 'D. थर्ड पार्टी सर्विसेज (Third-Party Services)',
                                    text: 'हम भुगतान के लिए Razorpay और विज्ञापनों के लिए AdMob/Google Ads का उपयोग करते हैं। वे अपनी पॉलिसी के अनुसार आपका डेटा प्रोसेस कर सकते हैं।'
                                }
                            ]
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
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed whitespace-pre-line">
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
