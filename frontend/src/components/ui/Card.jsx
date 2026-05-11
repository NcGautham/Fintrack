import { motion } from 'framer-motion';

export default function Card({ title, value, subtitle, icon: Icon, gradient, delay = 0, trend, trendValue }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card p-6 relative overflow-hidden group cursor-pointer"
        >
            {/* Background gradient orb */}
            <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 ${gradient}`}
            />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                            }`}>
                            <span>{trend === 'up' ? '↑' : '↓'}</span>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                {subtitle && (
                    <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
                )}
            </div>
        </motion.div>
    );
}
