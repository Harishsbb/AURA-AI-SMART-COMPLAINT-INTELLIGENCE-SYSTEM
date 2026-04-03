import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Mail, Lock, Loader2, AlertCircle,
    User as UserIcon, ArrowRight, Zap, BarChart2, CheckCircle2
} from 'lucide-react';
import { login, register } from '../services/api';

const FEATURES = [
    { icon: Zap,          text: 'AI-powered complaint analysis in seconds'  },
    { icon: BarChart2,    text: 'Real-time priority & sentiment detection'   },
    { icon: CheckCircle2, text: 'Automated professional response drafting'   },
];

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName]         = useState('');
    const [email, setEmail]       = useState('admin@aura.ai');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = isRegister
                ? await register({ name, email, password })
                : await login(email, password);
            localStorage.setItem('aura_token', data.token);
            localStorage.setItem('aura_user', JSON.stringify(data));
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || (isRegister ? 'Registration failed.' : 'Login failed. Try admin@aura.ai / admin123'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* ── LEFT PANEL — Branding ──────────────────────── */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col pt-16 p-20 justify-between group"
            >
                {/* Full-bleed background */}
                <div className="absolute inset-0 z-0 scale-105 group-hover:scale-110 transition-transform duration-[10000ms] ease-out">
                    <img src="/branding-bg.png" alt="Branding" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                </div>

                {/* Dot grid overlay */}
                <div className="absolute inset-0 bg-dot-pattern-dark opacity-10 pointer-events-none z-[1]" />

                {/* Logo Section - Shifted Up with Balanced Space */}
                <div className="relative z-10 flex items-center space-x-6 animate-fade-in -mt-4">
                    <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 p-1 bg-white/5 backdrop-blur-xl">
                        <img src="/logo.png" alt="Aura Logo" className="w-full h-full object-cover rounded-[20px]" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-3xl tracking-tighter leading-none glow-text">AURA AI</h1>
                        <p className="text-aura-light/50 text-[11px] uppercase tracking-[0.45em] mt-2 font-black">Intelligence Layer</p>
                    </div>
                </div>

                {/* Hero Content - Card Style */}
                <div className="relative z-10 animate-slide-up flex-1 flex flex-col justify-center">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] p-12 max-w-xl shadow-2xl">
                        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-10 overflow-hidden relative">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                            <Zap className="w-4 h-4 text-aura-glow" />
                            <span className="text-white/80 text-[11px] font-black uppercase tracking-widest relative z-10">
                                Global Enterprise v2.0
                            </span>
                        </div>
                        
                        <h2 className="text-[72px] font-black text-white leading-[0.95] mb-10 tracking-tight">
                            Intelligence <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aura-light via-white to-aura-glow">
                                Redefined.
                            </span>
                        </h2>
                        
                        <p className="text-white/40 text-lg leading-relaxed font-medium mb-12">
                            The definitive platform for enterprise complaint intelligence, 
                            leveraging global-scale semantic analysis and generative flows.
                        </p>

                        {/* Minimal Features 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-8">
                             {FEATURES.slice(0, 4).map(({ icon: Icon, text }, i) => (
                                <div key={i} className="space-y-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-aura-light/50 transition-all duration-500">
                                        <Icon className="w-5 h-5 text-white/40 group-hover/item:text-aura-glow" />
                                    </div>
                                    <p className="text-white/40 text-[13px] font-semibold leading-snug group-hover/item:text-white/70 transition-colors">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Credits - Enriched */}
                <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <div className="flex -space-x-3 group/stack">
                            {['JP', 'BA', 'GS', 'MS'].map((initials, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#05041a] bg-white/5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white/50 backdrop-blur-md cursor-pointer">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.4em]">
                                Trusted Network v2.0
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                         <div className="text-right">
                            <p className="text-aura-glow font-black text-sm leading-none tracking-tight">99.8%</p>
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mt-1">Resolution Accuracy</p>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div className="text-right">
                            <p className="text-white font-black text-sm leading-none tracking-tight">1.2M+</p>
                            <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mt-1">Cases Processed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL — Form ─────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-12 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
                {/* Decorative background for right side */}
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03] animate-pulse pointer-events-none bg-indigo-600" />
                
                <div className="w-full max-w-[440px] z-10">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center justify-center space-x-3 mb-10">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl border border-gray-100">
                             <img src="/logo.png" alt="Aura Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-2xl text-aura-dark tracking-tighter">AURA AI</span>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.12)] p-12 lg:p-14 border border-gray-100 dark:border-slate-800 animate-slide-up-subtle">
                        <div className="mb-10 text-center">
                            <h1 className="text-[32px] font-black text-aura-dark dark:text-white tracking-tight mb-2">
                                {isRegister ? 'Join the Future' : 'Welcome back'}
                            </h1>
                            <p className="text-gray-400 dark:text-gray-500 text-base font-medium">
                                {isRegister
                                    ? 'Start your intelligence journey today'
                                    : 'Sign in to your management console'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isRegister && (
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-aura-light transition-colors z-10" />
                                        <input 
                                            className="input-premium" 
                                            style={{ paddingLeft: '3.5rem' }}
                                            type="text" 
                                            placeholder="Your full name"
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                            required={isRegister} 
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-aura-light transition-colors z-10" />
                                    <input 
                                        className="input-premium" 
                                        style={{ paddingLeft: '3.5rem' }}
                                        type="email" 
                                        placeholder="you@email.com"
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-aura-light transition-colors z-10" />
                                    <input 
                                        className="input-premium" 
                                        style={{ paddingLeft: '3.5rem' }}
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center text-sm text-red-600 dark:text-red-400 animate-shake">
                                    <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl font-black text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)' }}
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <span className="tracking-tight text-lg">{isRegister ? 'Get Started' : 'Sign In Now'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <div className="pt-4 text-center">
                                <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                    className="group text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-aura-dark transition-colors">
                                    {isRegister ? 'Already have an account?' : "New to Aura AI?"}{' '}
                                    <span className="font-black text-aura-light group-hover:underline underline-offset-4 decoration-2">
                                        {isRegister ? 'Sign in' : 'Create account'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Demo hint with premium styling */}
                    {!isRegister && (
                        <div className="mt-8 flex flex-col items-center animate-fade-in opacity-60 hover:opacity-100 transition-opacity">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Administrator Access</p>
                            <div className="flex items-center space-x-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 dark:border-slate-800 shadow-sm">
                                <code className="text-xs text-aura-light font-bold">admin@aura.ai</code>
                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                <code className="text-xs text-aura-light font-bold">admin123</code>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
