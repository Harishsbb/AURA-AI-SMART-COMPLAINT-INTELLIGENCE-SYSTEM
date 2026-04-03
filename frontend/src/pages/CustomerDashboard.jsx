import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchComplaints } from '../services/api';

const QuickStat = ({ title, value, gradient, glowClass, icon: Icon, loading }) => (
    <div
        className={`relative p-5 rounded-2xl overflow-hidden text-white ${glowClass} hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
        style={{ background: gradient }}
    >
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center space-x-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-white/65 text-xs font-medium mb-0.5">{title}</p>
                <h3 className="text-2xl font-black">
                    {loading ? <div className="h-7 w-10 bg-white/20 animate-pulse rounded-lg" /> : value}
                </h3>
            </div>
        </div>
    </div>
);

const HOW_IT_WORKS = [
    { step: '01', title: 'Submit',  desc: 'Type or speak your complaint. Voice input supported.'             },
    { step: '02', title: 'Analyze', desc: 'Gemini AI instantly categorizes, rates priority & sentiment.'     },
    { step: '03', title: 'Resolve', desc: 'Staff reviews AI insights and resolves your issue fast.'          },
];

const CustomerDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('aura_user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('aura_token');
        fetchComplaints(token).then(setComplaints).catch(console.error).finally(() => setLoading(false));
    }, []);

    const pendingCount  = complaints.filter(c => c.status === 'pending').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
    const firstName     = user.name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-7 animate-slide-up">

            {/* ── Welcome Banner ───────────────────────── */}
            <div
                className="relative rounded-3xl p-7 overflow-hidden text-white"
                style={{ background: 'linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 50%, #2d2a6e 100%)' }}
            >
                <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ background: 'rgba(99,102,241,0.15)' }} />
                <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(236,72,153,0.08)' }} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-4 h-4 text-aura-glow" />
                            <span className="text-aura-glow text-xs font-bold uppercase tracking-widest">AI-Powered Support</span>
                        </div>
                        <h1 className="text-3xl font-black leading-tight mb-1.5">Hello, {firstName}</h1>
                        <p className="text-white/50 text-sm">Track your submissions and let AI work for you.</p>
                    </div>
                    <Link
                        to="/complaints"
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-aura-dark bg-white hover:bg-aura-glow hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg flex-shrink-0 self-start md:self-center"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>New Complaint</span>
                    </Link>
                </div>
            </div>

            {/* ── Stats ────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <QuickStat title="Total Requests" value={complaints.length}  gradient="linear-gradient(135deg, #6366f1 0%, #818cf8 100%)" glowClass="card-glow-indigo" icon={MessageSquare} loading={loading} />
                <QuickStat title="Pending"        value={pendingCount}       gradient="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" glowClass="card-glow-amber"  icon={Clock}         loading={loading} />
                <QuickStat title="Resolved"       value={resolvedCount}      gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" glowClass="card-glow-green"  icon={CheckCircle2}  loading={loading} />
            </div>

            {/* ── Recent + How it works ─────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Recent submissions */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50 dark:border-slate-700">
                        <h3 className="font-bold text-aura-dark dark:text-white">Recent Submissions</h3>
                        <Link to="/complaints" className="text-aura-light text-sm font-bold flex items-center space-x-1 hover:text-aura-dark dark:hover:text-white transition-colors">
                            <span>View All</span><ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="p-5 space-y-3">
                        {loading ? (
                            [1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-2xl" />)
                        ) : complaints.length > 0 ? (
                            complaints.slice(0, 4).map(c => (
                                <div key={c._id} className="p-4 bg-aura-bg/60 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-aura-light/30 hover:bg-white dark:hover:bg-slate-800 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-aura-light/10 text-aura-light rounded-md">{c.category}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            c.status === 'resolved'
                                                ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                        }`}>{c.status}</span>
                                    </div>
                                    <p className="text-sm text-aura-dark dark:text-gray-200 font-medium line-clamp-1">{c.text}</p>
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-14">
                                <div className="w-16 h-16 bg-aura-bg dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-7 h-7 text-aura-light/40" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No complaints submitted yet.</p>
                                <Link to="/complaints" className="mt-3 inline-block text-aura-light text-sm font-bold hover:underline">Submit your first one →</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* How it works + AI badge */}
                <div className="lg:col-span-2 space-y-4">
                    <div
                        className="rounded-2xl p-6 text-white relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 60%, #2d2a6e 100%)' }}
                    >
                        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-5">
                                <Sparkles className="w-4 h-4 text-aura-glow" />
                                <h3 className="font-bold text-white">How It Works</h3>
                            </div>
                            <div className="space-y-5">
                                {HOW_IT_WORKS.map(({ step, title, desc }) => (
                                    <div key={step} className="flex items-start space-x-4">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs text-aura-glow border border-aura-glow/30 bg-aura-glow/10">
                                            {step}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{title}</p>
                                            <p className="text-white/50 text-xs leading-relaxed mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-card">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <p className="font-bold text-aura-dark dark:text-white text-sm">AI Processing</p>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Every submission is instantly analyzed by <span className="text-aura-light font-semibold">Google Gemini AI</span> for priority, category, and a suggested resolution.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
