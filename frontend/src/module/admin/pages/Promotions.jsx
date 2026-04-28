import React, { useState, useEffect } from 'react';
import { Megaphone, Trash2, CheckCircle2, MessageSquare, Clock, User, Phone, Globe, DollarSign, Users, X, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../../shared/services/api';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [adminMsg, setAdminMsg] = useState('');

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/promotions');
            if (response.success) {
                const mapped = response.data.map(p => ({
                    id: p._id,
                    name: p.user?.name || 'Unknown',
                    mobile: p.user?.phone || 'N/A',
                    whatsapp: p.whatsappNumber,
                    category: p.taskType,
                    budget: p.budget,
                    usersRequired: p.targetUsers,
                    link: p.taskLink,
                    description: p.description,
                    status: p.status,
                    date: new Date(p.createdAt).toLocaleDateString(),
                    adminResponse: p.adminResponse
                }));
                setPromotions(mapped);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deletePromo = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand request?")) {
            try {
                const response = await api.delete(`/admin/content/promotion/${id}`);
                if (response.success) fetchPromotions();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await api.put(`/admin/promotions/${id}`, { status: newStatus });
            if (response.success) {
                fetchPromotions();
                alert(`Status updated to ${newStatus}`);
            }
        } catch (err) {
            alert(err);
        }
    };

    const handleMessageSubmit = async () => {
        if (!adminMsg) return;
        try {
            const response = await api.put(`/admin/promotions/${selectedPromo.id}`, { 
                status: 'Contacted',
                adminResponse: adminMsg 
            });
            if (response.success) {
                fetchPromotions();
                setIsMsgModalOpen(false);
                setAdminMsg('');
                alert("Message sent to user and status updated!");
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <PageHeader title="Brand Promotions" subtitle="Review and manage brand promotion requests from users" />

            {promotions.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Megaphone size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-black text-lg">No promotion requests yet</h3>
                    <p className="text-slate-400 font-bold text-sm">When users fill the Promote Your Brand form, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:border-sky-100 transition-all border-l-[6px] border-l-sky-500">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                
                                {/* Info Section */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-sky-50 p-2.5 rounded-xl">
                                            <User size={20} className="text-sky-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg leading-none">{promo.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                                                <Clock size={12} /> Requested on {promo.date}
                                            </p>
                                        </div>
                                        <span className={`ml-auto md:ml-4 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                                            promo.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                                            promo.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                                            promo.status === 'Rejected' ? 'bg-rose-100 text-rose-600' :
                                            'bg-sky-100 text-sky-600'
                                        }`}>
                                            {promo.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Info</p>
                                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Phone size={12} className="text-slate-400"/> {promo.mobile}</p>
                                            <p className="text-xs font-bold text-sky-600 flex items-center gap-1.5 leading-none break-all mt-1">{promo.whatsapp}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Task Type</p>
                                            <p className="text-xs font-black text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 inline-block">{promo.category}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Budget Details</p>
                                            <p className="text-xs font-black text-amber-600 flex items-center gap-1.5">₹{promo.budget}</p>
                                            <p className="text-[10px] font-bold text-slate-500">{promo.usersRequired} Users Required</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Task Link</p>
                                            <a href={promo.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5 truncate max-w-[150px]">
                                                <Globe size={12} /> Visit Link
                                            </a>
                                        </div>
                                    </div>

                                    {promo.description && (
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Description</p>
                                             <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{promo.description}"</p>
                                        </div>
                                    )}

                                    {promo.adminResponse && (
                                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mt-2">
                                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1"><MessageSquare size={12}/> Your Response</p>
                                             <p className="text-xs font-bold text-emerald-800">{promo.adminResponse}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Section */}
                                <div className="flex md:flex-col gap-2 shrink-0">
                                    <button 
                                        onClick={() => { setSelectedPromo(promo); setIsMsgModalOpen(true); }}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95"
                                    >
                                        <MessageSquare size={14} /> Message
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateStatus(promo.id, 'Approved')}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
                                        >
                                            <CheckCircle2 size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(promo.id, 'Rejected')}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg shadow-rose-100 transition-all active:scale-95"
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => deletePromo(promo.id)}
                                        className="mt-2 md:mt-auto flex items-center justify-center gap-1.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest py-2 rounded-xl border border-transparent hover:border-rose-100 transition-all"
                                    >
                                        <Trash2 size={14} /> Delete Request
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Modal */}
            {isMsgModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sky-600">
                                <MessageSquare size={22} />
                                <h3 className="font-black text-slate-800 uppercase tracking-tight">Send Message to {selectedPromo?.name}</h3>
                            </div>
                            <button onClick={() => setIsMsgModalOpen(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-colors"><X size={24}/></button>
                        </div>
                        <div className="p-6">
                            <p className="text-xs font-bold text-slate-400 mb-4 leading-relaxed">
                                This message will appear in the user's notification bell icon. You can confirm that you have added their task or ask for more details.
                            </p>
                            <textarea 
                                value={adminMsg}
                                onChange={(e) => setAdminMsg(e.target.value)}
                                placeholder="Write your message here..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all outline-none resize-none h-32 mb-6"
                            ></textarea>
                            
                            <button 
                                onClick={handleMessageSubmit}
                                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-sky-200 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;
