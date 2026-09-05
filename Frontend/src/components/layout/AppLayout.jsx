import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar: Drawer en móviles (<lg) y barra fija en desktop (>=lg) */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Área principal de contenido */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar onOpenMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
