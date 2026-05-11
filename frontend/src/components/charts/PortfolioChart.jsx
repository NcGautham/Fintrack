import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#5c7cfa', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3">
                <p className="text-white font-medium text-sm">{payload[0].name}</p>
                <p className="text-slate-400 text-xs mt-1">
                    ₹{payload[0].value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

export default function PortfolioChart({ stocks }) {
    const data = stocks.map((stock) => ({
        name: stock.ticker,
        value: stock.currentValue || stock.currentPrice * stock.quantity,
    }));

    if (data.length === 0) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-slate-500">No stock data available</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
        >
            <h3 className="text-lg font-semibold text-white mb-4">Portfolio Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                            animationBegin={200}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-400">{entry.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
