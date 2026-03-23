import { Search, User, LogOut, Bell, Menu } from 'lucide-react';

const Navbar = () => {
    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;

    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-8 flex items-center justify-between z-10 transition-colors duration-500">
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-aura-light transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search complaints, customers..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-aura-light/10 dark:focus:ring-aura-light/5 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-sm dark:text-gray-300"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-400 hover:text-aura-dark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-aura-orange rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
                
                <div className="h-8 w-[1px] bg-gray-200 dark:bg-slate-800"></div>

                <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-aura-dark dark:text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.isAdmin ? 'Chief Compliance Officer' : 'Valued Customer'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-aura-light/10 border border-aura-light/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-aura-light" />
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('aura_token');
                            localStorage.removeItem('aura_user');
                            window.location.href = '/login';
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
