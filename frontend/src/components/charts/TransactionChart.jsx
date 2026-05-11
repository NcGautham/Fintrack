import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3">
                <p className="text-white font-medium text-sm mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function TransactionChart({ transactions }) {
    // Group by category
    const categoryMap = {};
    transactions.forEach((txn) => {
        if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { category: txn.category, income: 0, expense: 0 };
        }
        if (txn.type === 'INCOME') {
            categoryMap[txn.category].income += txn.amount;
        } else {
            categoryMap[txn.category].expense += txn.amount;
        }
    });

    const data = Object.values(categoryMap);

    if (data.length === 0) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-slate-500">No transaction data available</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
        >
            <h3 className="text-lg font-semibold text-white mb-4">Income vs Expenses</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={1200} />
                        <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} animationDuration={1200} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
