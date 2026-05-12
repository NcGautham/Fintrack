import { motion } from 'framer-motion';

const STYLES = {
    primary: {
        className: 'text-white',
        style: {
            background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)',
            boxShadow: '0 4px 20px rgba(124,111,255,0.3)',
        },
    },
    secondary: {
        className: 'text-slate-300 hover:text-white',
        style: {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
        },
    },
    danger: {
        className: 'text-white',
        style: {
            background: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',
            boxShadow: '0 4px 20px rgba(225,29,72,0.3)',
        },
    },
    ghost: {
        className: 'text-slate-400 hover:text-white hover:bg-white/[0.06]',
        style: {},
    },
    emerald: {
        className: 'text-white',
        style: {
            background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
            boxShadow: '0 4px 20px rgba(52,211,153,0.25)',
        },
    },
};

export default function Button({ children, onClick, variant = 'primary', className = '', icon: Icon, size = 'md', ...props }) {
    const s = STYLES[variant] || STYLES.primary;
    const sizeClass = size === 'sm' ? 'px-3 py-2 text-xs' : size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm';

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ${sizeClass} ${s.className} ${className}`}
            style={s.style}
            {...props}
        >
            {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
            {children}
        </motion.button>
    );
}
