import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { staggerContainer, staggerItem } from '../../animations';
import { getAvailableInvoices } from '../../api/invoices';
import { fundInvoice } from '../../api/investments';
import type { InvoiceResponse } from '../../api/invoices';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const AvailableInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<InvoiceResponse | null>(null);
  const [funding, setFunding] = useState<InvoiceResponse | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundLoading, setFundLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAvailableInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
    inv.uploadedByName.toLowerCase().includes(search.toLowerCase())
  );

  const totalOpportunity = invoices.reduce((a, b) => a + b.amount, 0);

  const handleFund = async () => {
    if (!funding || !fundAmount || Number(fundAmount) <= 0) return;
    setError('');
    setFundLoading(true);
    try {
      await fundInvoice(funding.id, Number(fundAmount));
      setInvoices(prev => prev.filter(i => i.id !== funding.id));
      setFunding(null);
      setFundAmount('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Failed to commit investment. Please try again.');
    } finally {
      setFundLoading(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      {success && (
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-[#14B87A] flex-shrink-0" />
          <p className="text-sm font-semibold text-green-800">Investment committed! The SME will be notified and funds disbursed within 48 hours.</p>
        </motion.div>
      )}

      {/* Summary cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Available Invoices',  value: invoices.length,             color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Total Opportunity',   value: formatCurrency(totalOpportunity), color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Avg. Return Rate',    value: '12.0% p.a.',                color: 'bg-green-50 text-green-700 border-green-100' },
        ].map(card => (
          <motion.div key={card.label} variants={staggerItem} className={`rounded-2xl border p-4 ${card.color}`}>
            <p className="text-xl font-bold">{loading ? '...' : card.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#111827]">Invoice Marketplace</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Approved invoices ready for funding</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-48" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#64748B]">Loading marketplace...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748B]">No approved invoices available right now.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FB]">
                  {['Invoice', 'SME', 'Customer / Debtor', 'Amount', 'Due Date', 'Return', 'Actions'].map(h => (
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
                          <FileText size={12} className="text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#111827] whitespace-nowrap">{inv.uploadedByName}</p>
                      <p className="text-xs text-[#64748B]">{inv.uploadedByEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{inv.customerName}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{inv.dueDate}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-[#14B87A]">12.0% p.a.</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(inv)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#374151] text-xs font-medium hover:bg-[#F5F7FB] transition-colors"
                        >
                          <Eye size={11} /> View
                        </button>
                        <button
                          onClick={() => { setFunding(inv); setFundAmount(''); setError(''); }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#111827] text-white text-xs font-bold hover:bg-[#374151] transition-colors border border-[#111827]"
                        >
                          <TrendingUp size={11} /> Fund
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

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.invoiceNumber || ''} subtitle="Invoice Details" size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <button
              onClick={() => { setSelected(null); setFunding(selected); setFundAmount(''); setError(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#111827] text-white hover:bg-[#374151] transition-colors border border-[#111827]"
            >
              <TrendingUp size={14} /> Fund This Invoice
            </button>
          </>
        }
      >
        {selected && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SME',            value: selected.uploadedByName },
              { label: 'Customer',       value: selected.customerName },
              { label: 'Invoice Amount', value: formatCurrency(selected.amount) },
              { label: 'Due Date',       value: selected.dueDate },
              { label: 'Return Rate',    value: '12.0% per annum' },
              { label: 'Expected Return',value: formatCurrency(Math.round(selected.amount * 1.12)) },
              { label: 'Submitted',      value: new Date(selected.createdAt).toLocaleDateString() },
              { label: 'Description',    value: selected.description || '—' },
            ].map(item => (
              <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Fund modal */}
      <Modal isOpen={!!funding} onClose={() => setFunding(null)} title={`Fund ${funding?.invoiceNumber}`} subtitle="Enter your investment amount" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFunding(null)}>Cancel</Button>
            <button
              disabled={fundLoading || !fundAmount || Number(fundAmount) <= 0}
              onClick={handleFund}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#111827] text-white hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#111827]"
            >
              <TrendingUp size={14} />
              {fundLoading ? 'Processing...' : 'Commit Investment'}
            </button>
          </>
        }
      >
        {funding && (
          <div className="space-y-4">
            <div className="bg-[#F5F7FB] rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Invoice Total</span>
                <span className="font-semibold text-[#111827]">{formatCurrency(funding.amount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">SME</span>
                <span className="font-semibold text-[#111827]">{funding.uploadedByName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Return Rate</span>
                <span className="font-bold text-[#F59E0B]">12.0% p.a.</span>
              </div>
            </div>
            <Input
              label="Investment Amount (RWF)"
              type="number"
              placeholder="e.g. 5000000"
              value={fundAmount}
              onChange={e => setFundAmount(e.target.value)}
              hint="Enter the amount you want to invest"
            />
            {fundAmount && Number(fundAmount) > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                <p className="text-xs text-green-800">Expected return: <strong>{formatCurrency(Math.round(Number(fundAmount) * 1.12))}</strong> (+{formatCurrency(Math.round(Number(fundAmount) * 0.12))})</p>
              </div>
            )}
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default AvailableInvoices;
