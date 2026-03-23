import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Login from './pages/Login';

function Analytics() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold dark:text-white">In-depth Analytics</h1>
      <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <p className="text-gray-400">Advanced analytical data will be displayed here.</p>
      </div>
    </div>
  );
}

function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="p-10 max-w-4xl animate-in fade-in slide-in-from-left-4 duration-500 text-left">
      <h1 className="text-3xl font-black text-aura-dark dark:text-white mb-2 text-left">Platform Settings</h1>
      <p className="text-gray-400 font-medium mb-10 text-left">Customize your AURA AI experience</p>

      <div className="grid gap-6 text-left">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group hover:shadow-xl hover:shadow-aura-dark/5 transition-all">
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-2xl transition-colors ${darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-aura-dark/10 text-aura-dark'}`}>
              <div className={`w-8 h-8 rounded-full border-4 border-current border-t-transparent ${darkMode ? 'animate-spin' : ''}`}></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-aura-dark dark:text-white">Dark Mode Appearance</h3>
              <p className="text-sm text-gray-400 font-medium">Reduce eye strain in low-light environments</p>
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${darkMode ? 'bg-aura-light' : 'bg-gray-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500 transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 opacity-50 cursor-not-allowed">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-6">
               <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl text-gray-400">
                 <div className="w-8 h-8 flex items-center justify-center font-bold">@</div>
               </div>
               <div>
                 <h3 className="font-bold text-lg text-aura-dark dark:text-white">Email Notifications</h3>
                 <p className="text-sm text-gray-400 font-medium">Manage how you receive alerts (Admin Only)</p>
               </div>
             </div>
             <div className="w-14 h-8 bg-gray-100 dark:bg-slate-700 rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-aura-dark dark:text-white mb-4">Security Alerts</h1>
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl flex items-center shadow-sm">
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
          <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">System Maintenance scheduled for 02:00 AM UTC.</p>
        </div>
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-200/20 p-4 rounded-xl flex items-center shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          <p className="text-green-800 dark:text-green-200 text-sm font-medium">All AI categorization systems are currently optimized.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const isAuthenticated = !!localStorage.getItem('aura_token');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('aura_dark_mode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aura_dark_mode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
