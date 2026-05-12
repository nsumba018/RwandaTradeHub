import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { staggerItem } from '../../animations';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
  subtitle?: string;
}

const colorMap = {
  blue:  { icon: 'bg-blue-50 text-blue-600',   border: 'border-blue-100' },
  green: { icon: 'bg-green-50 text-green-600', border: 'border-green-100' },
  amber: { icon: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  red:   { icon: 'bg-red-50 text-red-600',     border: 'border-red-100' },
};

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeLabel, icon, color, subtitle }) => {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(37,99,235,0.08)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-[#E7ECF3] p-6 shadow-sm cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.icon}`}>
          {icon}
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#111827] tracking-tight mb-0.5">{value}</p>
        {subtitle && <p className="text-xs text-[#64748B] mb-1">{subtitle}</p>}
        <p className="text-sm text-[#64748B]">{title}</p>
        <p className="text-xs text-[#94A3B8] mt-1">{changeLabel}</p>
      </div>
    </motion.div>
  );
};

export default KPICard;
