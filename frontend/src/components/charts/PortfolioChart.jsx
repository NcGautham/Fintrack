import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Inbox } from 'lucide-react';

const COLORS = ['#7c6fff', '#34d399', '#fbbf24', '#fb7185', '#22d3ee', '#a78bfa', '#60a5fa'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(10,16,32,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '10px 14px',
                backdropFilter: 'blur(20px)',
            }}>
                <p className="text-white font-semibold text-xs">{payload[0].name}</p>
                <p className="text-slate-400 text-xs mt-1">
                    ₹{payload[0].value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

export default function PortfolioChart({ stocks }) {
    const data = stocks.map(s => ({ name: s.ticker, value: s.currentValue || s.currentPrice * s.quantity }));

    if (data.length === 0) return (
        <div className="glass-card p-6 h-72 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                <Inbox className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-600">No portfolio data</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-5"
        >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Portfolio Distribution</p>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={90}
                            paddingAngle={3} dataKey="value" animationBegin={150} animationDuration={900}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]}
                                    stroke="transparent"
                                    style={{ filter: `drop-shadow(0 0 6px ${COLORS[i % COLORS.length]}55)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {data.map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[11px] text-slate-500">{e.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
