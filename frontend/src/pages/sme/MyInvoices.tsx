import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, FileText, Download } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { mockInvoices, formatCurrency } from '../../data/mockData';
import type { Invoice } from '../../types';
import { staggerContainer, staggerItem } from '../../animations';

const myInvoices = mockInvoices.filter(i => i.smeId === 'sme1');

const MyInvoices: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = myInvoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.debtorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: myInvoices.length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Funded', value: myInvoices.filter(i => i.status === 'funded').length, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Pending', value: myInvoices.filter(i => i.status === 'pending').length, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Repaid', value: myInvoices.filter(i => i.status === 'repaid').length, color: 'bg-slate-100 text-slate-700 border-slate-200' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{card.value}</p>
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
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-44" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] cursor-pointer">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="funded">Funded</option>
                <option value="repaid">Repaid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FB]">
                {['Invoice', 'Debtor', 'Amount', 'Funding', 'Issue Date', 'Due Date', 'Status', ''].map(h => (
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
                  <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.debtorName}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3.5 w-28">
                    {inv.fundingProgress !== undefined ? (
                      <div>
                        <div className="h-1.5 bg-[#E7ECF3] rounded-full overflow-hidden">
                          <div className="h-full bg-[#14B87A] rounded-full" style={{ width: `${inv.fundingProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{inv.fundingProgress}%</p>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{inv.issueDate}</td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{inv.dueDate}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={inv.status} size="sm" /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelected(inv)} className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#64748B] hover:text-blue-600 transition-colors">
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
        </div>
      </motion.div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.invoiceNumber || ''} subtitle={selected?.description} size="lg"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button icon={<Download size={14} />}>Download</Button></>}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Debtor', value: selected.debtorName },
                { label: 'Amount', value: formatCurrency(selected.amount) },
                { label: 'Issue Date', value: selected.issueDate },
                { label: 'Due Date', value: selected.dueDate },
                { label: 'Status', value: <StatusBadge status={selected.status} /> },
                { label: 'Risk Score', value: selected.riskScore ? <StatusBadge status={selected.riskScore} /> : 'Pending' },
                { label: 'Verified On', value: selected.verifiedAt || 'Not yet verified' },
                { label: 'Funded On', value: selected.fundedAt || '—' },
              ].map(item => (
                <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                  {typeof item.value === 'string'
                    ? <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
                    : item.value}
                </div>
              ))}
            </div>
            {selected.fundingProgress !== undefined && (
              <div className="bg-[#F5F7FB] rounded-xl p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#64748B]">Funding Progress</span>
                  <span className="font-semibold text-[#111827]">{selected.fundingProgress}%</span>
                </div>
                <div className="h-2 bg-[#E7ECF3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B87A] rounded-full" style={{ width: `${selected.fundingProgress}%` }} />
                </div>
                <p className="text-xs text-[#64748B] mt-1">{formatCurrency(selected.amount * selected.fundingProgress / 100)} of {formatCurrency(selected.amount)} funded</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default MyInvoices;
