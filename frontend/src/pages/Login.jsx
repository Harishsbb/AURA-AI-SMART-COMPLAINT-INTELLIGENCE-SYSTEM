import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { login } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('admin@aura.ai');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login(email, password);
            localStorage.setItem('aura_token', data.token);
            localStorage.setItem('aura_user', JSON.stringify(data));
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try admin@aura.ai / admin123');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-aura-bg flex items-center justify-center p-6 bg-gradient-to-br from-aura-dark/5 to-transparent">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-aura-dark/10 p-12 border border-gray-100 relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-aura-light/5 rounded-full blur-3xl"></div>
                    
                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex p-4 bg-aura-dark rounded-3xl shadow-xl shadow-aura-dark/20 mb-6 group hover:scale-110 transition-transform duration-500">
                            <Shield className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-black text-aura-dark tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-gray-400 font-medium">AURA AI Management Console</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email System</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-aura-light transition-colors" />
                                <input 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-aura-light/5 focus:border-aura-light/20 transition-all font-medium text-sm"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Secure Access</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-aura-light transition-colors" />
                                <input 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-aura-light/5 focus:border-aura-light/20 transition-all font-medium text-sm"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-sm text-red-600 animate-in shake duration-500">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-aura-dark text-white rounded-2xl font-bold shadow-xl shadow-aura-dark/20 hover:bg-aura-light hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Initialize Terminal</span>}
                        </button>

                        <div className="flex justify-between items-center text-xs text-gray-400 px-1 pt-2">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="w-4 h-4 border-2 border-gray-200 rounded group-hover:border-aura-light transition-colors"></div>
                                <span>Remember security session</span>
                            </label>
                            <button type="button" className="hover:text-aura-light transition-colors">Reset Access</button>
                        </div>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-gray-400 text-xs font-medium uppercase tracking-widest pb-10">
                    Trusted by Global Banking Institutions &bull; v2.0.4
                </p>
            </div>
        </div>
    );
};

export default Login;
