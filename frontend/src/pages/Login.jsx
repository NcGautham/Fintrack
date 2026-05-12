import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login(form);
            login(res.data.token, { username: res.data.username, email: res.data.email });
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#04070f] p-4">
            {/* Ambient background */}
            <div className="ambient-bg" />

            {/* Extra orbs */}
            <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(124,111,255,0.12) 0%, transparent 70%)' }} />
            <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />

            <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-col items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gradient">FinTrack</h1>
                    <p className="text-sm text-slate-500 mt-1 tracking-wide">Your financial command centre</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass-card p-8 relative overflow-hidden"
                >
                    {/* Top glow line */}
                    <div className="absolute top-0 left-8 right-8 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent)' }} />

                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <h2 className="text-lg font-semibold text-white">Welcome back</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Username</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                className="glass-input w-full px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:glass-input-focus transition-all"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="glass-input w-full px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-600 focus:glass-input-focus transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)',
                                boxShadow: '0 4px 24px rgba(124,111,255,0.35)',
                            }}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        No account yet?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
