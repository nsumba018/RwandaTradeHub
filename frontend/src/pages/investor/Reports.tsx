import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, FileText, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';

const InvestorReports: React.FC = () => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Investment Reports</h2>
          <p className="text-sm text-[#64748B]">Rwanda Development Fund · Oct 2023 — Mar 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>Select Period</Button>
          <Button size="sm" icon={<Download size={14} />}>Export PDF</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invested', value: 'RWF 350M', change: '+25%', color: 'text-blue-600' },
          { label: 'Total Returns', value: 'RWF 42M', change: '+18%', color: 'text-green-600' },
          { label: 'Avg. Return Rate', value: '12.0%', change: '+2%', color: 'text-amber-600' },
          { label: 'Active Investments', value: '12', change: '+10%', color: 'text-blue-600' },
        ].map(k => (
          <motion.div key={k.label} variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] p-5 shadow-sm">
            <p className="text-xs text-[#64748B] mb-2">{k.label}</p>
            <p className="text-xl font-bold text-[#111827]">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={11} className={k.color} />
              <span className={`text-xs font-medium ${k.color}`}>{k.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Downloads */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#E7ECF3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7ECF3]">
          <h3 className="font-semibold text-[#111827]">Downloadable Reports</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Generate and download investment reports</p>
        </div>
        <div className="divide-y divide-[#F5F7FB]">
          {[
            { title: 'Q1 2024 Portfolio Report', period: 'Jan — Mar 2024', size: '3.2 MB', type: 'PDF' },
            { title: 'Q4 2023 Portfolio Report', period: 'Oct — Dec 2023', size: '2.8 MB', type: 'PDF' },
            { title: 'Annual Investment Report 2023', period: 'Full Year 2023', size: '7.1 MB', type: 'PDF' },
            { title: 'Transaction Export', period: 'All time', size: '1.4 MB', type: 'Excel' },
            { title: 'Tax Certificate 2023', period: 'FY 2023', size: '0.8 MB', type: 'PDF' },
          ].map(report => (
            <div key={report.title} className="px-6 py-4 flex items-center gap-3 hover:bg-[#F5F7FB] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">{report.title}</p>
                <p className="text-xs text-[#64748B]">{report.period} · {report.size} · {report.type}</p>
              </div>
              <Button variant="secondary" size="sm" icon={<Download size={13} />}>Download</Button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvestorReports;
