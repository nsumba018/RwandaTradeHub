import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, Download, Calendar } from 'lucide-react';
import StatusBadge, { type Status } from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { getAllInvoices, verifyInvoice, rejectInvoice } from '../../api/invoices';
import type { InvoiceResponse } from '../../api/invoices';
import { staggerContainer, staggerItem } from '../../animations';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const InvoiceVerification: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<InvoiceResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<'verify' | 'reject' | null>(null);

  useEffect(() => {
    getAllInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.uploadedByName.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleVerify = async (id: number) => {
    setActionLoading('verify');
    try {
      const updated = await verifyInvoice(id);
      setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv));
      if (selected?.id === id) setSelected(updated);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading('reject');
    try {
      const updated = await rejectInvoice(id);
      setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv));
      if (selected?.id === id) setSelected(updated);
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    pending:  invoices.filter(i => i.status === 'PENDING').length,
    verified: invoices.filter(i => i.status === 'VERIFIED').length,
    funded:   invoices.filter(i => i.status === 'FUNDED').length,
    rejected: invoices.filter(i => i.status === 'REJECTED').length,
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      {/* Summary */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending Review', value: counts.pending,  color: 'bg-amber-50 border-amber-100 text-amber-700' },
          { label: 'Approved',       value: counts.verified, color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: 'Funded',         value: counts.funded,   color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Rejected',       value: counts.rejected, color: 'bg-red-50 border-red-100 text-red-700' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{loading ? '...' : card.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#111827]">Invoice Queue</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} invoices shown</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:w-52 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search invoices..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8]"
                />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Approved</option>
                  <option value="funded">Funded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#64748B]">Loading invoices...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748B]">No invoices found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FB]">
                  {['Invoice #', 'SME', 'Customer', 'Amount', 'Due Date', 'Submitted', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F7FB]">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={12} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-[#111827] whitespace-nowrap">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#111827] whitespace-nowrap">{inv.uploadedByName}</p>
                      <p className="text-xs text-[#64748B]">{inv.uploadedByEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.customerName}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{inv.dueDate}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={inv.status.toLowerCase() as Status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(inv)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#374151] text-xs font-medium hover:bg-[#F5F7FB] transition-colors"
                        >
                          <Eye size={11} /> View
                        </button>
                        {inv.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleVerify(inv.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#111827] text-white text-xs font-bold hover:bg-[#374151] transition-colors border border-[#111827]"
                            >
                              <CheckCircle size={11} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(inv.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-[#111827] text-xs font-bold border-2 border-[#111827] hover:bg-[#F5F7FB] transition-colors"
                            >
                              <XCircle size={11} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.invoiceNumber || ''}
        subtitle={selected?.uploadedByEmail}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            {selected?.status === 'PENDING' && (
              <>
                <button
                  disabled={actionLoading === 'reject'}
                  onClick={() => handleReject(selected.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 border-[#111827] bg-white text-[#111827] hover:bg-[#F5F7FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle size={15} />
                  {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  disabled={actionLoading === 'verify'}
                  onClick={() => handleVerify(selected.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#111827] text-white hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#111827]"
                >
                  <CheckCircle size={15} />
                  {actionLoading === 'verify' ? 'Approving...' : 'Approve Invoice'}
                </button>
              </>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'SME Name',         value: selected.uploadedByName },
                { label: 'SME Email',        value: selected.uploadedByEmail },
                { label: 'Customer/Debtor',  value: selected.customerName },
                { label: 'Amount',           value: formatCurrency(selected.amount) },
                { label: 'Due Date',         value: selected.dueDate },
                { label: 'Submitted',        value: new Date(selected.createdAt).toLocaleDateString() },
                { label: 'Status',           value: <StatusBadge status={selected.status.toLowerCase() as Status} /> as React.ReactNode },
                { label: 'Description',      value: selected.description || '—' },
              ].map(item => (
                <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                  {typeof item.value === 'string'
                    ? <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
                    : item.value}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={<Download size={14} />}>Download Invoice</Button>
              <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>View Timeline</Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default InvoiceVerification;
