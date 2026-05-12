import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, error, options, placeholder, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          className={`w-full border rounded-xl bg-white text-[#111827] text-sm appearance-none cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pl-3.5 pr-10 py-2.5 ${error ? 'border-[#EF4444]' : 'border-[#E7ECF3] hover:border-[#CBD5E1]'} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
};

export default Select;
