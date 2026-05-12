import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Building2, FileText, TrendingUp, Star } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { mockSMEs, formatCurrency } from '../../data/mockData';
import type { SME } from '../../types';
import { staggerContainer, staggerItem } from '../../animations';

const SMEs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SME | null>(null);

  const filtered = mockSMEs.filter(sme =>
    sme.companyName.toLowerCase().includes(search.toLowerCase()) ||
    sme.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    sme.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total SMEs', value: mockSMEs.length, icon: Building2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: mockSMEs.filter(s => s.status === 'active').length, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Invoices Filed', value: mockSMEs.reduce((a, b) => a + b.totalInvoices, 0), icon: FileText, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Funding', value: formatCurrency(mockSMEs.reduce((a, b) => a + b.totalFunding, 0)), icon: Star, color: 'text-blue-600 bg-blue-50' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon size={17} />
            </div>
            <p className="text-xl font-bold text-[#111827]">{card.value}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#111827]">SME Business Accounts</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} businesses</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SMEs..." className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FB]">
                {['Business', 'Industry', 'Total Invoices', 'Funded', 'Total Funding', 'Credit Score', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {filtered.map(sme => (
                <tr key={sme.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">{sme.companyName.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827] whitespace-nowrap">{sme.companyName}</p>
                        <p className="text-xs text-[#64748B]">{sme.ownerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F5F7FB] text-[#64748B] whitespace-nowrap">{sme.industry}</span></td>
                  <td className="px-4 py-3.5 text-sm text-[#374151]">{sme.totalInvoices}</td>
                  <td className="px-4 py-3.5 text-sm text-[#374151]">{sme.fundedInvoices}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(sme.totalFunding)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-16 h-1.5 bg-[#E7ECF3] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sme.creditScore}%`, backgroundColor: sme.creditScore >= 80 ? '#14B87A' : sme.creditScore >= 60 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span className="text-xs font-semibold text-[#111827]">{sme.creditScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={sme.status} size="sm" /></td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setSelected(sme)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#64748B] hover:text-blue-600 transition-all">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.companyName || ''} subtitle={selected?.industry} size="lg"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button>View Invoices</Button></>}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Owner', value: selected.ownerName },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Registration #', value: selected.registrationNumber },
                { label: 'TIN Number', value: selected.tinNumber },
                { label: 'Address', value: selected.address },
                { label: 'Member Since', value: selected.createdAt },
                { label: 'Credit Score', value: `${selected.creditScore}/100` },
                { label: 'Total Invoices', value: selected.totalInvoices.toString() },
                { label: 'Funded Invoices', value: selected.fundedInvoices.toString() },
                { label: 'Total Funding', value: formatCurrency(selected.totalFunding) },
                { label: 'Status', value: <StatusBadge status={selected.status} /> },
              ].map(item => (
                <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                  {typeof item.value === 'string'
                    ? <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
                    : item.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default SMEs;
