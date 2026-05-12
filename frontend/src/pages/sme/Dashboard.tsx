import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Clock, TrendingUp, ArrowUpRight, Upload, CheckCircle } from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import StatusBadge, { type Status } from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMyInvoices } from '../../api/invoices';
import type { InvoiceResponse } from '../../api/invoices';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const SMEDashboard: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);

  const totalFunded = invoices.filter(i => i.status === 'FUNDED').reduce((a, b) => a + b.amount, 0);
  const pending  = invoices.filter(i => i.status === 'PENDING').length;
  const funded   = invoices.filter(i => i.status === 'FUNDED').length;
  const verified = invoices.filter(i => i.status === 'VERIFIED').length;
  const rejected = invoices.filter(i => i.status === 'REJECTED').length;
  const total    = invoices.length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={staggerItem} className="bg-gradient-to-r from-[#0B1220] to-[#1E3A5F] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#14B87A]/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-[#94A3B8] text-sm mb-1">{greeting()},</p>
          <h2 className="text-white text-xl font-bold mb-1">{user?.fullName}</h2>
          <p className="text-[#64748B] text-sm mb-4">{user?.email}</p>
          <Link to="/sme/upload">
            <Button icon={<Upload size={15} />} size="sm">Upload New Invoice</Button>
          </Link>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Funded" value={formatCurrency(totalFunded)} change={22} changeLabel="vs. last period" icon={<CreditCard size={20} />} color="green" />
        <KPICard title="Total Invoices" value={loading ? '...' : total.toString()} change={8} changeLabel="this month" icon={<FileText size={20} />} color="blue" />
        <KPICard title="Pending Review" value={loading ? '...' : pending.toString()} change={-2} changeLabel="from last week" icon={<Clock size={20} />} color="amber" />
        <KPICard title="Funded" value={loading ? '...' : funded.toString()} change={5} changeLabel="invoices funded" icon={<TrendingUp size={20} />} color="green" />
      </motion.div>

      {/* Invoice Status */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] p-6 shadow-sm">
        <h3 className="font-semibold text-[#111827] mb-1">Invoice Status</h3>
        <p className="text-xs text-[#64748B] mb-5">Your invoice breakdown</p>
        {loading ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Funded',   count: funded,   color: '#14B87A' },
              { label: 'Approved', count: verified,  color: '#2563EB' },
              { label: 'Pending',  count: pending,   color: '#F59E0B' },
              { label: 'Rejected', count: rejected,  color: '#EF4444' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#64748B]">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: total > 0 ? `${Math.round(item.count / total * 100)}%` : '0%', backgroundColor: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-[#111827] w-6 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Invoices */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#111827]">Recent Invoices</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{total} total invoices</p>
          </div>
          <Link to="/sme/invoices">
            <button className="text-xs text-[#2563EB] font-medium flex items-center gap-1 hover:underline">View all <ArrowUpRight size={12} /></button>
          </Link>
        </div>
        <div className="divide-y divide-[#F5F7FB]">
          {loading && <p className="px-6 py-4 text-sm text-[#64748B]">Loading invoices...</p>}
          {!loading && invoices.length === 0 && <p className="px-6 py-4 text-sm text-[#64748B]">No invoices yet.</p>}
          {invoices.slice(0, 5).map(inv => (
            <div key={inv.id} className="px-6 py-3.5 hover:bg-[#F5F7FB] transition-colors flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827]">{inv.invoiceNumber}</p>
                <p className="text-xs text-[#64748B]">{inv.customerName} · Due {inv.dueDate}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#111827]">{formatCurrency(inv.amount)}</p>
                <StatusBadge status={inv.status.toLowerCase() as Status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div variants={staggerItem} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0">
          <CheckCircle size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1E40AF] mb-1">Tip: Improve your funding speed</p>
          <p className="text-sm text-blue-700/80">Invoices from government debtors are funded 40% faster. Ensure your invoice documentation is complete for quicker verification.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SMEDashboard;
