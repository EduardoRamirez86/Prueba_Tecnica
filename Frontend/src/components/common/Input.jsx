import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          className={twMerge(
            clsx(
              'block w-full rounded-lg border text-sm transition-colors text-slate-900 placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900',
              Icon ? 'pl-9 pr-3' : 'px-3 py-2',
              error
                ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-300 bg-white hover:border-slate-400',
              className
            )
          )}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
