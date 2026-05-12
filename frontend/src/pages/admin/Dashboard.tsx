import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, FileText, TrendingUp, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import StatusBadge, { type Status } from '../../components/ui/StatusBadge';
import { staggerContainer, staggerItem } from '../../animations';
import { Link } from 'react-router-dom';
import { getAllInvoices } from '../../api/invoices';
import { getAllTransactions } from '../../api/transactions';
import type { InvoiceResponse } from '../../api/invoices';
import type { TransactionResponse } from '../../api/transactions';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const AdminDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllInvoices(), getAllTransactions()])
      .then(([inv, txn]) => { setInvoices(inv); setTransactions(txn); })
      .finally(() => setLoading(false));
  }, []);

  const pending  = invoices.filter(i => i.status === 'PENDING').length;
  const verified = invoices.filter(i => i.status === 'VERIFIED').length;
  const funded   = invoices.filter(i => i.status === 'FUNDED').length;
  const rejected = invoices.filter(i => i.status === 'REJECTED').length;
  const totalVolume = transactions.reduce((a, b) => a + b.amount, 0);
  const uniqueSMEs = new Set(invoices.map(i => i.uploadedByEmail)).size;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">

      {/* Pending alert banner */}
      {!loading && pending > 0 && (
        <motion.div variants={staggerItem} className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800">
              {pending} invoice{pending !== 1 ? 's' : ''} waiting for your approval
            </p>
          </div>
          <Link to="/admin/verification" className="text-xs font-bold text-amber-800 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Review Now →
          </Link>
        </motion.div>
      )}

      {/* KPIs */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Volume" value={loading ? '...' : formatCurrency(totalVolume)} change={18} changeLabel="vs. last month" icon={<CreditCard size={20} />} color="blue" />
        <KPICard title="Total Invoices" value={loading ? '...' : invoices.length.toString()} change={8} changeLabel="this month" icon={<FileText size={20} />} color="blue" />
        <KPICard title="Active SMEs" value={loading ? '...' : uniqueSMEs.toString()} change={15} changeLabel="vs. last month" icon={<Users size={20} />} color="amber" />
        <KPICard title="Funded Invoices" value={loading ? '...' : funded.toString()} change={22} changeLabel="vs. last month" icon={<TrendingUp size={20} />} color="green" />
      </motion.div>

      {/* Platform Status */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] p-6 shadow-sm">
        <h3 className="font-semibold text-[#111827] mb-4">Platform Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Clock,        label: 'Pending Approval',     value: loading ? '...' : `${pending} invoices`,  color: 'text-amber-600 bg-amber-50' },
            { icon: CheckCircle,  label: 'Approved (In Market)', value: loading ? '...' : `${verified} invoices`, color: 'text-blue-600 bg-blue-50' },
            { icon: TrendingUp,   label: 'Funded',               value: loading ? '...' : `${funded} invoices`,   color: 'text-green-600 bg-green-50' },
            { icon: AlertCircle,  label: 'Rejected',             value: loading ? '...' : `${rejected} invoices`, color: 'text-red-600 bg-red-50' },
            { icon: FileText,     label: 'Total Invoices',       value: loading ? '...' : invoices.length.toString(), color: 'text-blue-600 bg-blue-50' },
            { icon: Users,        label: 'Unique SMEs',          value: loading ? '...' : uniqueSMEs.toString(),  color: 'text-green-600 bg-green-50' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FB] hover:bg-white border border-transparent hover:border-[#E7ECF3] transition-all duration-150">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#64748B] truncate">{item.label}</p>
                <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Invoices */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E7ECF3] flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">Recent Invoices</h3>
            <Link to="/admin/verification" className="text-xs text-[#2563EB] font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F5F7FB]">
            {loading && <p className="px-6 py-4 text-sm text-[#64748B]">Loading...</p>}
            {!loading && invoices.length === 0 && <p className="px-6 py-4 text-sm text-[#64748B]">No invoices yet.</p>}
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="px-6 py-3.5 hover:bg-[#F5F7FB] transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FB] border border-[#E7ECF3] flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-[#64748B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{inv.invoiceNumber}</p>
                  <p className="text-xs text-[#64748B] truncate">{inv.uploadedByName} · {inv.customerName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[#111827]">{formatCurrency(inv.amount)}</p>
                  <StatusBadge status={inv.status.toLowerCase() as Status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E7ECF3] flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">Recent Transactions</h3>
            <Link to="/admin/transactions" className="text-xs text-[#2563EB] font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F5F7FB]">
            {loading && <p className="px-6 py-4 text-sm text-[#64748B]">Loading...</p>}
            {!loading && transactions.length === 0 && <p className="px-6 py-4 text-sm text-[#64748B]">No transactions yet.</p>}
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="px-6 py-3.5 hover:bg-[#F5F7FB] transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{tx.transactionReference}</p>
                  <p className="text-xs text-[#64748B] truncate">{tx.investorName} · {tx.invoiceNumber}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[#111827]">{formatCurrency(tx.amount)}</p>
                  <StatusBadge status={tx.status.toLowerCase() as Status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
