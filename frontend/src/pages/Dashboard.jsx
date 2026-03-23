import React, { useState, useEffect } from 'react';
import { 
    Users, 
    MessageSquare, 
    AlertCircle, 
    CheckCircle2, 
    TrendingUp,
    MoreHorizontal 
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { fetchStats } from '../services/api';

const COLORS = ['#0B3C5D', '#328CC1', '#F4A261', '#cbd5e1', '#8b5cf6'];

const StatCard = ({ title, value, icon: Icon, trend, color, loading }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && !loading && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-aura-dark dark:text-white mt-1">
            {loading ? <div className="h-8 w-16 bg-gray-100 dark:bg-slate-700 animate-pulse rounded"></div> : value}
        </h3>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const token = localStorage.getItem('aura_token');
                const data = await fetchStats(token);
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const chartData = [
        { name: 'Mon', complaints: 40 },
        { name: 'Tue', complaints: 30 },
        { name: 'Wed', complaints: 45 },
        { name: 'Thu', complaints: 28 },
        { name: 'Fri', complaints: 55 },
        { name: 'Sat', complaints: 20 },
        { name: 'Sun', complaints: 15 },
    ];

    const categoryData = stats?.byCategory || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold text-aura-dark dark:text-white">Executive Dashboard</h1>
                <p className="text-gray-400 text-sm font-medium">Real-time intelligence from customer interactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Complaints" 
                    value={stats?.total || 0} 
                    icon={MessageSquare} 
                    trend={12.5}
                    color="bg-aura-light"
                    loading={loading}
                />
                <StatCard 
                    title="Pending Resolution" 
                    value={stats?.pending || 0} 
                    icon={AlertCircle} 
                    trend={-2.4}
                    color="bg-aura-orange"
                    loading={loading}
                />
                <StatCard 
                    title="Resolved Cases" 
                    value={stats?.resolved || 0} 
                    icon={CheckCircle2} 
                    trend={8.2}
                    color="bg-green-500"
                    loading={loading}
                />
                <StatCard 
                    title="Avg. Response Time" 
                    value="2.4h" 
                    icon={TrendingUp} 
                    trend={-15}
                    color="bg-purple-500"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-aura-dark dark:text-white">Complaint Volume</h3>
                        <button className="text-gray-400 hover:text-aura-dark dark:hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#328CC1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#328CC1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                    }} 
                                    cursor={{ stroke: '#328CC1', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="complaints" 
                                    stroke="#328CC1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorComplaints)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-[400px]">
                    <h3 className="font-bold text-aura-dark dark:text-white mb-6">By Category</h3>
                    <div className="flex-1 w-full min-h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData.length > 0 ? categoryData : [{ name: 'None', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(categoryData.length > 0 ? categoryData : [{ name: 'None', value: 1 }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        border: 'none', 
                                        borderRadius: '8px',
                                        color: '#fff' 
                                    }} 
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4 overflow-y-auto max-h-[120px] pr-2 custom-scrollbar">
                        {categoryData.length > 0 ? categoryData.map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">{item.name}</span>
                                </div>
                                <span className="text-aura-dark dark:text-white font-bold">
                                    {((item.value / stats.total) * 100).toFixed(0)}%
                                </span>
                            </div>
                        )) : (
                            <div className="text-center py-4 text-gray-400 text-xs italic">No classification data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

