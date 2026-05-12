import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Wallet, PiggyBank,
    ArrowUpRight, ArrowDownRight, DollarSign, Activity, Sparkles,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import ProfitLossChart from '../components/charts/ProfitLossChart';
import TransactionChart from '../components/charts/TransactionChart';
import { dashboardAPI, stockAPI, transactionAPI } from '../api/api';

const fmt = (v) => v == null ? '₹0' : '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Skeleton({ className = '' }) {
    return <div className={`skeleton ${className}`} />;
}

function LoadingState() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([dashboardAPI.getSummary(), stockAPI.getAll(), transactionAPI.getAll()])
            .then(([s, st, tx]) => {
                setSummary(s.data);
                setStocks(st.data);
                setTransactions(tx.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div>
            <Header title="Dashboard" subtitle="Your financial overview" />
            <LoadingState />
        </div>
    );

    const pl = summary?.totalProfitLoss || 0;
    const isProfit = pl >= 0;
    const plPct = Math.abs(((pl / (summary?.totalStockInvested || 1)) * 100)).toFixed(1);

    return (
        <div className="space-y-6">
            <Header title="Dashboard" subtitle="Your financial overview at a glance" />

            {/* Top stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="Net Worth"       value={fmt(summary?.totalNetWorth)}    icon={Wallet}      gradient="gradient-violet" delay={0}   trend={isProfit ? 'up' : 'down'} trendValue={`${plPct}%`} />
                <Card title="Portfolio"       value={fmt(summary?.totalPortfolioValue)} subtitle={`${summary?.stockCount || 0} stocks`} icon={TrendingUp} gradient="gradient-blue" delay={0.07} />
                <Card title="P / L"           value={fmt(pl)}                        icon={isProfit ? ArrowUpRight : ArrowDownRight} gradient={isProfit ? 'gradient-emerald' : 'gradient-rose'} delay={0.14} trend={isProfit ? 'up' : 'down'} trendValue={`${plPct}%`} />
                <Card title="SIP Investment"  value={fmt(summary?.totalSIPInvestment)} subtitle={`${summary?.activeSIPCount || 0} active`} icon={PiggyBank} gradient="gradient-amber" delay={0.21} />
            </div>

            {/* Cashflow stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card title="Total Income"   value={fmt(summary?.totalIncome)}  icon={DollarSign}    gradient="gradient-emerald" delay={0.28} />
                <Card title="Total Expenses" value={fmt(summary?.totalExpense)} icon={ArrowDownRight} gradient="gradient-rose"    delay={0.35} />
                <Card title="Net Balance"    value={fmt(summary?.netBalance)}   subtitle={`${summary?.transactionCount || 0} transactions`} icon={Activity} gradient="gradient-cyan" delay={0.42} className="col-span-2 md:col-span-1" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <PortfolioChart stocks={stocks} />
                <ProfitLossChart stocks={stocks} />
            </div>

            <TransactionChart transactions={transactions} />

            {/* Recent transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.45 }}
                className="glass-card p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">Last 5</span>
                </div>

                {transactions.length === 0 ? (
                    <p className="text-sm text-slate-600 text-center py-8">No transactions yet</p>
                ) : (
                    <div className="space-y-1">
                        {transactions.slice(0, 5).map((txn, i) => (
                            <motion.div
                                key={txn.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.55 + i * 0.07, duration: 0.3 }}
                                className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        txn.type === 'INCOME' ? 'bg-emerald-500/[0.12]' : 'bg-rose-500/[0.12]'
                                    }`}>
                                        {txn.type === 'INCOME'
                                            ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                            : <ArrowDownRight className="w-4 h-4 text-rose-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white leading-tight">{txn.description}</p>
                                        <p className="text-[11px] text-slate-600 mt-0.5">{txn.category} · {txn.date}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-bold ${txn.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {txn.type === 'INCOME' ? '+' : '-'}{fmt(txn.amount)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
