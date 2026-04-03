import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, PieChart, Bell, Settings, Shield, LogOut, Bot, BookOpen } from 'lucide-react';

const Sidebar = () => {
    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.isAdmin;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard',  path: '/'          },
        { icon: MessageSquare,   label: 'Complaints',  path: '/complaints'},
        ...(isAdmin ? [
            { icon: PieChart,  label: 'Analytics',   path: '/analytics' },
            { icon: Bell,      label: 'Alerts',      path: '/alerts'    },
        ] : []),
        { icon: Bot,      label: 'AI Assistant', path: '/ai'       },
        { icon: BookOpen, label: 'Guide & Notes', path: '/notes'   },
        { icon: Settings, label: 'Settings',      path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('aura_token');
        localStorage.removeItem('aura_user');
        window.location.href = '/login';
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <aside
            className="w-64 flex flex-col z-20 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0f0d2e 0%, #1e1b4b 55%, #16144a 100%)' }}
        >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.08)' }} />
            <div className="absolute bottom-28 left-0 w-44 h-44 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,158,11,0.06)' }} />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(236,72,153,0.04)' }} />
            <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

            {/* ── Logo ─────────────────────────────────── */}
            <Link 
                to="/" 
                className="relative z-10 p-6 flex items-center space-x-3 border-b border-white/8 transition-all hover:bg-white/5 group"
            >
                <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden shadow-lg shadow-indigo-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300"
                >
                    <img src="/logo.png" alt="Aura Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="font-black text-white text-lg tracking-tight group-hover:text-aura-glow transition-colors">AURA AI</h1>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.18em]">Intelligence Platform</p>
                </div>
            </Link>

            {/* ── Nav items ────────────────────────────── */}
            <nav className="relative z-10 flex-1 px-3 py-5 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                            ${isActive
                                ? 'text-white font-semibold nav-active-glow'
                                : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                            }`
                        }
                        style={({ isActive }) => isActive
                            ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.28) 0%, rgba(129,140,248,0.15) 100%)' }
                            : {}
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-aura-glow" />
                                )}
                                <item.icon
                                    className={`flex-shrink-0 transition-all ${isActive ? 'text-aura-glow' : 'text-white/40 group-hover:text-white/70'}`}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span className="text-sm">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-aura-glow" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── User Profile ─────────────────────────── */}
            <div className="relative z-10 p-4 border-t border-white/8">
                <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}
                    >
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{user?.name || 'User'}</p>
                        <p className="text-white/35 text-[10px] truncate">{isAdmin ? 'Administrator' : 'Customer'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
