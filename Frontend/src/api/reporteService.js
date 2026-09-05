import axiosClient from './axiosClient';

/**
 * Servicio de Informes y Reportes.
 * Conecta con los endpoints analíticos de /api/v1/reportes.
 */
export const reporteService = {
  /**
   * Obtiene el reporte paginado de paquetes agrupados por área.
   * @param {object} params
   * @param {string} [params.filtroArea]
   * @param {number} [params.page=1]
   * @param {number} [params.pageSize=10]
   * @param {string} [params.sortBy='Area']
   * @param {string} [params.sortDir='ASC']
   */
  async getPaquetesPorArea({
    filtroArea = '',
    page = 1,
    pageSize = 10,
    sortBy = 'Area',
    sortDir = 'ASC',
  } = {}) {
    const params = {
      page,
      pageSize,
      sortBy,
      sortDir,
    };
    if (filtroArea && filtroArea.trim() !== '') {
      params.filtroArea = filtroArea.trim();
    }

    const response = await axiosClient.get('/reportes/paquetes-por-area', { params });
    return response.data;
  },

  /**
   * Obtiene el reporte de consultores con mayor facturación estimada mensual.
   * @param {object} params
   * @param {string} [params.filtroArea]
   * @param {number} [params.page=1]
   * @param {number} [params.pageSize=10]
   * @param {string} [params.sortBy='FacturacionEstimada']
   * @param {string} [params.sortDir='DESC']
   */
  async getConsultoresTopFacturacion({
    filtroArea = '',
    page = 1,
    pageSize = 10,
    sortBy = 'FacturacionEstimada',
    sortDir = 'DESC',
  } = {}) {
    const params = {
      page,
      pageSize,
      sortBy,
      sortDir,
    };
    if (filtroArea && filtroArea.trim() !== '') {
      params.filtroArea = filtroArea.trim();
    }

    const response = await axiosClient.get('/reportes/consultores-top-facturacion', { params });
    return response.data;
  },
};

export default reporteService;
