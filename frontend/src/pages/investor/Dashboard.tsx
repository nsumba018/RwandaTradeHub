import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, FileText, ArrowUpRight } from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import { staggerContainer, staggerItem } from '../../animations';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInvestmentHistory } from '../../api/investments';
import type { InvestmentResponse } from '../../api/investments';

const formatCurrency = (n: number) => 'RWF ' + new Intl.NumberFormat('en-RW').format(n);

const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvestmentHistory().then(setInvestments).finally(() => setLoading(false));
  }, []);

  const totalInvested = investments.reduce((a, b) => a + b.fundedAmount, 0);
  const count = investments.length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Welcome banner */}
      <motion.div variants={staggerItem} className="bg-gradient-to-r from-[#0B1220] to-[#1C2A1E] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#F59E0B]/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-[#94A3B8] text-sm mb-1">Investment Portfolio</p>
          <h2 className="text-white text-xl font-bold mb-1">{user?.fullName}</h2>
          <p className="text-[#64748B] text-sm">{user?.email}</p>
          <div className="mt-4 flex items-center gap-6">
            <div>
              <p className="text-xs text-[#64748B]">Total Invested</p>
              <p className="text-xl font-bold text-white">{loading ? '...' : formatCurrency(totalInvested)}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Investments</p>
              <p className="text-xl font-bold text-[#F59E0B]">{loading ? '...' : count}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPICard title="Total Invested" value={loading ? '...' : formatCurrency(totalInvested)} change={25} changeLabel="vs. last period" icon={<DollarSign size={20} />} color="blue" />
        <KPICard title="Total Investments" value={loading ? '...' : count.toString()} change={10} changeLabel="this month" icon={<Briefcase size={20} />} color="amber" />
        <KPICard title="Avg. Return Rate" value="12.0%" change={2} changeLabel="annual rate" icon={<TrendingUp size={20} />} color="green" />
      </motion.div>

      {/* Investment history */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#111827]">My Investments</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{count} funded invoices</p>
          </div>
          <Link to="/investor/history" className="text-xs text-[#2563EB] font-medium flex items-center gap-1 hover:underline">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[#F5F7FB]">
          {loading && <p className="px-6 py-4 text-sm text-[#64748B]">Loading...</p>}
          {!loading && investments.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#64748B]">No investments yet.</p>
              <Link to="/investor/invoices" className="text-xs text-[#F59E0B] font-semibold hover:underline mt-1 block">Browse available invoices →</Link>
            </div>
          )}
          {investments.slice(0, 5).map(inv => (
            <div key={inv.id} className="px-6 py-3.5 hover:bg-[#F5F7FB] transition-colors flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Briefcase size={14} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111827]">{inv.invoiceNumber}</p>
                <p className="text-xs text-[#64748B]">{inv.smeName} · {inv.customerName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#111827]">{formatCurrency(inv.fundedAmount)}</p>
                <p className="text-xs text-[#14B87A]">Funded</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={staggerItem} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">New invoices available for funding</p>
            <p className="text-xs text-amber-700">Browse verified invoices and grow your portfolio</p>
          </div>
        </div>
        <Link to="/investor/invoices" className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Browse Now →
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default InvestorDashboard;
