import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Package, BarChart3, Briefcase, X } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  {
    name: 'Consultores',
    to: '/consultores',
    icon: Users,
  },
  {
    name: 'Paquetes',
    to: '/paquetes',
    icon: Package,
  },
  {
    name: 'Informes y Reportes',
    to: '/reportes',
    icon: BarChart3,
  },
];

export const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  return (
    <>
      {/* Backdrop con overlay difuminado para móviles (< lg) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer responsivo: Drawer fijo en móviles, Sidebar persistente en Desktop */}
      <aside
        className={clsx(
          'w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-screen select-none transition-transform duration-300 ease-in-out',
          'fixed inset-y-0 left-0 z-50 lg:static lg:z-auto lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight block leading-none">
                Consultoría TI
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Management Portal
              </span>
            </div>
          </div>

          {/* Botón de cierre visible únicamente en móvil */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
            title="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Plataforma
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={clsx(
                        'w-4 h-4 transition-colors shrink-0',
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      )}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System info / Version */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>ConsultoriaAPI v1.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="API Online" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
