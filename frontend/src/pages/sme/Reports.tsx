import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, FileText, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations';

const SMEReports: React.FC = () => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Financial Reports</h2>
          <p className="text-sm text-[#64748B]">Kigali Fresh Produce Ltd · Oct 2023 — Mar 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Calendar size={14} />}>Select Period</Button>
          <Button size="sm" icon={<Download size={14} />}>Export PDF</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Financed', value: 'RWF 21.8M', change: '+22%', color: 'text-green-600' },
          { label: 'Invoices Filed', value: '24', change: '+8%', color: 'text-blue-600' },
          { label: 'Avg. Funding Time', value: '1.6 days', change: '-12%', color: 'text-green-600' },
          { label: 'Success Rate', value: '88%', change: '+5%', color: 'text-green-600' },
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
          <h3 className="font-semibold text-[#111827]">Available Reports</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Download detailed financing reports</p>
        </div>
        <div className="divide-y divide-[#F5F7FB]">
          {[
            { title: 'Q1 2024 Financing Summary', period: 'Jan — Mar 2024', size: '2.4 MB', type: 'PDF' },
            { title: 'Q4 2023 Financing Summary', period: 'Oct — Dec 2023', size: '2.1 MB', type: 'PDF' },
            { title: 'Annual Report 2023', period: 'Full Year 2023', size: '5.8 MB', type: 'PDF' },
            { title: 'Invoice Ledger Export', period: 'All time', size: '1.2 MB', type: 'Excel' },
          ].map(report => (
            <div key={report.title} className="px-6 py-4 flex items-center gap-3 hover:bg-[#F5F7FB] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-blue-600" />
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

export default SMEReports;
