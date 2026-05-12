import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const GLOW_MAP = {
    'gradient-violet':  'rgba(124,111,255,0.18)',
    'gradient-blue':    'rgba(96,165,250,0.18)',
    'gradient-emerald': 'rgba(52,211,153,0.18)',
    'gradient-rose':    'rgba(251,113,133,0.18)',
    'gradient-amber':   'rgba(251,191,36,0.18)',
    'gradient-cyan':    'rgba(34,211,238,0.18)',
};

export default function Card({ title, value, subtitle, icon: Icon, gradient = 'gradient-violet', delay = 0, trend, trendValue }) {
    const glowColor = GLOW_MAP[gradient] || GLOW_MAP['gradient-violet'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card p-5 relative overflow-hidden group cursor-default"
            style={{ '--glow': glowColor }}
        >
            {/* Background glow orb */}
            <div
                className={`absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 ${gradient}`}
                style={{ mixBlendMode: 'screen' }}
            />
            {/* Top shimmer line */}
            <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${glowColor.replace('0.18', '0.5')}, transparent)` }} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}
                        style={{ boxShadow: `0 4px 16px ${glowColor}` }}
                    >
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                    </div>

                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: delay + 0.2 }}
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                trend === 'up'
                                    ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                                    : 'text-rose-400 bg-rose-400/10 border border-rose-400/20'
                            }`}
                        >
                            {trend === 'up'
                                ? <TrendingUp className="w-3 h-3" />
                                : <TrendingDown className="w-3 h-3" />
                            }
                            <span>{trendValue}</span>
                        </motion.div>
                    )}
                </div>

                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1.5">{title}</p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.15 }}
                    className="text-2xl font-bold text-white tracking-tight"
                >
                    {value}
                </motion.p>
                {subtitle && (
                    <p className="text-xs text-slate-600 mt-1.5">{subtitle}</p>
                )}
            </div>
        </motion.div>
    );
}
