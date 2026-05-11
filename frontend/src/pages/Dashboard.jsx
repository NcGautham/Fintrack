import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PiggyBank,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Activity,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import ProfitLossChart from '../components/charts/ProfitLossChart';
import TransactionChart from '../components/charts/TransactionChart';
import { dashboardAPI, stockAPI, transactionAPI } from '../api/api';

const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, stocksRes, transactionsRes] = await Promise.all([
                    dashboardAPI.getSummary(),
                    stockAPI.getAll(),
                    transactionAPI.getAll(),
                ]);
                setSummary(summaryRes.data);
                setStocks(stocksRes.data);
                setTransactions(transactionsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                />
            </div>
        );
    }

    const profitLoss = summary?.totalProfitLoss || 0;
    const isProfit = profitLoss >= 0;

    return (
        <div>
            <Header
                title="Dashboard"
                subtitle="Your financial overview at a glance"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <Card
                    title="Total Net Worth"
                    value={formatCurrency(summary?.totalNetWorth)}
                    icon={Wallet}
                    gradient="gradient-blue"
                    delay={0}
                    trend={isProfit ? 'up' : 'down'}
                    trendValue={`${Math.abs(((profitLoss / (summary?.totalStockInvested || 1)) * 100)).toFixed(1)}%`}
                />
                <Card
                    title="Portfolio Value"
                    value={formatCurrency(summary?.totalPortfolioValue)}
                    subtitle={`${summary?.stockCount || 0} stocks held`}
                    icon={TrendingUp}
                    gradient="gradient-violet"
                    delay={0.1}
                />
                <Card
                    title="Profit / Loss"
                    value={formatCurrency(profitLoss)}
                    icon={isProfit ? ArrowUpRight : ArrowDownRight}
                    gradient={isProfit ? 'gradient-emerald' : 'gradient-rose'}
                    delay={0.2}
                    trend={isProfit ? 'up' : 'down'}
                    trendValue={`${Math.abs(((profitLoss / (summary?.totalStockInvested || 1)) * 100)).toFixed(1)}%`}
                />
                <Card
                    title="SIP Investment"
                    value={formatCurrency(summary?.totalSIPInvestment)}
                    subtitle={`${summary?.activeSIPCount || 0} active SIPs`}
                    icon={PiggyBank}
                    gradient="gradient-amber"
                    delay={0.3}
                />
            </div>

            {/* Second row of cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <Card
                    title="Total Income"
                    value={formatCurrency(summary?.totalIncome)}
                    icon={DollarSign}
                    gradient="gradient-emerald"
                    delay={0.4}
                />
                <Card
                    title="Total Expenses"
                    value={formatCurrency(summary?.totalExpense)}
                    icon={ArrowDownRight}
                    gradient="gradient-rose"
                    delay={0.5}
                />
                <Card
                    title="Net Balance"
                    value={formatCurrency(summary?.netBalance)}
                    subtitle={`${summary?.transactionCount || 0} transactions`}
                    icon={Activity}
                    gradient="gradient-cyan"
                    delay={0.6}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PortfolioChart stocks={stocks} />
                <ProfitLossChart stocks={stocks} />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <TransactionChart transactions={transactions} />
            </div>

            {/* Recent transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-card p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((txn, index) => (
                        <motion.div
                            key={txn.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.08, duration: 0.3 }}
                            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'INCOME' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                                    }`}>
                                    {txn.type === 'INCOME' ? (
                                        <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5 text-rose-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{txn.description}</p>
                                    <p className="text-xs text-slate-500">{txn.category} • {txn.date}</p>
                                </div>
                            </div>
                            <p className={`text-sm font-semibold ${txn.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
