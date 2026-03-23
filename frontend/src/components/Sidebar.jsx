import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, PieChart, Bell, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.isAdmin;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
        ...(isAdmin ? [
            { icon: PieChart, label: 'Analytics', path: '/analytics' },
            { icon: Bell, label: 'Alerts', path: '/alerts' },
        ] : []),
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-aura-dark dark:bg-slate-950 text-white flex flex-col shadow-2xl z-20 transition-colors duration-500">
            <div className="p-6 flex items-center space-x-3">
                <div className="p-2 bg-aura-light rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-bold text-xl tracking-tight">AURA AI</h1>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                            ${isActive 
                                ? 'bg-aura-light shadow-lg shadow-aura-light/20 text-white font-medium scale-[1.02]' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Support</p>
                    <button className="w-full text-left text-sm hover:text-aura-light transition-colors">
                        Documentation
                    </button>
                    <button className="w-full text-left text-sm hover:text-aura-light transition-colors mt-2">
                        Help Center
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
