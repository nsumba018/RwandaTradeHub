import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ArrowLeftRight, TrendingUp, DollarSign, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';
import { getAllTransactions, deleteTransaction } from '../../api/transactions';
import type { TransactionResponse } from '../../api/transactions';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TransactionResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransactionResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllTransactions().then(setTransactions).finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(tx =>
    tx.transactionReference.toLowerCase().includes(search.toLowerCase()) ||
    tx.investorName?.toLowerCase().includes(search.toLowerCase()) ||
    tx.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const total = transactions.reduce((a, b) => a + b.amount, 0);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTransaction(deleteTarget.id);
      setTransactions(prev => prev.filter(t => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      {/* Summary cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Transactions', value: transactions.length, icon: ArrowLeftRight, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Volume', value: formatCurrency(total), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Completed', value: transactions.filter(t => t.status === 'COMPLETED').length, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
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

      {/* Table */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#111827]">Transaction Ledger</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} transactions</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-2 text-sm border border-[#E7ECF3] rounded-xl bg-[#F5F7FB] focus:outline-none focus:border-[#2563EB] text-[#111827] placeholder-[#94A3B8] w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#64748B]">Loading transactions...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748B]">No transactions found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FB]">
                  {['Reference', 'Invoice', 'Investor', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F7FB]">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#F5F7FB]/60 transition-colors group">
                    <td className="px-4 py-3.5 text-xs font-mono text-[#374151] whitespace-nowrap">{tx.transactionReference}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-[#111827]">{tx.invoiceNumber}</p>
                      <p className="text-xs text-[#64748B]">{tx.customerName}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-[#111827]">{tx.investorName}</p>
                      <p className="text-xs text-[#64748B]">{tx.investorEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#111827] whitespace-nowrap">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{new Date(tx.transactionDate).toLocaleDateString('en-RW')}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={tx.status.toLowerCase() as any} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(tx)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#374151] text-xs font-medium hover:bg-[#F5F7FB] transition-colors"
                        >
                          <Eye size={11} /> View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-[#111827] text-xs font-bold border-2 border-[#111827] hover:bg-red-50 hover:border-red-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={11} /> Delete
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

      {/* View detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Transaction Details" subtitle={selected?.transactionReference} size="md"
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Reference', value: selected.transactionReference },
              { label: 'Amount', value: formatCurrency(selected.amount) },
              { label: 'Invoice', value: selected.invoiceNumber },
              { label: 'Customer', value: selected.customerName },
              { label: 'Investor', value: selected.investorName },
              { label: 'Investor Email', value: selected.investorEmail },
              { label: 'Date', value: new Date(selected.transactionDate).toLocaleString() },
              { label: 'Status', value: <StatusBadge status={selected.status.toLowerCase() as any} /> },
            ].map(item => (
              <div key={item.label} className="bg-[#F5F7FB] rounded-xl p-3">
                <p className="text-xs text-[#64748B] mb-1">{item.label}</p>
                {typeof item.value === 'string'
                  ? <p className="text-sm font-semibold text-[#111827] break-all">{item.value}</p>
                  : item.value}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Transaction" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <button
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#111827] text-white hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#111827]"
            >
              <Trash2 size={14} />
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </>
        }
      >
        <div className="py-2">
          <p className="text-sm text-[#374151]">
            Are you sure you want to permanently delete transaction <span className="font-mono font-semibold">{deleteTarget?.transactionReference}</span>? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Transactions;
