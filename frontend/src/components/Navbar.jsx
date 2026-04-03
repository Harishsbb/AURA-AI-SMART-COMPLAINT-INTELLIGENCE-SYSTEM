import { Search, Bell, Sun, Moon, AlertOctagon, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchComplaints } from '../services/api';

const Navbar = () => {
    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;
    const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    const [showNotifications, setShowNotifications] = useState(false);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const dropdownRef = useRef(null);

    const toggleDark = () => {
        const next = !darkMode;
        setDarkMode(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('aura_dark_mode', next);
    };

    useEffect(() => {
        const token = localStorage.getItem('aura_token');
        if (token) {
            fetchComplaints(token)
                .then(data => setRecentComplaints(data.slice(0, 5)))
                .catch(console.error);
        }

        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className="h-[68px] glass-light dark:bg-slate-900/80 dark:border-slate-800/80 border-b border-white/80 px-6 flex items-center justify-between z-40 sticky top-0 backdrop-blur-xl transition-colors duration-300">

            {/* ── Search ───────────────────────────────── */}
            <div className="flex items-center flex-1 max-w-sm">
                <div className="relative w-full group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-aura-light transition-colors" />
                    <input
                        type="text"
                        placeholder="Search complaints, customers..."
                        className="w-full pl-10 pr-4 py-2.5 bg-aura-bg dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-aura-light/25 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* ── Right controls ───────────────────────── */}
            <div className="flex items-center space-x-2">

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDark}
                    className="p-2.5 text-gray-400 hover:text-aura-dark dark:hover:text-white hover:bg-aura-bg dark:hover:bg-slate-800 rounded-xl transition-all"
                    title="Toggle dark mode"
                >
                    {darkMode
                        ? <Sun  style={{ width: '18px', height: '18px' }} />
                        : <Moon style={{ width: '18px', height: '18px' }} />
                    }
                </button>

                {/* Notifications Dropdown Container */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2.5 transition-all rounded-xl ${showNotifications ? 'bg-aura-light/10 text-aura-light' : 'text-gray-400 hover:text-aura-dark dark:hover:text-white hover:bg-aura-bg dark:hover:bg-slate-800'}`}
                    >
                        <Bell style={{ width: '18px', height: '18px' }} />
                        {recentComplaints.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-aura-orange rounded-full border-2 border-white dark:border-slate-900" />
                        )}
                    </button>

                    {/* Notification "Dialogue Box" Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-aura-dark dark:text-white">Recent Complaints</h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-aura-light/10 text-aura-light rounded-full uppercase tracking-wider">
                                    Live Updates
                                </span>
                            </div>
                            
                            <div className="max-h-96 overflow-y-auto">
                                {recentComplaints.length > 0 ? (
                                    recentComplaints.map((c, i) => (
                                        <Link 
                                            key={c._id || i}
                                            to="/complaints" 
                                            onClick={() => setShowNotifications(false)}
                                            className="block p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10">
                                                    <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-aura-dark dark:text-gray-200 truncate">{c.text}</p>
                                                    <div className="flex items-center mt-1 space-x-2">
                                                        <span className="text-[10px] font-medium text-gray-400 capitalize">{c.category}</span>
                                                        <span className="text-[10px] text-gray-300">•</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center">
                                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400 font-medium">No new complaints</p>
                                    </div>
                                )}
                            </div>

                            <Link 
                                to="/complaints" 
                                onClick={() => setShowNotifications(false)}
                                className="block w-full py-3 bg-gray-50 dark:bg-slate-800 text-center text-xs font-black text-aura-light hover:bg-aura-light hover:text-white transition-all uppercase tracking-widest flex items-center justify-center space-x-2"
                            >
                                <span>View All Complaints</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-7 bg-gray-200 dark:bg-slate-700 mx-1" />

                {/* User info + avatar */}
                <div className="flex items-center space-x-2.5 pl-1">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-aura-dark dark:text-white leading-tight">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {user?.isAdmin ? 'Chief Compliance Officer' : 'Valued Customer'}
                        </p>
                    </div>
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs cursor-default select-none"
                        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
                    >
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
