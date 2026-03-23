import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    PlusCircle,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchComplaints } from '../services/api';

const QuickStat = ({ title, value, color, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-aura-dark dark:text-white capitalize">{value}</h3>
            </div>
        </div>
    </div>
);

const CustomerDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('aura_user') || '{}');

    useEffect(() => {
        const loadComplaints = async () => {
            try {
                const token = localStorage.getItem('aura_token');
                const data = await fetchComplaints(token);
                setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadComplaints();
    }, []);

    const pendingCount = complaints.filter(c => c.status === 'pending').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-aura-dark dark:text-white">Hello, {user.name || 'Customer'}</h1>
                    <p className="text-gray-400 text-sm font-medium">Track and manage your submitted support requests</p>
                </div>
                <Link 
                    to="/complaints" 
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-aura-light text-white rounded-xl font-bold hover:shadow-lg hover:shadow-aura-light/20 transition-all hover:-translate-y-0.5"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Post New Complaint</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickStat 
                    title="Total Requests" 
                    value={complaints.length} 
                    icon={MessageSquare} 
                    color="bg-aura-light" 
                />
                <QuickStat 
                    title="Pending" 
                    value={pendingCount} 
                    icon={Clock} 
                    color="bg-aura-orange" 
                />
                <QuickStat 
                    title="Resolved" 
                    value={resolvedCount} 
                    icon={CheckCircle2} 
                    color="bg-green-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-aura-dark dark:text-white">Recent Submissions</h3>
                        <Link to="/complaints" className="text-aura-light text-sm font-bold flex items-center hover:underline">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        {loading ? (
                            [1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-slate-700/50 animate-pulse rounded-2xl"></div>)
                        ) : complaints.length > 0 ? (
                            complaints.slice(0, 3).map(c => (
                                <div key={c._id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-aura-light/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-aura-light/10 text-aura-light rounded-md">
                                            {c.category}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-aura-orange/10 text-aura-orange'}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-aura-dark dark:text-gray-300 font-medium line-clamp-1">{c.text}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 text-sm">You haven't submitted any complaints yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-aura-dark rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4">How it works</h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <p className="text-sm text-white/70">Submit your concern using text or voice input.</p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <p className="text-sm text-white/70">Our AI engine analyzes the priority and category instantly.</p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <p className="text-sm text-white/70">Staff members review the AI findings and resolve your issue.</p>
                            </div>
                        </div>
                    </div>
                    <CheckCircle2 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 transition-transform group-hover:scale-110 duration-700" />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
