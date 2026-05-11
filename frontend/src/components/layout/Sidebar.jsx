import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    TrendingUp,
    Repeat,
    ArrowLeftRight,
    ChevronLeft,
    ChevronRight,
    Wallet,
    LogOut,
    X
} from 'lucide-react';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/stocks', icon: TrendingUp, label: 'Stocks' },
    { path: '/sips', icon: Repeat, label: 'SIP Plans' },
    { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        const toggleMenu = () => setMobileOpen(prev => !prev);
        window.addEventListener('toggleMobileMenu', toggleMenu);
        return () => window.removeEventListener('toggleMobileMenu', toggleMenu);
    }, []);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 md:bg-transparent bg-[#111a2e] ${collapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                style={{
                    background: 'linear-gradient(180deg, #0f172a 0%, #111a2e 50%, #162040 100%)',
                    borderRight: '1px solid rgba(91, 124, 250, 0.1)',
                }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' }}
                        >
                            <Wallet className="w-5 h-5 text-white" />
                        </motion.div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h1 className="text-lg font-bold text-white tracking-tight">FinTrack</h1>
                                    <p className="text-xs text-slate-400">Finance Tracker</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        className="md:hidden p-1 text-slate-400 hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="flex items-center gap-3 w-full relative"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl -mx-4 -my-3 px-4 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(91, 124, 250, 0.15), rgba(139, 92, 246, 0.1))',
                                                border: '1px solid rgba(91, 124, 250, 0.2)',
                                            }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 shrink-0 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                                        }`} />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="relative z-10"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 pb-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                <div className="px-3 py-4 border-t border-white/5 hidden md:block">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm">Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
