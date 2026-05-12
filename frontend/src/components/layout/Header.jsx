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
        if (!q.trim()) { setResults(null); return; }
        setLoading(true);
        try {
            const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
            setResults(res.data);
        } catch { setResults(null); }
        finally { setLoading(false); }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setShowResults(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(val), 300);
    };

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const totalResults = results
        ? (results.stocks?.length || 0) + (results.sips?.length || 0) + (results.transactions?.length || 0)
        : 0;

    const goTo = (path) => { navigate(path); setQuery(''); setShowResults(false); setResults(null); };
    const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

    return (
        <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3"
        >
            {/* Title area + hamburger */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileMenu'))}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h1>
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                </div>

                {/* Mobile avatar */}
                <div className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)' }}>
                    <UserIcon className="w-3.5 h-3.5 text-white" />
                </div>
            </div>

            {/* Search + profile */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div ref={searchRef} className="relative flex-1 sm:flex-none">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-500 transition-all w-full sm:w-52"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <Search className="w-3.5 h-3.5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search…"
                            value={query}
                            onChange={handleChange}
                            onFocus={() => { if (query.trim()) setShowResults(true); }}
                            className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-slate-600"
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setShowResults(false); setResults(null); }}
                                className="text-slate-600 hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {showResults && query.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 mt-2 w-72 rounded-xl overflow-hidden max-h-80 overflow-y-auto z-50"
                                style={{
                                    background: 'rgba(10,16,32,0.97)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                {loading && <div className="px-4 py-3 text-xs text-slate-500">Searching…</div>}
                                {!loading && totalResults === 0 && (
                                    <div className="px-4 py-3 text-xs text-slate-500">No results for &ldquo;{query}&rdquo;</div>
                                )}

                                {results?.stocks?.length > 0 && (
                                    <SearchGroup label="Stocks" icon={TrendingUp} color="#34d399">
                                        {results.stocks.map((s) => (
                                            <SearchItem key={`s-${s.id}`} onClick={() => goTo('/stocks')}
                                                icon={TrendingUp} color="#34d399"
                                                primary={s.name} secondary={`${s.ticker} · ${fmt(s.currentPrice)}`} />
                                        ))}
                                    </SearchGroup>
                                )}
                                {results?.sips?.length > 0 && (
                                    <SearchGroup label="SIP Plans" icon={Repeat} color="#a78bfa">
                                        {results.sips.map((s) => (
                                            <SearchItem key={`sip-${s.id}`} onClick={() => goTo('/sips')}
                                                icon={Repeat} color="#a78bfa"
                                                primary={s.fundName} secondary={`${fmt(s.monthlyAmount)}/mo · ${s.status}`} />
                                        ))}
                                    </SearchGroup>
                                )}
                                {results?.transactions?.length > 0 && (
                                    <SearchGroup label="Transactions" icon={ArrowLeftRight} color="#60a5fa">
                                        {results.transactions.map((t) => (
                                            <SearchItem key={`t-${t.id}`} onClick={() => goTo('/transactions')}
                                                icon={ArrowLeftRight} color="#60a5fa"
                                                primary={t.description} secondary={`${t.category} · ${t.type === 'INCOME' ? '+' : '-'}${fmt(t.amount)}`} />
                                        ))}
                                    </SearchGroup>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop avatar */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-default"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)' }}>
                        <UserIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white leading-none">{user?.username || 'User'}</p>
                        <p className="text-[10px] text-slate-500 leading-none mt-0.5">Portfolio</p>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

function SearchGroup({ label, children }) {
    return (
        <div>
            <div className="px-4 py-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest border-b border-white/[0.04]">
                {label}
            </div>
            {children}
        </div>
    );
}

function SearchItem({ onClick, icon: Icon, color, primary, secondary }) {
    return (
        <button onClick={onClick}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-white/[0.04] transition-colors flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div className="min-w-0">
                <p className="text-white truncate font-medium">{primary}</p>
                <p className="text-slate-500 truncate mt-0.5">{secondary}</p>
            </div>
        </button>
    );
}
