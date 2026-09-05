import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  admin: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
  user: 'bg-slate-100 text-slate-700 ring-slate-600/10',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-700/10',
};

export const Badge = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset select-none',
          variants[variant] || variants.neutral,
          className
        )
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'active' && 'bg-emerald-500',
            variant === 'inactive' && 'bg-rose-500',
            variant === 'admin' && 'bg-indigo-500',
            variant === 'user' && 'bg-slate-400',
            variant === 'warning' && 'bg-amber-500',
            variant === 'neutral' && 'bg-slate-400'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
