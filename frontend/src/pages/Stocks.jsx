import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { stockAPI } from '../api/api';

const fmt = (v) => v == null ? '₹0' : '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const EMPTY = { name: '', ticker: '', quantity: '', buyPrice: '', currentPrice: '', purchaseDate: '' };
const inputCls = "glass-input w-full px-4 py-3 text-sm text-white placeholder-slate-600 transition-all focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20";

export default function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const fetch = async () => {
        try { const r = await stockAPI.getAll(); setStocks(r.data); }
        catch { toast.error('Failed to load stocks'); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
    const openEdit = (s) => {
        setEditing(s);
        setForm({ name: s.name, ticker: s.ticker, quantity: String(s.quantity), buyPrice: String(s.buyPrice), currentPrice: String(s.currentPrice), purchaseDate: s.purchaseDate });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const p = { ...form, quantity: parseInt(form.quantity), buyPrice: parseFloat(form.buyPrice), currentPrice: parseFloat(form.currentPrice) };
        try {
            if (editing) { await stockAPI.update(editing.id, p); toast.success('Stock updated'); }
            else { await stockAPI.create(p); toast.success('Stock added'); }
            setModalOpen(false); fetch();
        } catch { toast.error('Operation failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this stock?')) return;
        try { await stockAPI.delete(id); toast.success('Deleted'); fetch(); }
        catch { toast.error('Failed to delete'); }
    };

    const totalInvested = stocks.reduce((s, x) => s + (x.totalInvested || 0), 0);
    const totalValue    = stocks.reduce((s, x) => s + (x.currentValue  || 0), 0);
    const totalPL       = stocks.reduce((s, x) => s + (x.profitLoss    || 0), 0);

    const columns = [
        {
            header: 'Stock', accessor: 'name',
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)' }}>
                        {r.ticker?.slice(0, 2)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{r.name}</p>
                        <p className="text-[11px] text-slate-600">{r.ticker}</p>
                    </div>
                </div>
            ),
        },
        { header: 'Qty',       accessor: 'quantity',    render: (r) => <span className="text-sm text-slate-300 font-medium">{r.quantity}</span> },
        { header: 'Buy',       accessor: 'buyPrice',    render: (r) => <span className="text-sm text-slate-400">{fmt(r.buyPrice)}</span> },
        { header: 'Current',   accessor: 'currentPrice',render: (r) => <span className="text-sm font-semibold text-white">{fmt(r.currentPrice)}</span> },
        { header: 'Invested',  accessor: 'totalInvested',render: (r) => <span className="text-sm text-slate-400">{fmt(r.totalInvested)}</span> },
        { header: 'Value',     accessor: 'currentValue',render: (r) => <span className="text-sm font-semibold text-white">{fmt(r.currentValue)}</span> },
        {
            header: 'P&L', accessor: 'profitLoss',
            render: (r) => {
                const profit = r.profitLoss >= 0;
                return (
                    <div className="flex items-center gap-1.5">
                        {profit ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                        <div>
                            <p className={`text-sm font-bold ${profit ? 'text-emerald-400' : 'text-rose-400'}`}>{fmt(r.profitLoss)}</p>
                            <p className={`text-[10px] ${profit ? 'text-emerald-600' : 'text-rose-600'}`}>({r.profitLossPercentage?.toFixed(1)}%)</p>
                        </div>
                    </div>
                );
            },
        },
        { header: 'Date', accessor: 'purchaseDate', render: (r) => <span className="text-[11px] text-slate-600">{r.purchaseDate}</span> },
    ];

    if (loading) return (
        <div>
            <Header title="Stock Portfolio" subtitle="Manage your investments" />
            <div className="flex items-center justify-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full" />
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <Header title="Stock Portfolio" subtitle="Track your equity investments" />

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Invested',      value: fmt(totalInvested), color: '#60a5fa', icon: BarChart3 },
                    { label: 'Current Value', value: fmt(totalValue),    color: '#a78bfa', icon: TrendingUp },
                    { label: 'Total P&L',     value: fmt(totalPL),       color: totalPL >= 0 ? '#34d399' : '#fb7185', icon: totalPL >= 0 ? TrendingUp : TrendingDown },
                ].map(({ label, value, color, icon: Icon }) => (
                    <motion.div key={label}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4 flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <p className="text-base sm:text-lg font-bold truncate" style={{ color }}>{value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button onClick={openCreate} icon={Plus} size="sm">Add Stock</Button>
            </div>

            <Table columns={columns} data={stocks} onEdit={openEdit} onDelete={handleDelete} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Stock' : 'Add Stock'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Company Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} required placeholder="e.g. Infosys Ltd" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Ticker</label>
                            <input type="text" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} className={inputCls} required placeholder="INFY" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Quantity</label>
                            <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className={inputCls} required placeholder="10" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Buy Price (₹)</label>
                            <input type="number" step="0.01" min="0" value={form.buyPrice} onChange={e => setForm({ ...form, buyPrice: e.target.value })} className={inputCls} required placeholder="1500.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Current Price (₹)</label>
                            <input type="number" step="0.01" min="0" value={form.currentPrice} onChange={e => setForm({ ...form, currentPrice: e.target.value })} className={inputCls} required placeholder="1800.00" />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Purchase Date</label>
                            <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} className={inputCls} required />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1">{editing ? 'Update Stock' : 'Add Stock'}</Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
