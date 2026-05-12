import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:   'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-200 border border-blue-600',
  secondary: 'bg-white hover:bg-[#F5F7FB] text-[#111827] border border-[#E7ECF3] shadow-sm',
  ghost:     'bg-transparent hover:bg-[#F5F7FB] text-[#64748B] border border-transparent',
  danger:    'bg-[#EF4444] hover:bg-red-600 text-white shadow-sm shadow-red-200 border border-red-500',
  success:   'bg-[#14B87A] hover:bg-emerald-600 text-white shadow-sm shadow-green-200 border border-green-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-xl gap-2',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', icon, iconRight, loading, fullWidth,
  children, className = '', disabled, ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  );
};

export default Button;
