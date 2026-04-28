import React, { useState, useEffect } from 'react';
import { 
    Plus, Trash2, Edit3, Save, X, Loader2,
    TrendingUp, Rocket, Zap, Trophy,
    Sparkles, Gift, Shield, Users, 
    Briefcase, ClipboardList, CreditCard,
    ChevronRight, MoveUp, MoveDown
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../../shared/services/api';

// Icon Map for previewing - using only confirmed working icons
const ICON_MAP = {
    TrendingUp, Rocket, Zap, Trophy,
    Sparkles, Gift, Shield, Users, 
    Briefcase, ClipboardList, CreditCard
};

const BusinessContent = () => {
    const [ideas, setIdeas] = useState([]);
    const [editingIdea, setEditingIdea] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const res = await api.get('/admin/business-ideas');
            if (res.success) {
                setIdeas(res.data);
            }
        } catch (err) {
            console.error("Fetch failed", err);
        }
    };

    const handleSave = async () => {
        if (!editingIdea.title) return alert("Title is required");
        setLoading(true);
        try {
            const isEdit = !!editingIdea._id;
            const res = isEdit 
                ? await api.put(`/admin/business-ideas/${editingIdea._id}`, editingIdea)
                : await api.post('/admin/business-ideas', editingIdea);

            if (res.success) {
                fetchIdeas();
                setShowModal(false);
                setEditingIdea(null);
            }
        } catch (err) {
            alert("Save failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this idea?")) {
            try {
                const res = await api.delete(`/admin/business-ideas/${id}`);
                if (res.success) {
                    setIdeas(prev => prev.filter(i => i._id !== id));
                }
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const openEdit = (idea = null) => {
        setEditingIdea(idea || {
            title: '',
            desc: '',
            potential: '',
            icon: 'Briefcase',
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            type: 'Free',
            youtubeLink: '',
            steps: [{ title: '', text: '' }]
        });
        setShowModal(true);
    };

    const addStep = () => {
        setEditingIdea({
            ...editingIdea,
            steps: [...editingIdea.steps, { title: '', text: '' }]
        });
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...editingIdea.steps];
        newSteps[index][field] = value;
        setEditingIdea({ ...editingIdea, steps: newSteps });
    };

    const removeStep = (index) => {
        const newSteps = editingIdea.steps.filter((_, i) => i !== index);
        setEditingIdea({ ...editingIdea, steps: newSteps });
    };

    const moveStep = (index, direction) => {
        const newSteps = [...editingIdea.steps];
        const target = index + direction;
        if (target < 0 || target >= newSteps.length) return;
        [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
        setEditingIdea({ ...editingIdea, steps: newSteps });
    };

    return (
        <div className="p-6 animate-in fade-in duration-500 pb-20">
            <PageHeader title="Business Hub CMS" subtitle="Manage dynamic business ideas and success roadmaps for users" />

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {ideas.filter(i => i.type === 'Free').length} Free Ideas
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        {ideas.filter(i => i.type === 'Premium').length} Premium Ideas
                    </div>
                </div>
                <button 
                    onClick={() => openEdit()}
                    className="flex items-center gap-2 bg-[#1A1C30] hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
                >
                    <Plus size={16} /> Create New Strategy
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {ideas.map(item => (
                    <div key={item._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all flex flex-col group">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 ${item.bg || 'bg-slate-100'} rounded-2xl flex items-center justify-center ${item.color || 'text-slate-600'} border border-black/5 shadow-inner`}>
                                {ICON_MAP[item.icon] ? React.createElement(ICON_MAP[item.icon], { size: 28 }) : <Briefcase size={28} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${item.type === 'Free' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-[#1A1C30] text-white'}`}>
                                        {item.type}
                                    </span>
                                </div>
                                <p className="text-[12px] text-slate-400 font-medium mt-1 leading-snug line-clamp-2">{item.desc}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mb-4">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Potential</span>
                                <span className="font-black text-slate-900">{item.potential}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] mt-2">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Steps in Roadmap</span>
                                <span className="font-black text-indigo-600">{item.steps?.length || 0} Steps</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <button 
                                onClick={() => openEdit(item)}
                                className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Edit3 size={14} /> Edit Content
                            </button>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="w-12 h-12 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center transition-all border border-rose-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal - Updating Footer for Loading */}
            {/* Find line 350 for Save Strategy button */}

            {/* Edit/Create Modal */}
            {showModal && editingIdea && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                    {editingIdea.id ? 'Edit Strategy' : 'Create New Strategy'}
                                </h2>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure business model and roadmap</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Basic Info */}
                                <div className="space-y-5">
                                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Basic Configuration</h3>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategy Title</label>
                                        <input 
                                            type="text" 
                                            value={editingIdea.title}
                                            onChange={(e) => setEditingIdea({...editingIdea, title: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. Premium SaaS Agency"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Earning Potential</label>
                                        <input 
                                            type="text" 
                                            value={editingIdea.potential}
                                            onChange={(e) => setEditingIdea({...editingIdea, potential: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                                            placeholder="₹50k - ₹2L+ / mo"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">YouTube Tutorial Link</label>
                                        <input 
                                            type="text" 
                                            value={editingIdea.youtubeLink || ''}
                                            onChange={(e) => setEditingIdea({...editingIdea, youtubeLink: e.target.value})}
                                            className="w-full bg-rose-50/20 border border-rose-100/50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 outline-none transition-all"
                                            placeholder="e.g. https://youtu.be/..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                                        <textarea 
                                            value={editingIdea.desc}
                                            onChange={(e) => setEditingIdea({...editingIdea, desc: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                                            placeholder="Explain what this business is about..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Type</label>
                                            <select 
                                                value={editingIdea.type}
                                                onChange={(e) => setEditingIdea({...editingIdea, type: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer"
                                            >
                                                <option value="Free">Free Section</option>
                                                <option value="Premium">Premium Section</option>
                                            </select>
                                        </div>
                                        {editingIdea.type === 'Premium' && (
                                            <div className="space-y-1.5 animate-in slide-in-from-left-2 transition-all">
                                                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Unlock Price (₹)</label>
                                                <input 
                                                    type="number" 
                                                    value={editingIdea.price || ''}
                                                    onChange={(e) => setEditingIdea({...editingIdea, price: e.target.value})}
                                                    className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-rose-300 transition-all text-rose-600"
                                                    placeholder="e.g. 50"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon Name (Lucide)</label>
                                            <select 
                                                value={editingIdea.icon}
                                                onChange={(e) => setEditingIdea({...editingIdea, icon: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer"
                                            >
                                                {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-center pt-5">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                {ICON_MAP[editingIdea.icon] ? React.createElement(ICON_MAP[editingIdea.icon], { size: 32 }) : <Briefcase size={32} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Roadmap Steps */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Strategy Roadmap</h3>
                                        <button 
                                            onClick={addStep}
                                            className="text-[10px] font-black text-white bg-indigo-500 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
                                        >
                                            <Plus size={12} /> Add Step
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {editingIdea.steps.map((step, idx) => (
                                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative group/step">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => moveStep(idx, -1)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><MoveUp size={12}/></button>
                                                        <button onClick={() => moveStep(idx, 1)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><MoveDown size={12}/></button>
                                                        <button onClick={() => removeStep(idx)} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors ml-1"><Trash2 size={12}/></button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <input 
                                                        type="text" 
                                                        value={step.title}
                                                        onChange={(e) => updateStep(idx, 'title', e.target.value)}
                                                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-black placeholder:text-slate-300 outline-none focus:border-indigo-500"
                                                        placeholder="Step Title (e.g. Select Niche)"
                                                    />
                                                    <textarea 
                                                        value={step.text}
                                                        onChange={(e) => updateStep(idx, 'text', e.target.value)}
                                                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold placeholder:text-slate-300 outline-none focus:border-indigo-500 min-h-[60px]"
                                                        placeholder="Step Instructions..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {editingIdea.steps.length === 0 && (
                                            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No steps added yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all font-inter"
                            >
                                Discard Changes
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className={`bg-[#1A1C30] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {loading ? 'Saving...' : 'Save Strategy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}} />
        </div>
    );
};

export default BusinessContent;
