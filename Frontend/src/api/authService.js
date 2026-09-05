import axiosClient from './axiosClient';

/**
 * Servicio de Autenticación.
 * Conecta con POST /api/v1/auth/login enviando { email, password }.
 */
export const authService = {
  /**
   * Realiza el inicio de sesión.
   * @param {string} email
   * @param {string} contrasena
   * @returns {Promise<{ token: string, email: string, rol: string, expiracion: string }>}
   */
  async login(email, contrasena) {
    const response = await axiosClient.post('/auth/login', {
      email,
      password: contrasena,
    });
    return response.data;
  },
};

export default authService;
