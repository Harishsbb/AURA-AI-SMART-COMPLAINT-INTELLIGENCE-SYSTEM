import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-aura-bg dark:bg-slate-900 transition-colors duration-500">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-slate-950/50 p-6 transition-colors duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
