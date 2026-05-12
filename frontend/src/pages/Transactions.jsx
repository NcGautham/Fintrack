import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { transactionAPI } from '../api/api';

const fmt = (v) => v == null ? '₹0' : '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EMPTY = { description: '', amount: '', type: 'EXPENSE', category: '', date: '' };

const CATEGORIES = {
    INCOME:  ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
    EXPENSE: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'],
};

const inputCls = "glass-input w-full px-4 py-3 text-sm text-white placeholder-slate-600 transition-all focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [filter, setFilter] = useState('ALL');

    const fetch = async () => {
        try { const r = await transactionAPI.getAll(); setTransactions(r.data); }
        catch { toast.error('Failed to load transactions'); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
    const openEdit = (t) => {
        setEditing(t);
        setForm({ description: t.description, amount: String(t.amount), type: t.type, category: t.category, date: t.date });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, amount: parseFloat(form.amount) };
        try {
            if (editing) { await transactionAPI.update(editing.id, payload); toast.success('Transaction updated'); }
            else { await transactionAPI.create(payload); toast.success('Transaction added'); }
            setModalOpen(false); fetch();
        } catch { toast.error('Operation failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try { await transactionAPI.delete(id); toast.success('Deleted'); fetch(); }
        catch { toast.error('Failed to delete'); }
    };

    const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);
    const income = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

    const tabs = [
        { key: 'ALL',     label: 'All',      count: transactions.length },
        { key: 'INCOME',  label: 'Income',   count: transactions.filter(t => t.type === 'INCOME').length },
        { key: 'EXPENSE', label: 'Expenses', count: transactions.filter(t => t.type === 'EXPENSE').length },
    ];

    const columns = [
        {
            header: 'Transaction', accessor: 'description',
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.type === 'INCOME' ? 'bg-emerald-500/12' : 'bg-rose-500/12'}`}>
                        {r.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{r.description}</p>
                        <p className="text-[11px] text-slate-600">{r.category}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Amount', accessor: 'amount',
            render: (r) => (
                <span className={`text-sm font-bold ${r.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {r.type === 'INCOME' ? '+' : '-'}{fmt(r.amount)}
                </span>
            ),
        },
        {
            header: 'Type', accessor: 'type',
            render: (r) => (
                <span className={r.type === 'INCOME' ? 'badge-emerald' : 'badge-rose'}>
                    {r.type}
                </span>
            ),
        },
        { header: 'Category', accessor: 'category', render: (r) => <span className="text-sm text-slate-500">{r.category}</span> },
        { header: 'Date',     accessor: 'date',     render: (r) => <span className="text-sm text-slate-500">{r.date}</span> },
    ];

    if (loading) return (
        <div>
            <Header title="Transactions" subtitle="Track your income and expenses" />
            <div className="flex items-center justify-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full" />
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <Header title="Transactions" subtitle="Track your income and expenses" />

            {/* Summary mini-cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Income',  value: fmt(income),          color: '#34d399', icon: TrendingUp },
                    { label: 'Expenses', value: fmt(expense),         color: '#fb7185', icon: TrendingDown },
                    { label: 'Balance', value: fmt(income - expense), color: income - expense >= 0 ? '#34d399' : '#fb7185', icon: DollarSign },
                ].map(({ label, value, color, icon: Icon }) => (
                    <motion.div key={label}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4 flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <p className="text-base sm:text-lg font-bold text-white truncate" style={{ color }}>{value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter tabs + Add button */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {tabs.map(({ key, label, count }) => (
                        <motion.button
                            key={key}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setFilter(key)}
                            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={filter === key
                                ? { background: 'linear-gradient(135deg, #7c6fff, #a78bfa)', color: '#fff', boxShadow: '0 2px 12px rgba(124,111,255,0.3)' }
                                : { color: '#64748b' }
                            }
                        >
                            {label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${filter === key ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-600'}`}>
                                {count}
                            </span>
                        </motion.button>
                    ))}
                </div>
                <Button onClick={openCreate} icon={Plus} size="sm">Add Transaction</Button>
            </div>

            <Table columns={columns} data={filtered} onEdit={openEdit} onDelete={handleDelete} />

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Transaction' : 'New Transaction'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Description</label>
                        <input type="text" value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className={inputCls} placeholder="e.g. Monthly salary" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Amount (₹)</label>
                            <input type="number" step="0.01" min="0.01" value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                                className={inputCls} placeholder="0.00" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} className={inputCls} required>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} required>
                                <option value="">Select…</option>
                                {(CATEGORIES[form.type] || []).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Date</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} required />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1">{editing ? 'Update' : 'Add Transaction'}</Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
