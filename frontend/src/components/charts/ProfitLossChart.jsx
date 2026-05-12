import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Inbox } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        const v = payload[0].value;
        return (
            <div style={{
                background: 'rgba(10,16,32,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '10px 14px',
                backdropFilter: 'blur(20px)',
            }}>
                <p className="text-slate-400 text-xs font-medium">{label}</p>
                <p className={`text-sm font-bold mt-1 ${v >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {v >= 0 ? '+' : ''}₹{v?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

export default function ProfitLossChart({ stocks }) {
    const data = stocks.map(s => ({
        name: s.ticker,
        value: s.profitLoss || (s.currentPrice - s.buyPrice) * s.quantity,
    }));

    const hasProfit = data.some(d => d.value >= 0);

    if (data.length === 0) return (
        <div className="glass-card p-5 h-72 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                <Inbox className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-600">No P&L data</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-5"
        >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Profit &amp; Loss per Stock</p>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="plUp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#34d399" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="plDown" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#fb7185" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} width={50}
                            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="value"
                            stroke={hasProfit ? '#34d399' : '#fb7185'}
                            strokeWidth={2}
                            fill={hasProfit ? 'url(#plUp)' : 'url(#plDown)'}
                            dot={{ fill: hasProfit ? '#34d399' : '#fb7185', strokeWidth: 0, r: 3 }}
                            animationDuration={1200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
