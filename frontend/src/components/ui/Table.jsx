import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Inbox } from 'lucide-react';

export default function Table({ columns, data, onEdit, onDelete }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card overflow-hidden"
        >
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-5 py-3.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest"
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-5 py-3.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="px-5 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                                            <Inbox className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <p className="text-sm text-slate-600">No records yet</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence initial={false}>
                                {data.map((row, rowIdx) => (
                                    <motion.tr
                                        key={row.id ?? rowIdx}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: rowIdx * 0.04, duration: 0.3 }}
                                        className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="px-5 py-3.5 text-sm">
                                                {col.render ? col.render(row) : (
                                                    <span className="text-slate-400">{row[col.accessor]}</span>
                                                )}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onEdit && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.12 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => onEdit(row)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-400/[0.1] transition-colors"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </motion.button>
                                                    )}
                                                    {onDelete && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.12 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => onDelete(row.id)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-400/[0.1] transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.04]">
                {data.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                            <Inbox className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-600">No records yet</p>
                    </div>
                ) : (
                    data.map((row, rowIdx) => (
                        <motion.div
                            key={row.id ?? rowIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIdx * 0.04 }}
                            className="px-4 py-4 space-y-2"
                        >
                            {columns.map((col, colIdx) => (
                                <div key={colIdx} className="flex items-center justify-between gap-4">
                                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest shrink-0">
                                        {col.header}
                                    </span>
                                    <div className="text-sm text-right">
                                        {col.render ? col.render(row) : (
                                            <span className="text-slate-400">{row[col.accessor]}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(onEdit || onDelete) && (
                                <div className="flex justify-end gap-2 pt-1">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(row)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-400 bg-blue-400/[0.08] hover:bg-blue-400/[0.15] transition-colors"
                                        >
                                            <Pencil className="w-3 h-3" /> Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(row.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 bg-rose-400/[0.08] hover:bg-rose-400/[0.15] transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
