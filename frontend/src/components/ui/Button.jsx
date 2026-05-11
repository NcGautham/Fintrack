import { motion } from 'framer-motion';

export default function Button({ children, onClick, variant = 'primary', className = '', icon: Icon, ...props }) {
    const variants = {
        primary: 'text-white',
        secondary: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white',
        danger: 'text-white',
        ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
    };

    const gradients = {
        primary: { background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' },
        danger: { background: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`}
            style={gradients[variant] || {}}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </motion.button>
    );
}
