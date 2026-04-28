import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { taskStorage } from '../../shared/services/taskStorage';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, ChevronDown,
    Monitor, Play, Lightbulb, Disc, MessageCircle,
    Camera, ThumbsUp, MessageSquare, Link2,
    Coins, Bell, ClipboardList, TrendingUp, AlertCircle, Rocket, Zap, CheckCircle2
} from 'lucide-react';
import UnlockModal from '../components/UnlockModal';
import PaymentModal from '../components/PaymentModal';

const ICON_MAP = {
    Monitor: { el: Monitor, bg: 'bg-sky-100', color: 'text-sky-500' },
    Youtube: { el: Play, bg: 'bg-red-100', color: 'text-red-500' },
    Lightbulb: { el: Lightbulb, bg: 'bg-yellow-100', color: 'text-yellow-500' },
    Disc: { el: Disc, bg: 'bg-orange-100', color: 'text-orange-500' },
    MessageCircle: { el: MessageCircle, bg: 'bg-green-100', color: 'text-green-500' },
    Instagram: { el: Camera, bg: 'bg-pink-100', color: 'text-pink-500' },
    ThumbsUp: { el: ThumbsUp, bg: 'bg-rose-100', color: 'text-rose-500' },
    MessageSquare: { el: MessageSquare, bg: 'bg-cyan-100', color: 'text-cyan-500' },
    Link: { el: Link2, bg: 'bg-indigo-100', color: 'text-indigo-500' },
    Camera: { el: Camera, bg: 'bg-pink-100', color: 'text-pink-500' },
    Zap: { el: Zap, bg: 'bg-purple-100', color: 'text-purple-500' },
    Rocket: { el: Rocket, bg: 'bg-rose-100', color: 'text-rose-500' },
    TrendingUp: { el: TrendingUp, bg: 'bg-emerald-100', color: 'text-emerald-500' },
};

const Earn = () => {
    const { userData } = useUser();
    const { isPaid } = userData;
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [isBoosterExpanded, setIsBoosterExpanded] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const navigate = useNavigate();

    // DYNAMIC TASKS STATE
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        setTasks(taskStorage.getTasks());
        setCompletedTasks(taskStorage.getCompletedTasks());
    }, []);

    const totalCount = tasks.length;
    const completedCount = completedTasks.length;
    const remainingCount = totalCount - completedCount;

    const handleTaskClick = (task) => {
        if (!isPaid) {
            setIsUnlockOpen(true);
            return;
        }
        if (completedTasks.includes(task.id)) {
            // Do not open if already completed
            return;
        }
        
        // SWITCH ROUTE BASED ON TYPE
        switch (task.type) {
            case 'Quiz':
                navigate(`/user/task-quiz/${task.id}`);
                break;
            case 'Spin':
                navigate(`/user/lucky-draw/${task.id}`);
                break;
            case 'Memory':
                navigate(`/user/memory-master/${task.id}`);
                break;
            case 'Treasure':
                navigate(`/user/treasure-chest/${task.id}`);
                break;
            case 'Scratch':
                navigate(`/user/scratch-card/${task.id}`);
                break;
            case 'Tapper':
                navigate(`/user/speed-tapper/${task.id}`);
                break;
            default:
                navigate(`/user/task/${task.id}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F7FB]">
            <UnlockModal isOpen={isUnlockOpen} onClose={() => setIsUnlockOpen(false)} />

            {/* ── Header ── */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 active:scale-95 transition-all">
                        <ChevronLeft size={22} />
                    </button>
                    <h1 className="text-[17px] font-black text-slate-800 tracking-tight">Tasks</h1>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                    <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <Coins size={11} className="text-white" />
                    </div>
                    <span className="text-[13px] font-black text-amber-700">{userData.coins.total}</span>
                </div>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto pb-4">

                {/* Daily Tasks Summary Card */}
                <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[13px] font-black text-slate-800">
                            Daily Tasks Avld{' '}
                            <span className="text-slate-400 font-bold">Available: {totalCount}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-bold text-slate-500">
                                Completed: <span className="text-emerald-500 font-black">{completedCount}</span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                                Remaining: <span className="text-orange-500 font-black">{remainingCount}</span>
                            </span>
                        </div>
                    </div>
                    {/* Coin Bag Illustration */}
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-amber-100">
                        💰
                    </div>
                </div>

                {/* ── Task List ── */}
                <div className="flex flex-col gap-0 mt-4">
                    {tasks.map((task) => {
                        const iconConfig = ICON_MAP[task.icon] || ICON_MAP['Monitor'];
                        const IconEl = iconConfig.el;
                        const isHighlighted = task.actionType === 'highlighted';
                        const isCompleted = completedTasks.includes(task.id);

                        return (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task)}
                                className={`bg-white border-b border-slate-100 px-4 py-3.5 flex items-center gap-3 transition-colors ${isCompleted ? 'opacity-60 cursor-default' : 'active:bg-slate-50 cursor-pointer hover:bg-slate-50'}`}
                            >
                                {/* Icon */}
                                <div className={`w-11 h-11 ${iconConfig.bg} rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'grayscale opacity-50' : ''}`}>
                                    {isCompleted ? <CheckCircle2 size={20} className="text-emerald-500" /> : <IconEl size={20} className={iconConfig.color} />}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-[13px] font-black leading-tight ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-none truncate">{task.description}</p>
                                </div>

                                {/* Right side */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    {/* Reward */}
                                    <span className={`text-[10px] font-black leading-tight ${isCompleted ? 'text-emerald-500' : isHighlighted ? 'text-orange-500' : 'text-slate-500'}`}>
                                        {isCompleted ? 'Done' : `${task.reward} Coins`}
                                    </span>
                                    {/* Action Button */}
                                    {isCompleted ? (
                                        <button disabled className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100/50 flex items-center gap-1">
                                            Completed
                                        </button>
                                    ) : (
                                        <button
                                            className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 ${isHighlighted
                                                    ? 'bg-amber-400 text-white shadow-md shadow-amber-100 hover:bg-amber-500'
                                                    : 'bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700'
                                                }`}
                                            onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                                        >
                                            {task.type === 'Spin' ? 'Spin Now >' : task.type === 'Proof' ? 'Upload' : 'Complete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {tasks.length === 0 && (
                        <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl mx-4 mt-2">
                             <p className="text-slate-400 font-bold text-sm">No tasks available right now.</p>
                             <p className="text-slate-300 font-medium text-xs mt-1">Please check back later.</p>
                        </div>
                    )}
                </div>

                {/* ── Footer Banner ── */}
                <div className="mx-4 mt-5 bg-amber-400 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 shadow-lg shadow-amber-100">
                    <span className="text-[13px] font-black text-white tracking-tight">
                        🪙 Complete tasks and earn coins!
                    </span>
                </div>

                {/* ── ₹49 Booster Card ── */}
                <div className="mx-4 mt-4 bg-amber-50 border border-amber-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Card Header Row */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">₹49 Task Booster</h4>
                            <p className="text-[10px] font-bold text-slate-500/80 leading-tight">Boost your earnings and get priority access!</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsBoosterExpanded(!isBoosterExpanded)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isBoosterExpanded ? 'bg-amber-200 text-amber-900 rotate-180' : 'bg-white text-slate-400'
                                    }`}
                            >
                                <ChevronDown size={18} />
                            </button>
                            <button
                                onClick={() => setIsPaymentOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[11px] font-black tracking-tight shadow-md active:scale-95 transition-all"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Expandable Benefits */}
                    {isBoosterExpanded && (
                        <div className="bg-white border-t border-amber-100 px-4 py-3 space-y-3">
                            {[
                                { icon: <Bell size={16} className="text-yellow-500" fill="currentColor" />, bg: 'bg-yellow-50', title: 'Fast Notifications', desc: 'Tasks and updates instantly' },
                                { icon: <ClipboardList size={16} className="text-green-500" />, bg: 'bg-green-50', title: 'Early Task Access', desc: 'New tasks are available first' },
                                { icon: <Coins size={16} className="text-amber-500" fill="currentColor" />, bg: 'bg-amber-50', title: '3X Coin Earnings', desc: '1 task = 3 coins' },
                                { icon: <Lightbulb size={16} className="text-yellow-400" fill="currentColor" />, bg: 'bg-yellow-50', title: 'Business Ideas First', desc: 'Early access to new ideas' },
                                { icon: <AlertCircle size={16} className="text-orange-500" fill="currentColor" />, bg: 'bg-orange-50', title: 'Priority Alerts', desc: 'Important alerts sent first' },
                                { icon: <Rocket size={16} className="text-pink-500" fill="currentColor" />, bg: 'bg-pink-50', title: 'Faster Growth', desc: 'Earn coins 3X faster' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 ${b.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                        {b.icon}
                                    </div>
                                    <div>
                                        <h5 className="text-[12px] font-black text-slate-800 leading-tight">{b.title}</h5>
                                        <p className="text-[10px] font-bold text-slate-400 leading-none">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-6"></div>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={49}
                plan="Task Booster Pack"
                onSuccess={() => {
                    setIsPaymentOpen(false);
                    setIsBoosterExpanded(false);
                }}
            />
        </div>
    );
};

export default Earn;
