import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { stockAPI } from '../api/api';

const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const emptyForm = {
    name: '', ticker: '', quantity: '', buyPrice: '', currentPrice: '', purchaseDate: '',
};

export default function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const fetchStocks = async () => {
        try {
            const res = await stockAPI.getAll();
            setStocks(res.data);
        } catch (err) {
            toast.error('Failed to load stocks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStocks(); }, []);

    const openCreate = () => {
        setEditingStock(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (stock) => {
        setEditingStock(stock);
        setForm({
            name: stock.name,
            ticker: stock.ticker,
            quantity: String(stock.quantity),
            buyPrice: String(stock.buyPrice),
            currentPrice: String(stock.currentPrice),
            purchaseDate: stock.purchaseDate,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            quantity: parseInt(form.quantity),
            buyPrice: parseFloat(form.buyPrice),
            currentPrice: parseFloat(form.currentPrice),
        };
        try {
            if (editingStock) {
                await stockAPI.update(editingStock.id, payload);
                toast.success('Stock updated successfully');
            } else {
                await stockAPI.create(payload);
                toast.success('Stock added successfully');
            }
            setModalOpen(false);
            fetchStocks();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock?')) return;
        try {
            await stockAPI.delete(id);
            toast.success('Stock deleted');
            fetchStocks();
        } catch (err) {
            toast.error('Failed to delete stock');
        }
    };

    const columns = [
        {
            header: 'Stock',
            accessor: 'name',
            render: (row) => (
                <div>
                    <p className="text-white font-medium">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.ticker}</p>
                </div>
            ),
        },
        { header: 'Qty', accessor: 'quantity', render: (row) => <span className="text-slate-300">{row.quantity}</span> },
        { header: 'Buy Price', accessor: 'buyPrice', render: (row) => <span className="text-slate-300">{formatCurrency(row.buyPrice)}</span> },
        { header: 'Current', accessor: 'currentPrice', render: (row) => <span className="text-white font-medium">{formatCurrency(row.currentPrice)}</span> },
        { header: 'Invested', accessor: 'totalInvested', render: (row) => <span className="text-slate-300">{formatCurrency(row.totalInvested)}</span> },
        { header: 'Current Value', accessor: 'currentValue', render: (row) => <span className="text-white font-medium">{formatCurrency(row.currentValue)}</span> },
        {
            header: 'P&L',
            accessor: 'profitLoss',
            render: (row) => {
                const pl = row.profitLoss;
                const isProfit = pl >= 0;
                return (
                    <div className="flex items-center gap-1.5">
                        {isProfit ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-rose-400" />
                        )}
                        <span className={isProfit ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                            {formatCurrency(pl)}
                        </span>
                        <span className={`text-xs ${isProfit ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                            ({row.profitLossPercentage?.toFixed(1)}%)
                        </span>
                    </div>
                );
            },
        },
        { header: 'Date', accessor: 'purchaseDate', render: (row) => <span className="text-slate-400 text-sm">{row.purchaseDate}</span> },
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

    return (
        <div>
            <Header title="Stock Portfolio" subtitle="Manage your stock investments" />

            <div className="flex justify-end mb-6">
                <Button onClick={openCreate} icon={Plus}>
                    Add Stock
                </Button>
            </div>

            <Table columns={columns} data={stocks} onEdit={openEdit} onDelete={handleDelete} />

            {/* Summary Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 glass-card p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-slate-400 text-sm">Total Invested</p>
                        <p className="text-xl font-bold text-white mt-1">
                            {formatCurrency(stocks.reduce((sum, s) => sum + (s.totalInvested || 0), 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Current Value</p>
                        <p className="text-xl font-bold text-white mt-1">
                            {formatCurrency(stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Total P&L</p>
                        <p className={`text-xl font-bold mt-1 ${stocks.reduce((sum, s) => sum + (s.profitLoss || 0), 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            {formatCurrency(stocks.reduce((sum, s) => sum + (s.profitLoss || 0), 0))}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Modal Form */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingStock ? 'Edit Stock' : 'Add New Stock'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Company Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Ticker Symbol</label>
                        <input
                            type="text"
                            value={form.ticker}
                            onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Quantity</label>
                            <input
                                type="number"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Buy Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.buyPrice}
                                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="0"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Current Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.currentPrice}
                                onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Purchase Date</label>
                            <input
                                type="date"
                                value={form.purchaseDate}
                                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {editingStock ? 'Update Stock' : 'Add Stock'}
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
