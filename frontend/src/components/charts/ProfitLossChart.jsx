import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3">
                <p className="text-white font-medium text-sm">{label}</p>
                <p className={`text-sm mt-1 ${payload[0].value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{payload[0].value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

export default function ProfitLossChart({ stocks }) {
    const data = stocks.map((stock) => ({
        name: stock.ticker,
        value: stock.profitLoss || (stock.currentPrice - stock.buyPrice) * stock.quantity,
    }));

    if (data.length === 0) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-slate-500">No P&L data available</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
        >
            <h3 className="text-lg font-semibold text-white mb-4">Profit & Loss</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#profitGradient)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
