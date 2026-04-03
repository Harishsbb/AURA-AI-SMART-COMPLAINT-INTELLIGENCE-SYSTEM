import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Activity, MoreHorizontal, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { fetchStats, fetchComplaints, fetchTrends } from '../services/api';

const COLORS = ['#6366f1', '#818cf8', '#f59e0b', '#ec4899', '#10b981'];

const StatCard = ({ title, value, icon: Icon, trend, gradient, glowClass, loading }) => (
    <div
        className={`relative p-6 rounded-2xl overflow-hidden text-white transition-all duration-300 hover:-translate-y-1 cursor-default ${glowClass}`}
        style={{ background: gradient }}
    >
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend !== undefined && !loading && (
                    <div className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <p className="text-white/65 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-black">
                {loading ? <div className="h-9 w-16 bg-white/20 animate-pulse rounded-lg" /> : value}
            </h3>
        </div>
    </div>
);

const STAT_CARDS = [
    { key: 'total',    title: 'Total Complaints',   icon: MessageSquare, gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', glowClass: 'card-glow-indigo' },
    { key: 'pending',  title: 'Pending Resolution', icon: AlertCircle,   gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', glowClass: 'card-glow-amber'  },
    { key: 'resolved', title: 'Resolved Cases',     icon: CheckCircle2,  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', glowClass: 'card-glow-green'  },
    { key: 'rate',     title: 'Resolution Rate',    icon: Activity,      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', glowClass: 'card-glow-pink'   },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('aura_token');
                const [statsData, complaintsData, trendsData] = await Promise.all([
                    fetchStats(token), fetchComplaints(token), fetchTrends(token),
                ]);
                setStats(statsData);
                setRecentComplaints(complaintsData.slice(0, 5));
                setTrendData(trendsData);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadData();
    }, []);

    const categoryData   = stats?.byCategory || [];
    const resolutionRate = stats?.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
    const statValues     = { total: stats?.total ?? 0, pending: stats?.pending ?? 0, resolved: stats?.resolved ?? 0, rate: `${resolutionRate}%` };

    return (
        <div className="space-y-7 animate-slide-up">
            <div>
                <h1 className="text-2xl font-black text-aura-dark dark:text-white">Admin Intelligence Console</h1>
                <p className="text-gray-400 text-sm font-medium mt-0.5">Global oversight of all complaint vectors</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {STAT_CARDS.map(card => (
                    <StatCard key={card.key} {...card} value={statValues[card.key]} loading={loading} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Area chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 flex flex-col h-[380px]">
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="font-bold text-aura-dark dark:text-white">7-Day Complaint Volume</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Live data — last 7 days</p>
                        </div>
                        <button className="p-2 text-gray-300 hover:text-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        {loading
                            ? <div className="h-full shimmer rounded-xl" />
                            : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.20} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', fontSize: 12 }} cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                                        <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGrad)" dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )
                        }
                    </div>
                </div>

                {/* Pie chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 flex flex-col h-[380px]">
                    <h3 className="font-bold text-aura-dark dark:text-white mb-5">Category Breakdown</h3>
                    <div className="flex-1 flex flex-col justify-center items-center min-h-0 relative">
                        {loading ? (
                            <div className="h-40 w-40 shimmer rounded-full" />
                        ) : categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12, fontWeight: '600' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                                <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-200 dark:border-slate-700" />
                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">No data records</p>
                            </div>
                        )}
                    </div>
                    
                    {categoryData.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-6 max-h-[120px] overflow-y-auto pr-1">
                            {categoryData.map((item, i) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{item.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 w-16 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.total ? (item.value/stats.total)*100 : 0}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                                        </div>
                                        <span className="text-[13px] font-bold text-aura-dark dark:text-white w-8 text-right">
                                            {stats?.total ? ((item.value/stats.total)*100).toFixed(0) : 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-50 dark:border-slate-700">
                    <div>
                        <h3 className="font-bold text-aura-dark dark:text-white">Recent Submissions</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Latest customer-reported issues</p>
                    </div>
                    <a href="/complaints" className="text-sm font-bold text-aura-light flex items-center space-x-1.5 px-3 py-2 bg-aura-light/8 hover:bg-aura-light/15 rounded-xl transition-all">
                        <span>View All</span><ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/20">
                                {['Customer','Complaint','Category','Priority','Status'].map(h => (
                                    <th key={h} className={`px-5 py-3.5 ${h==='Status'?'text-right':''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/40">
                            {loading ? [1,2,3].map(i => (
                                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-8 shimmer rounded-lg" /></td></tr>
                            )) : recentComplaints.map(c => (
                                <tr key={c._id} className="hover:bg-aura-bg/40 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                                                {c.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-aura-dark dark:text-white">{c.user?.name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-gray-400">{c.user?.email || ''}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 max-w-xs">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{c.text}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-[10px] font-bold px-2.5 py-1 bg-aura-light/10 text-aura-light rounded-lg">{c.category}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                                            c.priority==='High'   ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                            c.priority==='Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                                                     'bg-aura-light/10 text-aura-light'
                                        }`}>{c.priority}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${c.status==='resolved'?'bg-green-500':'bg-aura-orange animate-pulse'}`} />
                                            <span className="text-xs font-semibold capitalize text-gray-600 dark:text-gray-300">{c.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && recentComplaints.length===0 && (
                                <tr><td colSpan={5} className="text-center py-14 text-gray-400 text-sm">No recent activity</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
