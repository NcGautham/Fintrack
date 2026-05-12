import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, PauseCircle, Repeat, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { sipAPI } from '../api/api';

const fmt = (v) => v == null ? '₹0' : '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const EMPTY = { fundName: '', monthlyAmount: '', startDate: '', durationMonths: '', status: 'ACTIVE' };
const inputCls = "glass-input w-full px-4 py-3 text-sm text-white placeholder-slate-600 transition-all focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20";

const STATUS = {
    ACTIVE:    { label: 'Active',    cls: 'badge-emerald', icon: Clock },
    PAUSED:    { label: 'Paused',    cls: 'badge-amber',   icon: PauseCircle },
    COMPLETED: { label: 'Completed', cls: 'badge-blue',    icon: CheckCircle },
};

export default function SIPs() {
    const [sips, setSips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);

    const fetch = async () => {
        try { const r = await sipAPI.getAll(); setSips(r.data); }
        catch { toast.error('Failed to load SIPs'); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetch(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
    const openEdit = (s) => {
        setEditing(s);
        setForm({ fundName: s.fundName, monthlyAmount: String(s.monthlyAmount), startDate: s.startDate, durationMonths: String(s.durationMonths), status: s.status });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const p = { ...form, monthlyAmount: parseFloat(form.monthlyAmount), durationMonths: parseInt(form.durationMonths) };
        try {
            if (editing) { await sipAPI.update(editing.id, p); toast.success('SIP updated'); }
            else { await sipAPI.create(p); toast.success('SIP added'); }
            setModalOpen(false); fetch();
        } catch { toast.error('Operation failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this SIP?')) return;
        try { await sipAPI.delete(id); toast.success('Deleted'); fetch(); }
        catch { toast.error('Failed to delete'); }
    };

    const totalInvested  = sips.reduce((s, x) => s + (x.totalInvested  || 0), 0);
    const monthlyCommit  = sips.filter(s => s.status === 'ACTIVE').reduce((s, x) => s + (x.monthlyAmount || 0), 0);
    const activeCount    = sips.filter(s => s.status === 'ACTIVE').length;

    const columns = [
        {
            header: 'Fund', accessor: 'fundName',
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                        <Repeat className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-white">{r.fundName}</p>
                </div>
            ),
        },
        { header: 'Monthly',   accessor: 'monthlyAmount',  render: (r) => <span className="text-sm font-semibold text-amber-400">{fmt(r.monthlyAmount)}</span> },
        { header: 'Duration',  accessor: 'durationMonths', render: (r) => <span className="text-sm text-slate-400">{r.durationMonths}m</span> },
        { header: 'Invested',  accessor: 'totalInvested',  render: (r) => <span className="text-sm font-semibold text-white">{fmt(r.totalInvested)}</span> },
        { header: 'Start',     accessor: 'startDate',      render: (r) => <span className="text-[11px] text-slate-500">{r.startDate}</span> },
        { header: 'End',       accessor: 'endDate',        render: (r) => <span className="text-[11px] text-slate-500">{r.endDate}</span> },
        {
            header: 'Status', accessor: 'status',
            render: (r) => {
                const cfg = STATUS[r.status] || STATUS.ACTIVE;
                const Icon = cfg.icon;
                return (
                    <span className={`${cfg.cls} inline-flex items-center gap-1`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                );
            },
        },
    ];

    if (loading) return (
        <div>
            <Header title="SIP Plans" subtitle="Systematic investment plans" />
            <div className="flex items-center justify-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full" />
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <Header title="SIP Plans" subtitle="Manage your systematic investment plans" />

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Invested',    value: fmt(totalInvested), color: '#a78bfa', icon: CalendarDays },
                    { label: 'Monthly Commit',    value: fmt(monthlyCommit), color: '#fbbf24', icon: Repeat },
                    { label: 'Active SIPs',       value: `${activeCount} / ${sips.length}`, color: '#34d399', icon: CheckCircle },
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
                <Button onClick={openCreate} icon={Plus} size="sm">Add SIP</Button>
            </div>

            <Table columns={columns} data={sips} onEdit={openEdit} onDelete={handleDelete} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit SIP' : 'Add New SIP'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Fund Name</label>
                        <input type="text" value={form.fundName} onChange={e => setForm({ ...form, fundName: e.target.value })} className={inputCls} required placeholder="e.g. HDFC Flexi Cap Fund" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Monthly (₹)</label>
                            <input type="number" step="0.01" min="1" value={form.monthlyAmount} onChange={e => setForm({ ...form, monthlyAmount: e.target.value })} className={inputCls} required placeholder="5000" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Duration (months)</label>
                            <input type="number" min="1" value={form.durationMonths} onChange={e => setForm({ ...form, durationMonths: e.target.value })} className={inputCls} required placeholder="12" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Start Date</label>
                            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inputCls} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                                <option value="ACTIVE">Active</option>
                                <option value="PAUSED">Paused</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1">{editing ? 'Update SIP' : 'Add SIP'}</Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
