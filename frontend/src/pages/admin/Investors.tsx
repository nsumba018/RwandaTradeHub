import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Users, TrendingUp, DollarSign, Shield } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { mockInvestors, formatCurrency } from '../../data/mockData';
import type { Investor } from '../../types';
import { staggerContainer, staggerItem } from '../../animations';

const Investors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Investor | null>(null);

  const filtered = mockInvestors.filter(inv =>
    inv.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCapital = mockInvestors.reduce((a, b) => a + b.totalInvested, 0);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Investors', value: mockInvestors.length, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { label: 'Total Capital', value: formatCurrency(totalCapital), icon: DollarSign, color: 'bg-green-50 text-green-600 border-green-100' },
          { label: 'Avg. Return Rate', value: '12.0%', icon: TrendingUp, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { label: 'KYC Verified', value: mockInvestors.filter(i => i.kycStatus === 'verified').length, icon: Shield, color: 'bg-green-50 text-green-600 border-green-100' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 bg-white shadow-sm`}>
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
            <h3 className="font-semibold text-[#111827]">Investor Accounts</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} investors</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search investors..."
              className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FB]">
                {['Investor', 'Type', 'Total Invested', 'Active', 'Total Returns', 'Return Rate', 'KYC', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F7FB]">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-600">{inv.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827] whitespace-nowrap">{inv.name}</p>
                        <p className="text-xs text-[#64748B]">{inv.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F5F7FB] text-[#64748B] capitalize whitespace-nowrap">{inv.type}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.totalInvested)}</td>
                  <td className="px-4 py-3.5 text-sm text-[#374151]">{inv.activeInvestments}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#14B87A] whitespace-nowrap">{formatCurrency(inv.totalReturns)}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#111827]">{inv.returnRate}%</td>
                  <td className="px-4 py-3.5"><StatusBadge status={inv.kycStatus as any} size="sm" /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={inv.status} size="sm" /></td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setSelected(inv)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#64748B] hover:text-blue-600 transition-all">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} subtitle={`${selected?.type} investor`} size="md"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button>Send Message</Button></>}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Member Since', value: selected.createdAt },
                { label: 'KYC Status', value: <StatusBadge status={selected.kycStatus as any} /> },
                { label: 'Total Invested', value: formatCurrency(selected.totalInvested) },
                { label: 'Active Investments', value: selected.activeInvestments.toString() },
                { label: 'Total Returns', value: formatCurrency(selected.totalReturns) },
                { label: 'Return Rate', value: `${selected.returnRate}%` },
                { label: 'Portfolio Value', value: formatCurrency(selected.portfolio) },
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

export default Investors;
