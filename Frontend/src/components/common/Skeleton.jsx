import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse rounded-md bg-slate-200/80', className)
      )}
      {...props}
    />
  );
};

/**
 * Skeleton estructurado para simular la carga de filas de una tabla.
 */
export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full divide-y divide-slate-200">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center px-6 py-4 space-x-4 animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={clsx(
                'h-4 rounded bg-slate-200/80',
                cIdx === 0 ? 'w-1/4' : cIdx === cols - 1 ? 'w-16' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para tarjetas de métricas o KPIs.
 */
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm animate-pulse space-y-3"
        >
          <div className="h-3 w-1/3 bg-slate-200 rounded" />
          <div className="h-7 w-1/2 bg-slate-200 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
