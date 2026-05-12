import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';
import { authAPI } from '../api/api';
import toast from 'react-hot-toast';

export default function Register() {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await authAPI.register(userData);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Registration failed.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username', minLength: 3 },
        { key: 'email',    label: 'Email',    type: 'email', placeholder: 'your@email.com' },
    ];

    return (
        <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#04070f] p-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
            <div className="ambient-bg" />
            <div className="fixed top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(124,111,255,0.10) 0%, transparent 70%)' }} />
            <div className="fixed bottom-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />

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
                    <p className="text-sm text-slate-500 mt-1">Start your financial journey</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass-card p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-8 right-8 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent)' }} />

                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="w-4 h-4 text-violet-400" />
                        <h2 className="text-lg font-semibold text-white">Create account</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(({ key, label, type, placeholder, minLength }) => (
                            <div key={key} className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
                                <input
                                    type={type}
                                    value={userData[key]}
                                    onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                                    required
                                    minLength={minLength}
                                    className="glass-input w-full px-4 py-3.5 text-sm text-white placeholder-slate-600 transition-all"
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="glass-input w-full px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-600 transition-all"
                                    placeholder="Minimum 6 characters"
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

                        {/* Password strength bar */}
                        {userData.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-1"
                            >
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: userData.password.length < 6 ? '25%'
                                                : userData.password.length < 10 ? '60%' : '100%',
                                        }}
                                        style={{
                                            background: userData.password.length < 6
                                                ? '#fb7185'
                                                : userData.password.length < 10
                                                ? '#fbbf24'
                                                : '#34d399',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    {userData.password.length < 6 ? 'Too short' : userData.password.length < 10 ? 'Medium strength' : 'Strong'}
                                </p>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60"
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
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
