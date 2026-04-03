import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Login from './pages/Login';
import AIAnalysis from './pages/AIAnalysis';
import Notes from './pages/Notes';
import { fetchStats, fetchComplaints } from './services/api';

const COLORS = ['#6366f1', '#818cf8', '#f59e0b', '#ec4899', '#10b981'];
const SENTIMENT_COLORS = { Positive: '#10b981', Neutral: '#94a3b8', Negative: '#f97316', Urgent: '#ef4444' };

function Analytics() {
    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('aura_token');
        Promise.all([fetchStats(token), fetchComplaints(token)])
            .then(([s, c]) => { setStats(s); setComplaints(c); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const sentimentMap = {};
    complaints.forEach(c => {
        sentimentMap[c.sentiment] = (sentimentMap[c.sentiment] || 0) + 1;
    });
    const sentimentData = Object.entries(sentimentMap).map(([name, value]) => ({ name, value }));

    const resolutionRate = stats?.total > 0
        ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold text-aura-dark dark:text-white">In-depth Analytics</h1>
                <p className="text-gray-400 text-sm font-medium">AI-powered insights across all complaint vectors</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-aura-light/10 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-aura-light" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Resolution Rate</p>
                    </div>
                    <p className="text-3xl font-black text-aura-dark dark:text-white">{loading ? '—' : `${resolutionRate}%`}</p>
                    <div className="mt-3 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: loading ? '0%' : `${resolutionRate}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                        />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-500/10 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Resolved</p>
                    </div>
                    <p className="text-3xl font-black text-aura-dark dark:text-white">{loading ? '—' : stats?.resolved ?? 0}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-aura-orange/10 rounded-xl">
                            <Clock className="w-5 h-5 text-aura-orange" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Still Pending</p>
                    </div>
                    <p className="text-3xl font-black text-aura-dark dark:text-white">{loading ? '—' : stats?.pending ?? 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Bar Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-aura-dark dark:text-white mb-6">Complaints by Category</h3>
                    {loading ? (
                        <div className="h-64 bg-gray-50 dark:bg-slate-700/30 animate-pulse rounded-xl"></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats?.byCategory || []} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" name="Complaints" radius={[6, 6, 0, 0]}>
                                    {(stats?.byCategory || []).map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Sentiment Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-aura-dark dark:text-white mb-6">Sentiment Distribution</h3>
                    {loading ? (
                        <div className="h-64 bg-gray-50 dark:bg-slate-700/30 animate-pulse rounded-xl"></div>
                    ) : sentimentData.length > 0 ? (
                        <div className="flex items-center">
                            <ResponsiveContainer width="55%" height={220}>
                                <PieChart>
                                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                        {sentimentData.map((entry) => (
                                            <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name] || '#94a3b8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {sentimentData.map(item => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[item.name] || '#94a3b8' }}></div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-aura-dark dark:text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No sentiment data available yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Settings({ darkMode, setDarkMode }) {
    return (
        <div className="p-10 max-w-4xl animate-in fade-in slide-in-from-left-4 duration-500 text-left">
            <h1 className="text-3xl font-black text-aura-dark dark:text-white mb-2 text-left">Platform Settings</h1>
            <p className="text-gray-400 font-medium mb-10 text-left">Customize your AURA AI experience</p>

            <div className="grid gap-6 text-left">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group hover:shadow-xl hover:shadow-aura-dark/5 transition-all">
                    <div className="flex items-center space-x-6">
                        <div className={`p-4 rounded-2xl transition-colors ${darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-aura-dark/10 text-aura-dark'}`}>
                            <div className={`w-8 h-8 rounded-full border-4 border-current border-t-transparent ${darkMode ? 'animate-spin' : ''}`}></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-aura-dark dark:text-white">Dark Mode Appearance</h3>
                            <p className="text-sm text-gray-400 font-medium">Reduce eye strain in low-light environments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${darkMode ? 'bg-aura-light' : 'bg-gray-200'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500 transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 opacity-50 cursor-not-allowed">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl text-gray-400">
                                <div className="w-8 h-8 flex items-center justify-center font-bold">@</div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-aura-dark dark:text-white">Email Notifications</h3>
                                <p className="text-sm text-gray-400 font-medium">Manage how you receive alerts (Admin Only)</p>
                            </div>
                        </div>
                        <div className="w-14 h-8 bg-gray-100 dark:bg-slate-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Alerts() {
    const [highPriority, setHighPriority] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('aura_token');
        fetchComplaints(token)
            .then(data => {
                const urgent = data.filter(c =>
                    (c.priority === 'High' || c.sentiment === 'Urgent') && c.status === 'pending'
                );
                setHighPriority(urgent);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold text-aura-dark dark:text-white">Security Alerts</h1>
                <p className="text-gray-400 text-sm font-medium">High-priority and urgent complaints requiring immediate attention</p>
            </div>

            {/* System Status */}
            <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-4 rounded-xl flex items-center shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">All AI categorization systems are currently operational.</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl flex items-center shadow-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">System Maintenance scheduled for 02:00 AM UTC.</p>
                </div>
            </div>

            {/* Live High-Priority Complaints */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="font-bold text-aura-dark dark:text-white">Active High-Priority Complaints</h2>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg">
                        {loading ? '…' : `${highPriority.length} open`}
                    </span>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-slate-700/30 animate-pulse rounded-xl"></div>)}
                    </div>
                ) : highPriority.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm font-medium">No high-priority issues at this time.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
                        {highPriority.map(c => (
                            <div key={c._id} className="p-5 flex items-start justify-between hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                <div className="flex items-start space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-aura-dark dark:text-white line-clamp-1">{c.text}</p>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">
                                                {c.priority} Priority
                                            </span>
                                            <span className="text-[10px] text-gray-400">{c.user?.name || 'Anonymous'}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 bg-aura-light/10 text-aura-light rounded-lg flex-shrink-0 ml-4">
                                    {c.category}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function App() {
    const isAuthenticated = !!localStorage.getItem('aura_token');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('aura_dark_mode') === 'true');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('aura_dark_mode', darkMode);
    }, [darkMode]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={isAuthenticated ? <Layout /> : <Login />}>
                    <Route index element={<Dashboard />} />
                    <Route path="complaints" element={<Complaints />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="ai" element={<AIAnalysis />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
