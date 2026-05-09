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
                    } else if (type === 'terms') {
                        setPageData({
                            title: 'Terms & Conditions (नियम और शर्तें)',
                            subtitle: 'Legal Acceptance, Eligibility, and Usage Policies',
                            sections: [
                                {
                                    title: '1. कानूनी स्वीकृति (Legal Acceptance)',
                                    text: 'DROMONEY एप्लीकेशन को डाउनलोड, इंस्टॉल या उपयोग करके, आप स्वीकार करते हैं कि आपने इन नियमों को पढ़ लिया है और आप इनसे कानूनी रूप से बंधे हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया ऐप का उपयोग न करें।'
                                },
                                {
                                    title: '2. पात्रता (Eligibility)',
                                    text: 'इस ऐप का उपयोग करने के लिए यूजर की आयु कम से कम 18 वर्ष होनी चाहिए। एक व्यक्ति, एक मोबाइल नंबर और एक ही डिवाइस (Smartphone) पर केवल एक ही अकाउंट बना सकता है।'
                                },
                                {
                                    title: '3. सेवाओं का स्वरूप (Nature of Services)',
                                    text: 'DROMONEY एक E-learning और Income Opportunity प्लेटफॉर्म है। हम किसी भी प्रकार की फिक्स्ड सैलरी, गारंटीड प्रॉफिट या सरकारी नौकरी का वादा नहीं करते हैं। आपकी आय आपकी मेहनत, स्किल और कंपनी की नीतियों पर निर्भर करती है।'
                                },
                                {
                                    title: '4. भुगतान और नो-रिफंड (Payment & No-Refund Policy)',
                                    text: '• कोर्स (Course Fee ₹499): यह एक डिजिटल एजुकेशनल कंटेंट है। एक बार भुगतान सफल होने के बाद पैसा वापस (Refund) नहीं किया जाएगा।\n• बूस्टर्स (Boosters ₹49/₹11): एक्टिवेशन के बाद इनका कोई रिफंड संभव नहीं है।\n• पेमेंट गेटवे: सभी ट्रांजेक्शन Razorpay/Cashfree के माध्यम से होते हैं। पेमेंट फेल होने पर बैंक से संपर्क करें।'
                                },
                                {
                                    title: '5. वॉलेट और विड्रॉल (Wallet & Withdrawal)',
                                    text: '• ऐप में दिखने वाला बैलेंस "वर्चुअल रिवॉर्ड" है। इसे तभी ट्रांसफर किया जा सकता है जब वह न्यूनतम विड्रॉल सीमा तक पहुँच जाए।\n• KYC अनिवार्य: विड्रॉल के लिए आधार/पैन देना अनिवार्य है।\n• बैंक अकाउंट: विड्रॉल उसी खाते में दिया जाएगा जिसका नाम KYC से मेल खाता हो।'
                                },
                                {
                                    title: '6. विज्ञापनों और टास्क (Ads & Task Policy)',
                                    text: '• रिवॉर्ड पाने के लिए विज्ञापनों को बिना स्किप किए पूरा देखना अनिवार्य है।\n• Auto-clicker, Bot, VPN या Script का उपयोग सख्त मना है। ऐसा करने पर अकाउंट स्थायी रूप से बैन (Permanent Ban) कर दिया जाएगा।'
                                },
                                {
                                    title: '7. फ्यूचर फंड (Future Fund)',
                                    text: 'यह एक प्रोत्साहन योजना है। इसका लाभ केवल निर्धारित क्राइटेरिया (10 सफल रेफरल और सक्रियता) पूरा करने पर मिलेगा। कंपनी किसी भी समय इस योजना में बदलाव कर सकती है।'
                                },
                                {
                                    title: '8. देयता की सीमा (Limitation of Liability)',
                                    text: 'कंपनी तकनीकी खराबी, इंटरनेट समस्या या सर्वर डाउन होने के लिए जिम्मेदार नहीं होगी। यूजर अपनी लॉगिन आईडी और पासवर्ड की सुरक्षा के लिए स्वयं जिम्मेदार है।'
                                },
                                {
                                    title: '9. नियमों में संशोधन (Amendments)',
                                    text: 'DROMONEY के पास बिना किसी पूर्व सूचना के इन नियमों, रिवॉर्ड स्ट्रक्चर या ऐप के फीचर्स में बदलाव करने का पूर्ण अधिकार सुरक्षित है।'
                                }
                            ]
                        });
                    } else if (type === 'guidelines') {
                        setPageData({
                            title: 'Community Guidelines (कम्युनिटी गाइडलाइन्स)',
                            subtitle: 'Honesty, Growth, and Safe Conduct Rules',
                            sections: [
                                {
                                    title: '1. उद्देश्य (Our Purpose)',
                                    text: 'DROMONEY एक ऐसा समुदाय है जो ईमानदारी, विकास और सीखने पर आधारित है। ये गाइडलाइन्स हर यूजर के पास कमाने और सीखने का एक सुरक्षित और निष्पक्ष अवसर सुनिश्चित करती हैं।'
                                },
                                {
                                    title: '2. धोखाधड़ी का निषेध (No Fraud & Manipulation)',
                                    text: '• बॉट और स्क्रिप्ट: ऑटो-क्लिकर, बॉट या एमुलेटर का उपयोग सख्त वर्जित है।\n• फेक रेफरल: नकली अकाउंट बनाना या एक ही डिवाइस पर कई अकाउंट्स का उपयोग करना धोखाधड़ी है।\n• विज्ञापन ईमानदारी: विज्ञापनों के साथ छेड़छाड़ गाइडलाइन्स के खिलाफ है।'
                                },
                                {
                                    title: '3. सम्मानजनक व्यवहार (Respectful Conduct)',
                                    text: '• अभद्र भाषा: सपोर्ट टीम या फीडबैक में गाली-गलौज या धमकी देने पर अकाउंट तुरंत सस्पेंड कर दिया जाएगा।\n• सोशल मीडिया: कंपनी या ब्रांड के बारे में भ्रामक जानकारी या नकारात्मक अफवाहें न फैलाएं।'
                                },
                                {
                                    title: '4. ब्रांड और टास्क सुरक्षा (Brand & Task Safety)',
                                    text: 'टास्क पूरा करते समय किसी भी पार्टनर ब्रांड की छवि खराब करने वाली गतिविधि या कमेंट करना सख्त मना है। टास्क निर्देशों के अनुसार ही पूरा करें।'
                                },
                                {
                                    title: '5. स्पैमिंग पर रोक (No Spamming)',
                                    text: 'रेफरल लिंक प्रमोट करने के लिए स्पैमिंग (बार-बार मैसेज भेजना) न करें। दूसरों की निजता का सम्मान करें।'
                                },
                                {
                                    title: '6. सुरक्षा और गोपनीयता (Security & Privacy)',
                                    text: '• अपनी सुरक्षा: अपना पासवर्ड, पिन या ओटीपी कभी साझा न करें।\n• दूसरों की सुरक्षा: किसी अन्य यूजर की व्यक्तिगत जानकारी चुराने का प्रयास कानूनी अपराध है।'
                                },
                                {
                                    title: '7. उल्लंघन के परिणाम (Consequences)',
                                    text: '• चेतावनी (Warning): पहली बार उल्लंघन पर।\n• वॉलेट फ्रीज: धोखाधड़ी से कमाई जब्त की जा सकती है।\n• स्थायी प्रतिबंध (Permanent Ban): गंभीर उल्लंघन पर अकाउंट बिना सूचना बंद कर दिया जाएगा।'
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
