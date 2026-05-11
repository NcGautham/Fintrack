import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { transactionAPI } from '../api/api';

const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const emptyForm = {
    description: '', amount: '', type: 'EXPENSE', category: '', date: '',
};

const categories = {
    INCOME: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
    EXPENSE: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'],
};

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [filter, setFilter] = useState('ALL');

    const fetchTransactions = async () => {
        try {
            const res = await transactionAPI.getAll();
            setTransactions(res.data);
        } catch (err) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (txn) => {
        setEditing(txn);
        setForm({
            description: txn.description,
            amount: String(txn.amount),
            type: txn.type,
            category: txn.category,
            date: txn.date,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, amount: parseFloat(form.amount) };
        try {
            if (editing) {
                await transactionAPI.update(editing.id, payload);
                toast.success('Transaction updated');
            } else {
                await transactionAPI.create(payload);
                toast.success('Transaction added');
            }
            setModalOpen(false);
            fetchTransactions();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await transactionAPI.delete(id);
            toast.success('Transaction deleted');
            fetchTransactions();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);

    const columns = [
        {
            header: 'Transaction',
            accessor: 'description',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${row.type === 'INCOME' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                        }`}>
                        {row.type === 'INCOME' ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-rose-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-white font-medium">{row.description}</p>
                        <p className="text-xs text-slate-500">{row.category}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (row) => (
                <span className={`font-semibold ${row.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.type === 'INCOME' ? '+' : '-'}{formatCurrency(row.amount)}
                </span>
            ),
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => (
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${row.type === 'INCOME'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                    }`}>
                    {row.type}
                </span>
            ),
        },
        { header: 'Category', accessor: 'category', render: (row) => <span className="text-slate-400">{row.category}</span> },
        { header: 'Date', accessor: 'date', render: (row) => <span className="text-slate-400">{row.date}</span> },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                />
            </div>
        );
    }

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

    return (
        <div>
            <Header title="Transactions" subtitle="Track your income and expenses" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {['ALL', 'INCOME', 'EXPENSE'].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab
                                ? 'text-white'
                                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                                }`}
                            style={filter === tab ? { background: 'linear-gradient(135deg, #5c7cfa, #8b5cf6)' } : {}}
                        >
                            {tab === 'ALL' ? 'All' : tab === 'INCOME' ? 'Income' : 'Expenses'}
                        </motion.button>
                    ))}
                </div>

                <Button onClick={openCreate} icon={Plus}>
                    Add Transaction
                </Button>
            </div>

            <Table columns={columns} data={filtered} onEdit={openEdit} onDelete={handleDelete} />

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 glass-card p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-slate-400 text-sm">Total Income</p>
                        <p className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Total Expenses</p>
                        <p className="text-xl font-bold text-rose-400 mt-1">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Net Balance</p>
                        <p className={`text-xl font-bold mt-1 ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(totalIncome - totalExpense)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Transaction' : 'Add New Transaction'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Description</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Amount (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value, category: '' })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required
                            >
                                <option value="">Select category</option>
                                {(categories[form.type] || []).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {editing ? 'Update' : 'Add Transaction'}
                        </Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
