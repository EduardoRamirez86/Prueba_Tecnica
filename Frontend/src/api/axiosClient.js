import axios from 'axios';
import { toastWarning, showWarning, toastError } from '../components/feedback/alerts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5271/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de Solicitud: Inyecta el token Bearer si existe en localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo unificado de 401, 403, 400 y 500
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    // 401 Unauthorized: Sesión expirada o token inválido
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toastWarning('Tu sesión ha expirado. Por favor ingresa nuevamente.');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 403 Forbidden: Acción denegada por RBAC
    if (status === 403) {
      showWarning(
        'Acceso Restringido',
        'No dispones de los permisos de Administrador necesarios para realizar esta acción.'
      );
      return Promise.reject(error);
    }

    // 400 Bad Request: Validaciones de FluentValidation u operacionales
    if (status === 400) {
      // Si la API emite ApiErrorResponse con lista de 'errors'
      const errorList = responseData?.errors;
      if (Array.isArray(errorList) && errorList.length > 0) {
        error.validationErrors = errorList;
      }
      return Promise.reject(error);
    }

    // 500 Internal Server Error u otros errores no controlados
    if (status >= 500) {
      toastError('Error interno del servidor. Por favor intenta más tarde.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
