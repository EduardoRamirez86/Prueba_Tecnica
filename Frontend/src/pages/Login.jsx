import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toastError } from '../components/feedback/alerts';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    contrasena: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.contrasena) {
      setErrorMessage('Por favor ingresa tanto el correo como la contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData.email.trim(), formData.contrasena);
      navigate('/consultores', { replace: true });
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
      const serverMsg =
        err.response?.data?.message ||
        (err.validationErrors && err.validationErrors.join('. ')) ||
        'Credenciales inválidas o error de conexión con el servidor.';
      setErrorMessage(serverMsg);
      toastError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Relleno rápido para agilizar pruebas
  const handleQuickFill = (email, pass) => {
    setFormData({
      email,
      contrasena: pass,
    });
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Encabezado con Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-xl bg-slate-900 items-center justify-center text-white shadow-sm mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Consultoría TI
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa a tu cuenta para gestionar consultores y paquetes
        </p>
      </div>

      {/* Tarjeta de Formulario */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl border border-slate-200/80 shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Correo Corporativo"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ejemplo@consultoria.local"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Contraseña"
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              icon={Lock}
              value={formData.contrasena}
              onChange={handleChange}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isSubmitting={isSubmitting}
              >
                {isSubmitting ? 'Verificando credenciales...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>

          {/* Sección de credenciales preconfiguradas (Quick-Fill) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Credenciales de Demostración
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Botón Admin */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin@consultoria.local', 'Admin123*')}
                className="p-3 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-indigo-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  admin@consultoria.local
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Admin123*
                </div>
              </button>

              {/* Botón User */}
              <button
                type="button"
                onClick={() => handleQuickFill('user@consultoria.local', 'User123*')}
                className="p-3 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-slate-900">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>User</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  user@consultoria.local
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  User123*
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
