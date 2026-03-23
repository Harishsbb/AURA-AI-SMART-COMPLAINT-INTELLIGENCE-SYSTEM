import React from 'react';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';

const Dashboard = () => {
    const userString = localStorage.getItem('aura_user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-gray-400 font-bold uppercase tracking-widest">
                    Initializing Terminal...
                </div>
            </div>
        );
    }

    return user.isAdmin ? <AdminDashboard /> : <CustomerDashboard />;
};

export default Dashboard;

