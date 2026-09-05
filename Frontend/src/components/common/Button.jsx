import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-900/20',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-300/30',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500/20',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200/50',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-4 py-2.5 text-sm font-semibold rounded-lg gap-2',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isSubmitting = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const isLoading = isSubmitting || loading;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 select-none',
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          isDisabled && 'opacity-60 cursor-not-allowed hover:bg-opacity-100 shadow-none',
          className
        )
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
