import axiosClient from './axiosClient';

/**
 * Servicio de Paquetes de Consultoría.
 * Conecta con los endpoints de /api/v1/paquetes.
 */
export const paqueteService = {
  /**
   * Obtiene la lista completa de paquetes activos.
   */
  async listar() {
    const response = await axiosClient.get('/paquetes');
    return response.data;
  },

  /**
   * Obtiene un paquete por su Id.
   * @param {number} id
   */
  async obtenerPorId(id) {
    const response = await axiosClient.get(`/paquetes/${id}`);
    return response.data;
  },

  /**
   * Registra un nuevo paquete. [Admin]
   * @param {{ nombre: string, descripcion: string, area: string, precio: number }} data
   */
  async crear(data) {
    const response = await axiosClient.post('/paquetes', {
      nombre: data.nombre,
      descripcion: data.descripcion,
      area: data.area,
      precio: Number(data.precio),
    });
    return response.data;
  },

  /**
   * Actualiza un paquete existente. [Admin]
   * @param {number} id
   * @param {{ nombre: string, descripcion: string, area: string, precio: number, activo: boolean }} data
   */
  async actualizar(id, data) {
    const response = await axiosClient.put(`/paquetes/${id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      area: data.area,
      precio: Number(data.precio),
      activo: Boolean(data.activo),
    });
    return response.data;
  },

  /**
   * Realiza la eliminación lógica (soft-delete) de un paquete. [Admin]
   * @param {number} id
   */
  async eliminar(id) {
    const response = await axiosClient.delete(`/paquetes/${id}`);
    return response.data;
  },
};

export default paqueteService;
