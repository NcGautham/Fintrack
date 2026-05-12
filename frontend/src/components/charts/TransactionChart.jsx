import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Inbox } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(10,16,32,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '10px 14px',
                backdropFilter: 'blur(20px)',
            }}>
                <p className="text-slate-400 text-xs font-medium mb-2">{label}</p>
                {payload.map((e, i) => (
                    <p key={i} className="text-xs font-semibold" style={{ color: e.fill }}>
                        {e.name}: ₹{e.value?.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function TransactionChart({ transactions }) {
    const map = {};
    transactions.forEach(t => {
        if (!map[t.category]) map[t.category] = { category: t.category, income: 0, expense: 0 };
        if (t.type === 'INCOME') map[t.category].income += t.amount;
        else map[t.category].expense += t.amount;
    });
    const data = Object.values(map);

    if (data.length === 0) return (
        <div className="glass-card p-5 h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                <Inbox className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-600">No transaction data</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Income vs Expenses by Category</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-slate-500">Income</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-[10px] text-slate-500">Expense</span></div>
                </div>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={4} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={44}
                            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)', radius: 6 }} />
                        <Bar dataKey="income" name="Income" fill="#34d399" radius={[5, 5, 0, 0]} animationDuration={1100}>
                            {data.map((_, i) => <Cell key={i} fill="#34d399" fillOpacity={0.85} />)}
                        </Bar>
                        <Bar dataKey="expense" name="Expense" fill="#fb7185" radius={[5, 5, 0, 0]} animationDuration={1100}>
                            {data.map((_, i) => <Cell key={i} fill="#fb7185" fillOpacity={0.85} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
