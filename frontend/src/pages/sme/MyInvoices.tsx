import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, FileText, Download } from 'lucide-react';
import StatusBadge, { type Status } from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { getMyInvoices, type InvoiceResponse } from '../../api/invoices';
import { staggerContainer, staggerItem } from '../../animations';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const MyInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<InvoiceResponse | null>(null);

  useEffect(() => {
    getMyInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const total    = invoices.length;
  const funded   = invoices.filter(i => i.status === 'FUNDED').length;
  const pending  = invoices.filter(i => i.status === 'PENDING').length;
  const verified = invoices.filter(i => i.status === 'VERIFIED').length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: total,    color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Funded',         value: funded,   color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Approved',       value: verified, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Pending',        value: pending,  color: 'bg-amber-50 text-amber-700 border-amber-100' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{loading ? '...' : card.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#111827]">My Invoices</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} invoices</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search invoices..."
                  className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-44"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] cursor-pointer"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="verified">Approved</option>
                <option value="funded">Funded</option>
                <option value="rejected">Rejected</option>
              </select>
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
                  {['Invoice', 'Customer / Debtor', 'Amount', 'Submitted', 'Due Date', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F7FB]">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <FileText size={12} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.customerName}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{inv.dueDate}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={inv.status.toLowerCase() as Status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(inv)}
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#64748B] hover:text-blue-600 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] transition-colors">
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.invoiceNumber || ''}
        subtitle={selected?.description}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <Button icon={<Download size={14} />}>Download</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Customer / Debtor', value: selected.customerName },
                { label: 'Amount',            value: formatCurrency(selected.amount) },
                { label: 'Submitted',         value: new Date(selected.createdAt).toLocaleDateString() },
                { label: 'Due Date',          value: selected.dueDate },
                { label: 'Status',            value: <StatusBadge status={selected.status.toLowerCase() as Status} /> },
                { label: 'Description',       value: selected.description || '—' },
              ].map(item => (
                <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                  {typeof item.value === 'string'
                    ? <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
                    : item.value}
                </div>
              ))}
            </div>
            {selected.status === 'FUNDED' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#14B87A] flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Invoice Funded!</p>
                  <p className="text-xs text-green-700 mt-0.5">An investor has committed funds to this invoice. Disbursement within 48 hours.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default MyInvoices;
