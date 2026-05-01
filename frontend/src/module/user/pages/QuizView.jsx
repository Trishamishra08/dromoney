import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, Timer, Trophy, Coins, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../../shared/services/api';

const QuizView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData, addCoins } = useUser();
    
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Questions, 2: Result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isEventClosed, setIsEventClosed] = useState(false);

    const QUESTIONS = eventData?.config?.questions || [];
    const totalQ = QUESTIONS.length;
    
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/public/events/${id}`);
                if (res.success) {
                    setEventData(res.data);
                }
            } catch (err) {
                console.error("Error fetching event:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();

        // Check if event is already completed
        const completed = JSON.parse(localStorage.getItem('dromoney_completed_events') || '[]');
        if (completed.includes(id)) {
            setIsEventClosed(true);
            setCurrentStep(2);
            setScore(10); // Assume full score if already done for demo
        }
    }, [id]);

    useEffect(() => {
        let timer;
        if (currentStep === 1 && !isAnswered && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isAnswered) {
            handleNext();
        }
        return () => clearInterval(timer);
    }, [currentStep, timeLeft, isAnswered]);

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        let newScore = score;
        if (index === QUESTIONS[currentQuestion].answer) {
            newScore = score + 1;
            setScore(newScore);
        }
        setTimeout(() => { handleNext(); }, 1000);
    };

    const handleNext = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(15);
        } else {
            handleFinish(score);
        }
    };

    const handleFinish = async (finalScore) => {
        const s = finalScore !== undefined ? finalScore : score;
        setCurrentStep(2);
        const completed = JSON.parse(localStorage.getItem('dromoney_completed_events') || '[]');
        if (!completed.includes(id)) {
            completed.push(id);
            localStorage.setItem('dromoney_completed_events', JSON.stringify(completed));
            
            // Add coins locally for immediate feedback
            addCoins(s * 10, `Quiz Prize: ${eventData?.title || 'Event'}`);

            try {
                // Save result to Backend
                await api.post(`/user/data/events/${id}/submit`, {
                    score: s,
                    result: `${s}/${totalQ}`,
                    prize: `${s * 10} Coins`
                });
            } catch (err) {
                console.error("Failed to save result to server:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (currentStep === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col p-6 animate-in fade-in duration-500">
                <header className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/user/events')} className="p-2 bg-slate-50 rounded-full">
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">{eventData?.title || 'Quiz'}</h1>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-indigo-100 border-4 border-white rotate-3">
                        <Sparkles size={64} className="text-indigo-500" />
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-800 leading-tight">Ready for the challenge?</h2>
                        <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm leading-relaxed uppercase tracking-tighter">
                            Answer 10 simple questions and win up to ₹500 in your wallet instantly! 
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Questions</p>
                            <p className="text-lg font-black text-slate-800">10</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Time/Ques</p>
                            <p className="text-lg font-black text-slate-800">15s</p>
                        </div>
                    </div>
                </div>

                {isEventClosed ? (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 mb-6">
                        <AlertCircle className="text-amber-500" size={20} />
                        <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">You have already completed this quiz today!</p>
                    </div>
                ) : (
                    <button 
                        onClick={() => setCurrentStep(1)}
                        className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-100 active:scale-95 transition-all mb-8"
                    >
                        Start Now
                    </button>
                )}
            </div>
        );
    }

    if (currentStep === 1) {
        const question = QUESTIONS[currentQuestion];
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-0 animate-in fade-in duration-300">
                {/* Progress Header */}
                <div className="bg-white px-6 py-8 rounded-b-[3rem] shadow-xl shadow-slate-200/50 z-10 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest border border-blue-100">
                            Question {currentQuestion + 1}/{totalQ}
                        </span>
                        <div className="flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">
                            <Timer size={16} className={`text-rose-500 ${timeLeft < 5 ? 'animate-pulse' : ''}`} />
                            <span className={`text-[14px] font-black ${timeLeft < 5 ? 'text-rose-600' : 'text-slate-700'}`}>{timeLeft}s</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-0.5">
                        <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${((currentQuestion + 1) / totalQ) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 px-6 py-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-black text-slate-800 mb-10 leading-snug tracking-tight">
                        {question.question}
                    </h2>

                    <div className="space-y-4">
                        {question.options.map((option, index) => {
                            let statusClasses = "bg-white border-slate-100 text-slate-700";
                            if (isAnswered) {
                                if (index === question.answer) {
                                    statusClasses = "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100";
                                } else if (index === selectedOption) {
                                    statusClasses = "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100";
                                } else {
                                    statusClasses = "bg-white border-slate-100 text-slate-300 opacity-50";
                                }
                            } else if (selectedOption === index) {
                                statusClasses = "bg-blue-50 border-blue-500 text-blue-700";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswered}
                                    className={`w-full p-5 rounded-3xl border-2 text-left font-black transition-all flex items-center justify-between group ${statusClasses}`}
                                >
                                    <span className="text-[15px] uppercase tracking-tight">{option}</span>
                                    {isAnswered && index === QUESTIONS[currentQuestion].answer && <CheckCircle2 size={24} className="text-emerald-500" />}
                                    {isAnswered && index === selectedOption && index !== QUESTIONS[currentQuestion].answer && <XCircle size={24} className="text-rose-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col p-6 animate-in zoom-in-95 duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
                <div className="relative">
                    <div className="w-40 h-40 bg-emerald-50 rounded-[3rem] flex items-center justify-center border-4 border-white shadow-2xl animate-in zoom-in duration-700">
                        <Trophy size={80} className="text-emerald-500" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-amber-400 p-4 rounded-full shadow-lg border-4 border-white">
                        <Sparkles size={24} className="text-white fill-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Victory!</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Quiz finished successfully</p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 w-full max-w-xs space-y-6">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Your Final Score</p>
                        <div className="flex items-center justify-center gap-2">
                             <span className="text-5xl font-black text-slate-800">{score}</span>
                             <span className="text-lg font-black text-slate-400 mt-4">/ {totalQ}</span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-slate-200"></div>
                    <div className="flex items-center justify-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-xl">
                            <Coins size={20} className="text-amber-600 fill-amber-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-amber-600 uppercase leading-none mb-1">Total Prize</p>
                            <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">+{score * 10} Coins</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                        <CheckCircle2 size={24} className="text-blue-500" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Event Status</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Closing for verification...</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => navigate('/user/events')}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all mb-8 flex items-center justify-center gap-3"
            >
                Continue <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default QuizView;
