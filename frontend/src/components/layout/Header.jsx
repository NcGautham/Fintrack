import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, X, TrendingUp, Repeat, ArrowLeftRight, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function Header({ title, subtitle }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    const doSearch = useCallback(async (q) => {
        if (!q.trim()) {
            setResults(null);
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
            setResults(res.data);
        } catch {
            setResults(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setShowResults(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(val), 300);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalResults =
        results
            ? (results.stocks?.length || 0) +
            (results.sips?.length || 0) +
            (results.transactions?.length || 0)
            : 0;

    const handleNavigate = (path) => {
        navigate(path);
        setQuery('');
        setShowResults(false);
        setResults(null);
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4"
        >
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileMenu'))}
                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
                        >
                            {title}
                        </motion.h1>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="text-sm md:text-base text-slate-400 mt-0.5 md:mt-1"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                </div>

                {/* Mobile Profile Display */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="md:hidden flex items-center gap-3 p-1 rounded-xl cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' }}>
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div ref={searchRef} className="relative w-full md:w-auto">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-2 px-4 py-2.5 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 focus-within:border-blue-500/40 w-full transition-all"
                    >
                        <Search className="w-4 h-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search stocks, SIPs, transactions..."
                            value={query}
                            onChange={handleChange}
                            onFocus={() => { if (query.trim()) setShowResults(true); }}
                            className="bg-transparent border-none outline-none text-sm w-full md:w-56 text-white placeholder-slate-500"
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setShowResults(false); setResults(null); }} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </motion.div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {showResults && query.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-full md:w-80 rounded-xl bg-[#162040] border border-white/10 shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto"
                            >
                                {loading && (
                                    <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
                                )}

                                {!loading && totalResults === 0 && (
                                    <div className="px-4 py-3 text-sm text-slate-500">No results found for &quot;{query}&quot;</div>
                                )}

                                {/* Stocks */}
                                {results?.stocks?.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/3">
                                            Stocks
                                        </div>
                                        {results.stocks.map((s) => (
                                            <button
                                                key={`stock-${s.id}`}
                                                onClick={() => handleNavigate('/stocks')}
                                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/8 transition-all flex items-center gap-3"
                                            >
                                                <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{s.name}</p>
                                                    <p className="text-xs text-slate-500">{s.ticker} · {formatCurrency(s.currentPrice)}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* SIPs */}
                                {results?.sips?.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/3">
                                            SIP Plans
                                        </div>
                                        {results.sips.map((s) => (
                                            <button
                                                key={`sip-${s.id}`}
                                                onClick={() => handleNavigate('/sips')}
                                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/8 transition-all flex items-center gap-3"
                                            >
                                                <Repeat className="w-4 h-4 text-violet-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{s.fundName}</p>
                                                    <p className="text-xs text-slate-500">{formatCurrency(s.monthlyAmount)}/mo · {s.status}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Transactions */}
                                {results?.transactions?.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/3">
                                            Transactions
                                        </div>
                                        {results.transactions.map((t) => (
                                            <button
                                                key={`txn-${t.id}`}
                                                onClick={() => handleNavigate('/transactions')}
                                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/8 transition-all flex items-center gap-3"
                                            >
                                                <ArrowLeftRight className="w-4 h-4 text-emerald-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{t.description}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {t.category} · {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Profile */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' }}>
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                        <p className="text-xs text-slate-400">Portfolio</p>
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
}
