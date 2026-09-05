import React from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { Badge } from '../common/Badge';

const routeTitles = {
  '/consultores': 'Gestión de Consultores',
  '/paquetes': 'Catálogo de Paquetes',
  '/reportes': 'Informes Analíticos & Métricas',
};

export const Navbar = ({ onOpenMenu = () => {} }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const currentTitle = routeTitles[location.pathname] || 'Panel Principal';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Botón de Menú Hamburguesa en Móvil + Título */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
          title="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Sección de Usuario & Acciones */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* User Info with Badge */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-200 shrink-0">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>

          <div className="hidden md:flex flex-col text-left max-w-[150px] lg:max-w-[200px]">
            <span className="text-xs font-semibold text-slate-900 leading-tight truncate">
              {user?.nombre || user?.email || 'Usuario'}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight truncate">
              {user?.email}
            </span>
          </div>

          <Badge variant={isAdmin ? 'admin' : 'user'} dot className="shrink-0">
            {user?.rol || 'User'}
          </Badge>
        </div>

        {/* Botón Salir */}
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
