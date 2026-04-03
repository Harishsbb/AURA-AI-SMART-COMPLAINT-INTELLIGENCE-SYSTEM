import React, { useState } from 'react';
import {
    Shield, Bot, BarChart2, Bell, Settings, MessageSquare,
    CheckCircle2, Users, Zap, Search, Download, Mic,
    LogIn, PlusCircle, Eye, RefreshCw, FileText, Star,
    ChevronRight, BookOpen, UserCheck, Lock
} from 'lucide-react';

const TABS = ['Overview', 'Admin Guide', 'Customer Guide', 'Features'];

/* ── Shared components ─────────────────────────────── */
const StepCard = ({ number, title, desc, icon: Icon, color = 'bg-aura-light/10 text-aura-light' }) => (
    <div className="flex items-start space-x-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
        <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-black text-aura-light uppercase tracking-widest">Step {number}</span>
            </div>
            <h4 className="font-bold text-aura-dark dark:text-white text-sm mb-1">{title}</h4>
            <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc, gradient }) => (
    <div className="relative p-5 rounded-2xl overflow-hidden text-white hover:-translate-y-1 transition-all duration-300 cursor-default" style={{ background: gradient }}>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10">
            <div className="p-2.5 bg-white/20 rounded-xl w-fit mb-4">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-sm mb-1">{title}</h4>
            <p className="text-white/65 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
        <div className="p-1.5 bg-aura-light/10 rounded-lg flex-shrink-0 mt-0.5">
            <Icon className="w-3.5 h-3.5 text-aura-light" />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-aura-dark dark:text-gray-200 font-medium">{value}</p>
        </div>
    </div>
);

/* ── Tab content ───────────────────────────────────── */
function OverviewTab() {
    return (
        <div className="space-y-8">
            {/* Hero */}
            <div
                className="relative rounded-3xl p-8 overflow-hidden text-white"
                style={{ background: 'linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 50%, #2d2a6e 100%)' }}
            >
                <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none animate-float" style={{ background: 'rgba(99,102,241,0.15)' }} />
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.3)' }}>
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-aura-glow text-xs font-bold uppercase tracking-widest">AURA AI Platform</span>
                    </div>
                    <h2 className="text-4xl font-black leading-tight mb-3">
                        Intelligent Complaint<br />Management System
                    </h2>
                    <p className="text-white/60 leading-relaxed">
                        AURA AI is a next-generation banking complaint platform powered by <strong className="text-white">Google Gemini AI</strong>.
                        It automatically analyzes, categorizes, and prioritizes customer complaints — reducing manual effort and improving resolution times.
                    </p>
                </div>
            </div>

            {/* What it does */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <Bot className="w-7 h-7 text-aura-light mb-3" />
                    <h3 className="font-bold text-aura-dark dark:text-white mb-2">What AURA AI Does</h3>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        {[
                            'Automatically reads every complaint using AI',
                            'Detects category (Fraud, Loan, Account, Card, Other)',
                            'Scores sentiment (Positive / Neutral / Negative / Urgent)',
                            'Sets priority level (Low / Medium / High)',
                            'Drafts a professional suggested response',
                            'Provides a live analytics dashboard for admins',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <Users className="w-7 h-7 text-aura-light mb-3" />
                    <h3 className="font-bold text-aura-dark dark:text-white mb-2">Who Uses It</h3>
                    <div className="space-y-4 text-sm">
                        <div className="p-3 bg-aura-bg dark:bg-slate-700/50 rounded-xl">
                            <p className="font-bold text-aura-dark dark:text-white mb-1">👑 Administrators</p>
                            <p className="text-gray-400 text-xs">Bank staff & compliance officers who review, manage, and resolve all incoming complaints system-wide.</p>
                        </div>
                        <div className="p-3 bg-aura-bg dark:bg-slate-700/50 rounded-xl">
                            <p className="font-bold text-aura-dark dark:text-white mb-1">👤 Customers</p>
                            <p className="text-gray-400 text-xs">Bank customers who submit complaints and track their status, with full visibility into AI analysis results.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech stack */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-aura-dark dark:text-white mb-4">Technology Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'AI Engine',   value: 'Google Gemini 1.5 Flash' },
                        { label: 'Frontend',    value: 'React 18 + Tailwind CSS' },
                        { label: 'Backend',     value: 'Node.js + Express'       },
                        { label: 'Database',    value: 'MongoDB Atlas'           },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-3 bg-aura-bg dark:bg-slate-700/50 rounded-xl text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
                            <p className="text-sm font-bold text-aura-dark dark:text-white">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AdminGuideTab() {
    const steps = [
        { icon: LogIn,       title: 'Log In as Admin',          desc: 'Use admin@aura.ai / admin123 on the login page. The system detects your admin role and unlocks all admin features automatically.' },
        { icon: BarChart2,   title: 'View the Dashboard',       desc: 'The Admin Intelligence Console shows 4 gradient stat cards (Total, Pending, Resolved, Resolution Rate), a 7-day trend chart with live data, and a category breakdown pie chart.' },
        { icon: Eye,         title: 'Review Complaint Details',  desc: 'Go to Complaints. Use the filter bar to search by text or filter by priority (High / Medium / Low). Click the chevron (▾) icon on any row to expand the AI-generated response.' },
        { icon: CheckCircle2,'title': 'Resolve Complaints',     desc: 'Click the shield icon (✓) on any pending complaint to mark it as resolved. The status dot changes from pulsing orange to solid green instantly.' },
        { icon: RefreshCw,   title: 'Delete Complaints',        desc: 'Click the trash icon on any complaint to permanently delete it. A confirmation dialog will appear first to prevent accidental deletions.' },
        { icon: BarChart2,   title: 'Use the Analytics Page',   desc: 'The Analytics page shows a full-width bar chart of complaints by category, a donut chart of sentiment distribution, and three summary stat cards.' },
        { icon: Bell,        title: 'Monitor the Alerts Page',  desc: 'The Alerts page shows all high-priority (High) or urgent-sentiment complaints that are still pending — your action queue for critical issues.' },
        { icon: Bot,         title: 'Chat with AURA AI',        desc: 'Use the AI Analysis page to ask the assistant questions. It has live access to your stats and will give context-aware answers. Try: "How many unresolved high-priority issues do I have?"' },
        { icon: Download,    title: 'Export Reports',           desc: 'Click "Export PDF" on the Complaints page to print or save the current view as a PDF using your browser\'s print dialog.' },
        { icon: Settings,    title: 'Adjust Settings',          desc: 'Go to Settings to toggle dark mode. The toggle saves your preference to localStorage so it persists across sessions.' },
    ];

    return (
        <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-aura-light/20 flex items-start space-x-3" style={{ background: 'rgba(99,102,241,0.06)' }}>
                <UserCheck className="w-5 h-5 text-aura-light flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-aura-dark dark:text-white text-sm mb-1">Admin Login Credentials</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Email: <span className="font-bold text-aura-light">admin@aura.ai</span> &nbsp;·&nbsp;
                        Password: <span className="font-bold text-aura-light">admin123</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.map((step, i) => (
                    <StepCard key={i} number={i + 1} {...step} color="bg-aura-light/10 text-aura-light" />
                ))}
            </div>

            {/* Admin-only features note */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-aura-dark dark:text-white mb-3 text-sm">Admin-Only Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Analytics Page', 'Alerts Page', 'Resolve Button', 'Delete Button', 'System Stats', '7-Day Trend Chart', 'All User Complaints', 'AI Context Data'].map(f => (
                        <div key={f} className="flex items-center space-x-1.5 text-xs">
                            <Lock className="w-3 h-3 text-aura-light flex-shrink-0" />
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CustomerGuideTab() {
    const steps = [
        { icon: LogIn,        title: 'Create an Account',        desc: 'Click "Register now" on the login page. Enter your name, email, and password. Your account is created as a Customer role automatically.' },
        { icon: PlusCircle,   title: 'Submit a Complaint',       desc: 'Go to the Complaints page and use the form on the right. Type your issue in detail (up to 500 characters). You can also use the microphone button for voice input.' },
        { icon: Zap,          title: 'AI Analyzes Instantly',    desc: 'After you click "Analyze & Submit", the AI processes your complaint in seconds and returns: Category, Sentiment, Priority level, and a Suggested Response.' },
        { icon: Eye,          title: 'See AI Results',           desc: 'A green result card appears below the form showing the AI analysis. The priority is color-coded: Red=High, Orange=Medium, Blue=Low.' },
        { icon: Search,       title: 'Track Your Complaints',    desc: 'All your submitted complaints appear in the table on the left. You can filter by priority (High/Medium/Low) or search by text or category.' },
        { icon: ChevronRight, title: 'View AI Suggested Response',desc: 'Click the chevron (▾) icon next to any complaint row to expand the AI-generated suggested response that will be sent to you.' },
        { icon: BarChart2,    title: 'Check Your Dashboard',    desc: 'Your Customer Dashboard shows your total requests, pending count, and resolved count as colored stat cards. Recent submissions are listed below.' },
        { icon: Bot,          title: 'Ask the AI Assistant',     desc: 'Visit the AI Analysis page to ask questions like "What is the status of my complaints?" or "How long does resolution take?" — the AI reads your data.' },
        { icon: Settings,     title: 'Customize Your Experience',desc: 'Go to Settings to toggle between light and dark mode at any time.' },
    ];

    return (
        <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-green-200 dark:border-green-500/20 flex items-start space-x-3 bg-green-50/60 dark:bg-green-500/5">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-aura-dark dark:text-white text-sm mb-1">Getting Started</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Register as a new customer or log in with your existing account. Customers only see their own complaints.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.map((step, i) => (
                    <StepCard key={i} number={i + 1} {...step} color="bg-green-500/10 text-green-600" />
                ))}
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-aura-orange" />
                    <h4 className="font-bold text-aura-dark dark:text-white text-sm">Pro Tips for Better Results</h4>
                </div>
                <ul className="space-y-2">
                    {[
                        'Be specific in your complaint — mention account numbers, dates, and exact issues for faster resolution.',
                        'Use voice input if typing is inconvenient — click the mic button in the form.',
                        'Check your Dashboard regularly to monitor the status of open complaints.',
                        'Read the AI Suggested Response to understand how staff will respond to your issue.',
                        'Use the AI Assistant page to ask questions about your complaint history anytime.',
                    ].map((tip, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <ChevronRight className="w-3.5 h-3.5 text-aura-light flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function FeaturesTab() {
    const features = [
        { icon: Bot,          title: 'Gemini AI Analysis',       desc: 'Every complaint is instantly analyzed by Google Gemini 1.5 Flash for category, sentiment, priority, and a suggested response.',  gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' },
        { icon: BarChart2,    title: 'Live Analytics Dashboard', desc: 'Admins see real-time stats, 7-day trend charts, category breakdowns, and resolution rates — all powered by live MongoDB aggregations.', gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' },
        { icon: Bell,         title: 'Smart Alerts System',      desc: 'The Alerts page surfaces only high-priority or urgent-sentiment pending complaints for immediate admin attention.',                   gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { icon: Bot,          title: 'AI Chat Assistant',        desc: 'A conversational AI powered by Gemini that has live access to your system data. Ask questions, get insights, and more.',           gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
        { icon: Mic,          title: 'Voice Input',              desc: 'Submit complaints hands-free using the Web Speech API built into the complaint form.',                                              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { icon: Search,       title: 'Search & Filter',          desc: 'Filter complaints by priority level (High/Medium/Low) or search free-text by complaint content or category.',                      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
        { icon: Shield,       title: 'Role-Based Access',        desc: 'JWT-authenticated system with two roles: Admin (full system access) and Customer (personal complaints only).',                     gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)' },
        { icon: Download,     title: 'PDF Export',               desc: 'Export the current complaint view as a PDF report directly from the Complaints page using the browser print dialog.',               gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
        { icon: FileText,     title: 'Expandable AI Responses',  desc: 'Every complaint in the table has an expandable panel showing the AI-generated suggested response for that specific issue.',         gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
        { icon: Settings,     title: 'Dark Mode',                desc: 'Full dark mode support across every page and component. Toggle via Settings or the moon icon in the navbar.',                      gradient: 'linear-gradient(135deg, #374151 0%, #111827 100%)' },
        { icon: RefreshCw,    title: 'Real-Time Updates',        desc: 'Dashboard and complaint list refresh automatically after submitting or updating a complaint — no page reload needed.',             gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' },
        { icon: Users,        title: 'Multi-User Support',       desc: 'Multiple customers can register and submit complaints simultaneously. Admins see all complaints in one unified interface.',         gradient: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)' },
    ];

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-sm">
                AURA AI packs <strong className="text-aura-dark dark:text-white">{features.length} core features</strong> into a single platform. Here's a complete breakdown:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => <FeatureCard key={i} {...f} />)}
            </div>
        </div>
    );
}

/* ── Main Page ─────────────────────────────────────── */
const Notes = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabContent = [<OverviewTab />, <AdminGuideTab />, <CustomerGuideTab />, <FeaturesTab />];

    return (
        <div className="space-y-6 animate-slide-up">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-aura-dark dark:text-white">Platform Guide & Notes</h1>
                            <p className="text-gray-400 text-xs font-medium">Complete usage documentation for AURA AI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-sm border border-gray-100 dark:border-slate-700 w-fit">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            activeTab === i
                                ? 'text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                        style={activeTab === i ? { background: 'linear-gradient(135deg, #1e1b4b, #6366f1)' } : {}}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="animate-slide-up" key={activeTab}>
                {tabContent[activeTab]}
            </div>
        </div>
    );
};

export default Notes;
