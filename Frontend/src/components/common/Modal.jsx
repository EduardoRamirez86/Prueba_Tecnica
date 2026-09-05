import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevenir scroll en el fondo mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop con desenfoque suave */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor centrado */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={clsx(
            'relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all border border-slate-200 w-full sm:my-8',
            sizes[size] || sizes.md
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Modal */}
          <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-slate-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Modal */}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
