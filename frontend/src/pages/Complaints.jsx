import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreHorizontal, MessageSquare, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import { fetchComplaints, updateComplaintStatus } from '../services/api';
import ComplaintForm from '../components/ComplaintForm';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            // Token would come from auth context in real app
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

    const getPriorityColor = (p) => {
        switch (p.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100';
            case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const filtered = complaints.filter(c => {
        const matchesSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const exportToPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-aura-dark">Complaints Management</h1>
                    <p className="text-gray-400 text-sm">Review and resolve AI-processed customer issues</p>
                </div>
                <button 
                    onClick={exportToPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all text-gray-600"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Report (PDF)</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Filter by message or category..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border-none rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-aura-light/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-xl">
                            {['All', 'High', 'Medium', 'Low'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setFilterPriority(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPriority === p ? 'bg-white shadow-sm text-aura-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                                    <th className="px-6 py-4">Complaint Details</th>
                                    <th className="px-6 py-4">AI Analysis</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length > 0 ? filtered.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="max-w-xs md:max-w-sm">
                                                <p className="text-sm text-aura-dark font-medium line-clamp-2 mb-1">{c.text}</p>
                                                <div className="flex items-center text-[10px] text-gray-400">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(c.createdAt).toLocaleString()}
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
                                                <p className="text-[10px] text-gray-400 italic font-medium truncate">Sent: {c.sentiment}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${c.status === 'resolved' ? 'bg-green-500' : 'bg-aura-orange animate-pulse'}`}></div>
                                                <span className="text-xs font-semibold capitalize text-aura-dark">{c.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {c.status === 'pending' ? (
                                                <button 
                                                    onClick={() => handleStatusUpdate(c._id, 'resolved')}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Mark as Resolved"
                                                >
                                                    <ShieldCheck className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <div className="p-2 text-green-600">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">
                                            {loading ? 'Fetching data...' : 'No complaints found matching your criteria.'}
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
                                Our AI system has automatically categorized 100% of your incoming complaints this week, reducing manual workload by 4.5 hours.
                            </p>
                            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                                View Efficiency Report
                            </button>
                        </div>
                        <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintList;
