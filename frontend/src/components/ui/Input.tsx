import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  hint?: string;
}

const Input: React.FC<InputProps> = ({ label, error, icon, rightElement, hint, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#374151] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            {icon}
          </div>
        )}
        <input
          className={`w-full border rounded-xl bg-white text-[#111827] placeholder-[#94A3B8] text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${error ? 'border-[#EF4444]' : 'border-[#E7ECF3] hover:border-[#CBD5E1]'} ${icon ? 'pl-10' : 'pl-3.5'} ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-[#94A3B8]">{hint}</p>}
    </div>
  );
};

export default Input;
