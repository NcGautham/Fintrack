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
    X,
    User,
} from 'lucide-react';

const navItems = [
    { path: '/',             icon: LayoutDashboard, label: 'Dashboard',    color: '#7c6fff' },
    { path: '/stocks',       icon: TrendingUp,      label: 'Stocks',       color: '#34d399' },
    { path: '/sips',         icon: Repeat,          label: 'SIP Plans',    color: '#fbbf24' },
    { path: '/transactions', icon: ArrowLeftRight,  label: 'Transactions', color: '#60a5fa' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout, user } = useAuth();

    useEffect(() => {
        const toggle = () => setMobileOpen(prev => !prev);
        window.addEventListener('toggleMobileMenu', toggle);
        return () => window.removeEventListener('toggleMobileMenu', toggle);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const sidebarW = collapsed ? 72 : 240;

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                animate={{ width: sidebarW }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`
                    fixed left-0 top-0 h-screen z-50 flex flex-col
                    glass-sidebar overflow-hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    transition-transform duration-300 md:transition-none
                `}
                style={{ width: window.innerWidth < 768 ? 260 : sidebarW }}
            >
                {/* Sidebar top glow */}
                <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(124,111,255,0.4), transparent)' }} />

                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3 min-w-0">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #7c6fff, #a78bfa)',
                                boxShadow: '0 4px 16px rgba(124,111,255,0.4)',
                            }}
                        >
                            <Wallet className="w-4 h-4 text-white" />
                        </motion.div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="min-w-0"
                                >
                                    <p className="text-sm font-bold text-white tracking-tight leading-none">FinTrack</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Finance Tracker</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile close */}
                    <button
                        className="md:hidden ml-auto p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item, idx) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={() => setMobileOpen(false)}
                        >
                            {({ isActive }) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ x: 2 }}
                                    className={`
                                        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 cursor-pointer
                                        ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'}
                                    `}
                                >
                                    {/* Active bg */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 rounded-xl"
                                            style={{
                                                background: `linear-gradient(135deg, ${item.color}20, ${item.color}0a)`,
                                                border: `1px solid ${item.color}30`,
                                                boxShadow: `0 0 20px ${item.color}15`,
                                            }}
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}

                                    {/* Active left bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeBar"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                                            style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}

                                    {/* Hover bg */}
                                    {!isActive && (
                                        <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-200" />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                                        style={isActive ? {
                                            background: `${item.color}22`,
                                            boxShadow: `0 0 12px ${item.color}30`,
                                        } : {}}
                                    >
                                        <item.icon
                                            className="w-4 h-4 transition-colors duration-200"
                                            style={isActive ? { color: item.color } : {}}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
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

                {/* User + Logout */}
                <div className="px-2.5 pb-3 border-t border-white/[0.06] pt-3 space-y-1">
                    {/* User chip */}
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)' }}>
                                    <User className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">{user?.username || 'User'}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Portfolio'}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Logout */}
                    <motion.button
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all duration-200 group"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-rose-500/10 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Collapse toggle — desktop only */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] transition-all duration-200"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                            {collapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs font-medium"
                                >
                                    Collapse
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
