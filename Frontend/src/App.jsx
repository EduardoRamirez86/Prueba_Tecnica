import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Consultores from './pages/Consultores';
import Paquetes from './pages/Paquetes';
import Reportes from './pages/Reportes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública de Autenticación */}
          <Route path="/login" element={<Login />} />

          {/* Rutas Privadas / Protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirección inicial hacia el módulo de consultores */}
            <Route index element={<Navigate to="/consultores" replace />} />
            <Route path="consultores" element={<Consultores />} />
            <Route path="paquetes" element={<Paquetes />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>

          {/* Catch-all para cualquier otra ruta no reconocida */}
          <Route path="*" element={<Navigate to="/consultores" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
