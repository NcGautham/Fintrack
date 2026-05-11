import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { authAPI } from '../api/api';
import toast from 'react-hot-toast';

export default function Register() {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        try {
            await authAPI.register(userData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-primary)] p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20"
                        style={{ background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' }}
                    >
                        <Wallet className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">FinTrack</h1>
                    <p className="text-slate-400 mt-1 font-medium">Your Personal Finance Manager</p>
                </div>

                <div className="bg-[#111a2e]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                                    placeholder="Choose a username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                                    placeholder="Create a password (min 6 chars)"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8b5cf6] to-[#5c7cfa] hover:from-[#7c4dff] hover:to-[#4b6bfb] text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25 mt-8 transform hover:-translate-y-0.5"
                            >
                                Sign Up
                            </button>
                        </form>
                        <p className="mt-8 text-center text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
