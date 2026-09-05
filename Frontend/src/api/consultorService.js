import axiosClient from './axiosClient';

/**
 * Servicio de Consultores.
 * Conecta con los endpoints de /api/v1/consultores.
 */
export const consultorService = {
  /**
   * Obtiene la lista completa de consultores activos.
   */
  async listar() {
    const response = await axiosClient.get('/consultores');
    return response.data;
  },

  /**
   * Obtiene un consultor por su Id.
   * @param {number} id
   */
  async obtenerPorId(id) {
    const response = await axiosClient.get(`/consultores/${id}`);
    return response.data;
  },

  /**
   * Registra un nuevo consultor en el sistema. [Admin]
   * @param {{ nombreCompleto: string, emailCorporativo: string, areaEspecializacion: string, tarifaHora: number }} data
   */
  async crear(data) {
    const response = await axiosClient.post('/consultores', {
      nombreCompleto: data.nombreCompleto,
      emailCorporativo: data.emailCorporativo,
      areaEspecializacion: data.areaEspecializacion,
      tarifaHora: Number(data.tarifaHora),
    });
    return response.data;
  },

  /**
   * Actualiza los datos de un consultor existente. [Admin]
   * @param {number} id
   * @param {{ nombreCompleto: string, emailCorporativo: string, areaEspecializacion: string, tarifaHora: number, activo: boolean }} data
   */
  async actualizar(id, data) {
    const response = await axiosClient.put(`/consultores/${id}`, {
      nombreCompleto: data.nombreCompleto,
      emailCorporativo: data.emailCorporativo,
      areaEspecializacion: data.areaEspecializacion,
      tarifaHora: Number(data.tarifaHora),
      activo: Boolean(data.activo),
    });
    return response.data;
  },

  /**
   * Realiza la eliminación lógica (soft-delete) de un consultor. [Admin]
   * @param {number} id
   */
  async eliminar(id) {
    const response = await axiosClient.delete(`/consultores/${id}`);
    return response.data;
  },
};

export default consultorService;
