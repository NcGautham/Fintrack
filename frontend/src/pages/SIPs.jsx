import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, PauseCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { sipAPI } from '../api/api';

const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const emptyForm = {
    fundName: '', monthlyAmount: '', startDate: '', durationMonths: '', status: 'ACTIVE',
};

const statusConfig = {
    ACTIVE: { icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Active' },
    PAUSED: { icon: PauseCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Paused' },
    COMPLETED: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Completed' },
};

export default function SIPs() {
    const [sips, setSips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSIP, setEditingSIP] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const fetchSIPs = async () => {
        try {
            const res = await sipAPI.getAll();
            setSips(res.data);
        } catch (err) {
            toast.error('Failed to load SIPs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSIPs(); }, []);

    const openCreate = () => {
        setEditingSIP(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (sip) => {
        setEditingSIP(sip);
        setForm({
            fundName: sip.fundName,
            monthlyAmount: String(sip.monthlyAmount),
            startDate: sip.startDate,
            durationMonths: String(sip.durationMonths),
            status: sip.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            monthlyAmount: parseFloat(form.monthlyAmount),
            durationMonths: parseInt(form.durationMonths),
        };
        try {
            if (editingSIP) {
                await sipAPI.update(editingSIP.id, payload);
                toast.success('SIP updated successfully');
            } else {
                await sipAPI.create(payload);
                toast.success('SIP added successfully');
            }
            setModalOpen(false);
            fetchSIPs();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this SIP?')) return;
        try {
            await sipAPI.delete(id);
            toast.success('SIP deleted');
            fetchSIPs();
        } catch (err) {
            toast.error('Failed to delete SIP');
        }
    };

    const columns = [
        {
            header: 'Fund Name',
            accessor: 'fundName',
            render: (row) => <span className="text-white font-medium">{row.fundName}</span>,
        },
        {
            header: 'Monthly',
            accessor: 'monthlyAmount',
            render: (row) => <span className="text-slate-300">{formatCurrency(row.monthlyAmount)}</span>,
        },
        {
            header: 'Duration',
            accessor: 'durationMonths',
            render: (row) => <span className="text-slate-300">{row.durationMonths} months</span>,
        },
        {
            header: 'Total Invested',
            accessor: 'totalInvested',
            render: (row) => <span className="text-white font-medium">{formatCurrency(row.totalInvested)}</span>,
        },
        {
            header: 'Start Date',
            accessor: 'startDate',
            render: (row) => <span className="text-slate-400">{row.startDate}</span>,
        },
        {
            header: 'End Date',
            accessor: 'endDate',
            render: (row) => <span className="text-slate-400">{row.endDate}</span>,
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => {
                const config = statusConfig[row.status] || statusConfig.ACTIVE;
                const Icon = config.icon;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.color} ${config.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                    </span>
                );
            },
        },
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
            <Header title="SIP Plans" subtitle="Manage your systematic investment plans" />

            <div className="flex justify-end mb-6">
                <Button onClick={openCreate} icon={Plus}>
                    Add SIP
                </Button>
            </div>

            <Table columns={columns} data={sips} onEdit={openEdit} onDelete={handleDelete} />

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 glass-card p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-slate-400 text-sm">Total SIP Investment</p>
                        <p className="text-xl font-bold text-white mt-1">
                            {formatCurrency(sips.reduce((sum, s) => sum + (s.totalInvested || 0), 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Monthly Commitment</p>
                        <p className="text-xl font-bold text-amber-400 mt-1">
                            {formatCurrency(sips.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + (s.monthlyAmount || 0), 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Active SIPs</p>
                        <p className="text-xl font-bold text-emerald-400 mt-1">
                            {sips.filter(s => s.status === 'ACTIVE').length} / {sips.length}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSIP ? 'Edit SIP' : 'Add New SIP'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1.5">Fund Name</label>
                        <input
                            type="text"
                            value={form.fundName}
                            onChange={(e) => setForm({ ...form, fundName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Monthly Amount (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.monthlyAmount}
                                onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Duration (months)</label>
                            <input
                                type="number"
                                value={form.durationMonths}
                                onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required min="1"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Start Date</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="PAUSED">Paused</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {editingSIP ? 'Update SIP' : 'Add SIP'}
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
