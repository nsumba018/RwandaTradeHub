import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Briefcase } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';
import { getInvestmentHistory } from '../../api/investments';
import type { InvestmentResponse } from '../../api/investments';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const InvestmentHistory: React.FC = () => {
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<InvestmentResponse | null>(null);

  useEffect(() => {
    getInvestmentHistory().then(setInvestments).finally(() => setLoading(false));
  }, []);

  const filtered = investments.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.smeName.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalInvested = investments.reduce((a, b) => a + b.fundedAmount, 0);
  const totalExpected = investments.reduce((a, b) => a + Math.round(b.fundedAmount * 1.12), 0);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Investments', value: loading ? '...' : investments.length,              color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Total Invested',    value: loading ? '...' : formatCurrency(totalInvested),  color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Expected Returns',  value: loading ? '...' : formatCurrency(totalExpected),  color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Avg. Return Rate',  value: '12.0% p.a.',                                     color: 'bg-blue-50 text-blue-700 border-blue-100' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 ${card.color}`}>
            <p className="text-xl font-bold">{card.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#111827]">Investment History</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} investments</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-44"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#64748B]">Loading history...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748B]">No investments found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FB]">
                  {['Invoice', 'SME', 'Customer', 'Amount Invested', 'Expected Return', 'Return Rate', 'Funded On', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F7FB]">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase size={12} className="text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.smeName}</td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.customerName}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.fundedAmount)}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#14B87A] whitespace-nowrap">{formatCurrency(Math.round(inv.fundedAmount * 1.12))}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-[#F59E0B]">12.0%</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{new Date(inv.fundedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelected(inv)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#64748B] hover:text-blue-600 transition-all"
                      >
                        <Eye size={13} />
                      </button>
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
        subtitle="Investment Details"
        size="md"
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SME',              value: selected.smeName },
              { label: 'Customer',         value: selected.customerName },
              { label: 'Invoice Amount',   value: formatCurrency(selected.invoiceAmount) },
              { label: 'Amount Invested',  value: formatCurrency(selected.fundedAmount) },
              { label: 'Expected Return',  value: formatCurrency(Math.round(selected.fundedAmount * 1.12)) },
              { label: 'Net Gain',         value: formatCurrency(Math.round(selected.fundedAmount * 0.12)) },
              { label: 'Return Rate',      value: '12.0% p.a.' },
              { label: 'Funded On',        value: new Date(selected.fundedDate).toLocaleDateString() },
            ].map(item => (
              <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default InvestmentHistory;
