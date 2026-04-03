import React, { useState, useEffect } from 'react';
import {
    Search, Download, MessageSquare, Clock, ShieldCheck, Trash2, ChevronDown, ChevronUp, Bot
} from 'lucide-react';
import { fetchComplaints, updateComplaintStatus, deleteComplaint } from '../services/api';
import ComplaintForm from '../components/ComplaintForm';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');
    const [expandedId, setExpandedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.isAdmin;

    useEffect(() => {
        loadComplaints();
    }, []);

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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('aura_token');
            await updateComplaintStatus(id, newStatus, token);
            loadComplaints();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this complaint? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            const token = localStorage.getItem('aura_token');
            await deleteComplaint(id, token);
            setComplaints(prev => prev.filter(c => c._id !== id));
            if (expandedId === id) setExpandedId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const getPriorityColor = (p) => {
        switch (p?.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
            case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
            case 'low': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const filtered = complaints.filter(c => {
        const matchesSearch =
            c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const exportToPDF = () => { window.print(); };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-aura-dark dark:text-white">
                        {isAdmin ? 'System-wide Complaints' : 'Your Personal Submissions'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isAdmin ? 'Review and resolve AI-processed customer issues' : 'Track the status and AI insights of your reports'}
                    </p>
                </div>
                <button
                    onClick={exportToPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-gray-600 dark:text-gray-300"
                >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    {/* Search + Filter Bar */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by message or category..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-aura-light/20 transition-all dark:text-gray-200 dark:placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-1 bg-gray-50 dark:bg-slate-700 p-1 rounded-xl">
                            {['All', 'High', 'Medium', 'Low'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setFilterPriority(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPriority === p ? 'bg-white dark:bg-slate-600 shadow-sm text-aura-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Complaints Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-700/30 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100 dark:border-slate-700">
                                    <th className="px-6 py-4">Complaint Details</th>
                                    <th className="px-6 py-4">AI Analysis</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                {loading ? (
                                    [1,2,3,4].map(i => (
                                        <tr key={i}>
                                            <td colSpan="4" className="px-6 py-4">
                                                <div className="h-10 bg-gray-50 dark:bg-slate-700/30 animate-pulse rounded-lg"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filtered.length > 0 ? filtered.map((c) => (
                                    <React.Fragment key={c._id}>
                                        <tr className={`hover:bg-gray-50/30 dark:hover:bg-slate-700/20 transition-colors ${deletingId === c._id ? 'opacity-40' : ''}`}>
                                            <td className="px-6 py-5">
                                                <div className="max-w-xs md:max-w-sm">
                                                    <p className="text-sm text-aura-dark dark:text-gray-200 font-medium line-clamp-2 mb-1">{c.text}</p>
                                                    <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                                                        <div className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {new Date(c.createdAt).toLocaleString()}
                                                        </div>
                                                        {isAdmin && c.user && (
                                                            <div className="flex items-center text-aura-light font-bold">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-aura-light mr-1.5"></div>
                                                                {c.user.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col space-y-1.5">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] bg-aura-light/10 text-aura-light px-2 py-0.5 rounded-md font-bold">{c.category}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${getPriorityColor(c.priority)}`}>
                                                            {c.priority}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 italic font-medium">Sentiment: {c.sentiment}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${c.status === 'resolved' ? 'bg-green-500' : 'bg-aura-orange animate-pulse'}`}></div>
                                                    <span className="text-xs font-semibold capitalize text-aura-dark dark:text-gray-300">{c.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end space-x-1">
                                                    {/* Expand AI Response */}
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                                                        className="p-2 text-gray-400 hover:text-aura-light hover:bg-aura-light/10 rounded-lg transition-all"
                                                        title="View AI Response"
                                                    >
                                                        {expandedId === c._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                    {isAdmin && (
                                                        <>
                                                            {c.status === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(c._id, 'resolved')}
                                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-all"
                                                                    title="Mark as Resolved"
                                                                >
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <div className="p-2 text-green-500">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(c._id)}
                                                                disabled={deletingId === c._id}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-40"
                                                                title="Delete Complaint"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expandable AI Response Row */}
                                        {expandedId === c._id && (
                                            <tr className="bg-aura-light/5 dark:bg-aura-light/5">
                                                <td colSpan="4" className="px-6 py-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="p-2 bg-aura-light/10 rounded-xl flex-shrink-0">
                                                            <Bot className="w-4 h-4 text-aura-light" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-aura-light mb-1">AI Suggested Response</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{c.response}"</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">
                                            No complaints found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <ComplaintForm onSuccess={loadComplaints} />

                    <div className="bg-aura-dark rounded-2xl p-6 text-white shadow-xl shadow-aura-dark/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Automated Optimization</h4>
                            <p className="text-xs text-white/70 leading-relaxed mb-4">
                                Our AI system has automatically categorized 100% of incoming complaints, reducing manual workload significantly.
                            </p>
                            <div className="flex items-center space-x-3 text-xs">
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-white/70">{complaints.filter(c=>c.status==='resolved').length} Resolved</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-2 h-2 bg-aura-orange rounded-full animate-pulse"></div>
                                    <span className="text-white/70">{complaints.filter(c=>c.status==='pending').length} Pending</span>
                                </div>
                            </div>
                        </div>
                        <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintList;
