import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const maxW = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100]"
                    />

                    {/* Modal positioner */}
                    <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            key="modal-content"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.96 }}
                            transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                            className={`w-full ${maxW} max-h-[92dvh] overflow-y-auto relative rounded-t-[20px] border border-white/10 border-b-0 sm:rounded-[20px] sm:border-b`}
                            style={{
                                background: 'linear-gradient(135deg, rgba(15,22,41,0.97) 0%, rgba(10,16,32,0.98) 100%)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,111,255,0.08)',
                                backdropFilter: 'blur(40px)',
                            }}
                        >
                            {/* Top glow */}
                            <div className="absolute top-0 left-10 right-10 h-px"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,111,255,0.4), transparent)' }} />

                            {/* Mobile drag handle */}
                            <div className="sm:hidden flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-white/15" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                                <h2 className="text-base font-semibold text-white">{title}</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.07] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5 sm:pb-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
