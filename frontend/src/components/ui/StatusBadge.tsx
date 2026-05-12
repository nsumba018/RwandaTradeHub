import React from 'react';

export type Status = 'pending' | 'verified' | 'funded' | 'repaid' | 'rejected' | 'active' | 'suspended' | 'completed' | 'failed' | 'processing' | 'overdue' | 'low' | 'medium' | 'high';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  verified:   { label: 'Approved',   bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  funded:     { label: 'Funded',     bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  repaid:     { label: 'Repaid',     bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400' },
  rejected:   { label: 'Rejected',   bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  active:     { label: 'Active',     bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  suspended:  { label: 'Suspended',  bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  completed:  { label: 'Completed',  bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  failed:     { label: 'Failed',     bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  processing: { label: 'Processing', bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  overdue:    { label: 'Overdue',    bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  low:        { label: 'Low Risk',   bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  medium:     { label: 'Med Risk',   bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  high:       { label: 'High Risk',  bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
