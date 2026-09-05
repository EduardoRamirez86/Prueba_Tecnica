import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RefreshCw,
  Award,
  Briefcase,
} from 'lucide-react';
import reporteService from '../api/reporteService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TableSkeleton, CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { toastError } from '../components/feedback/alerts';
import { clsx } from 'clsx';

export const Reportes = () => {
  const [activeTab, setActiveTab] = useState('paquetes'); // 'paquetes' | 'consultores'

  // ==========================================
  // ESTADOS - TAB 1: PAQUETES POR ÁREA
  // ==========================================
  const [paquetesData, setPaquetesData] = useState([]);
  const [paquetesLoading, setPaquetesLoading] = useState(true);
  const [paquetesPagination, setPaquetesPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [paquetesSort, setPaquetesSort] = useState({
    sortBy: 'Area',
    sortDir: 'ASC',
  });
  const [filtroAreaPaquetes, setFiltroAreaPaquetes] = useState('');

  // ==========================================
  // ESTADOS - TAB 2: TOP FACTURACIÓN
  // ==========================================
  const [consultoresData, setConsultoresData] = useState([]);
  const [consultoresLoading, setConsultoresLoading] = useState(true);
  const [consultoresPagination, setConsultoresPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [consultoresSort, setConsultoresSort] = useState({
    sortBy: 'FacturacionEstimada',
    sortDir: 'DESC',
  });
  const [filtroAreaConsultores, setFiltroAreaConsultores] = useState('');

  // ==========================================
  // FETCH - TAB 1: PAQUETES POR ÁREA
  // ==========================================
  const fetchPaquetesPorArea = useCallback(async () => {
    try {
      setPaquetesLoading(true);
      const res = await reporteService.getPaquetesPorArea({
        filtroArea: filtroAreaPaquetes,
        page: paquetesPagination.page,
        pageSize: paquetesPagination.pageSize,
        sortBy: paquetesSort.sortBy,
        sortDir: paquetesSort.sortDir,
      });

      setPaquetesData(Array.isArray(res.data) ? res.data : []);
      setPaquetesPagination((prev) => ({
        ...prev,
        totalCount: res.totalCount ?? 0,
        totalPages: res.totalPages ?? 1,
      }));
    } catch (err) {
      console.error('Error al cargar reporte de paquetes:', err);
      toastError('No se pudo cargar el reporte de paquetes.');
    } finally {
      setPaquetesLoading(false);
    }
  }, [
    filtroAreaPaquetes,
    paquetesPagination.page,
    paquetesPagination.pageSize,
    paquetesSort.sortBy,
    paquetesSort.sortDir,
  ]);

  useEffect(() => {
    if (activeTab === 'paquetes') {
      fetchPaquetesPorArea();
    }
  }, [fetchPaquetesPorArea, activeTab]);

  // Manejo de ordenamiento Tab 1
  const handleSortPaquetes = (column) => {
    setPaquetesSort((prev) => {
      if (prev.sortBy === column) {
        return {
          sortBy: column,
          sortDir: prev.sortDir === 'ASC' ? 'DESC' : 'ASC',
        };
      }
      return {
        sortBy: column,
        sortDir: 'ASC',
      };
    });
    setPaquetesPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ==========================================
  // FETCH - TAB 2: CONSULTOR TOP FACTURACIÓN
  // ==========================================
  const fetchConsultoresTop = useCallback(async () => {
    try {
      setConsultoresLoading(true);
      const res = await reporteService.getConsultoresTopFacturacion({
        filtroArea: filtroAreaConsultores,
        page: consultoresPagination.page,
        pageSize: consultoresPagination.pageSize,
        sortBy: consultoresSort.sortBy,
        sortDir: consultoresSort.sortDir,
      });

      setConsultoresData(Array.isArray(res.data) ? res.data : []);
      setConsultoresPagination((prev) => ({
        ...prev,
        totalCount: res.totalCount ?? 0,
        totalPages: res.totalPages ?? 1,
      }));
    } catch (err) {
      console.error('Error al cargar reporte de consultores:', err);
      toastError('No se pudo cargar el reporte de consultores.');
    } finally {
      setConsultoresLoading(false);
    }
  }, [
    filtroAreaConsultores,
    consultoresPagination.page,
    consultoresPagination.pageSize,
    consultoresSort.sortBy,
    consultoresSort.sortDir,
  ]);

  useEffect(() => {
    if (activeTab === 'consultores') {
      fetchConsultoresTop();
    }
  }, [fetchConsultoresTop, activeTab]);

  // Manejo de ordenamiento Tab 2
  const handleSortConsultores = (column) => {
    setConsultoresSort((prev) => {
      if (prev.sortBy === column) {
        return {
          sortBy: column,
          sortDir: prev.sortDir === 'DESC' ? 'ASC' : 'DESC',
        };
      }
      return {
        sortBy: column,
        sortDir: 'DESC',
      };
    });
    setConsultoresPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Cálculos de KPIs consolidados para la Pestaña 1
  const kpis = paquetesData.reduce(
    (acc, cur) => {
      acc.totalPaquetes += cur.cantidadPaquetes || 0;
      acc.valorTotal += Number(cur.valorTotalEconomico) || 0;
      return acc;
    },
    { totalPaquetes: 0, valorTotal: 0 }
  );
  const promedioGeneral =
    kpis.totalPaquetes > 0 ? kpis.valorTotal / kpis.totalPaquetes : 0;

  // Facturación máxima para escala de barra relativa en Tab 2
  const maxFacturacion =
    consultoresData.length > 0
      ? Math.max(...consultoresData.map((c) => Number(c.facturacionEstimada) || 0))
      : 1;

  // Componente de flecha de ordenamiento
  const renderSortIcon = (currentSort, column) => {
    if (currentSort.sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline" />;
    }
    return currentSort.sortDir === 'ASC' ? (
      <ArrowUp className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pestañas Responsivo (Segmented Control B2B) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex rounded-lg bg-slate-200/60 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('paquetes')}
            className={clsx(
              'inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all flex-1 sm:flex-initial',
              activeTab === 'paquetes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Paquetes por Área</span>
          </button>

          <button
            onClick={() => setActiveTab('consultores')}
            className={clsx(
              'inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all flex-1 sm:flex-initial',
              activeTab === 'consultores'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Top Facturación</span>
          </button>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={activeTab === 'paquetes' ? fetchPaquetesPorArea : fetchConsultoresTop}
          disabled={activeTab === 'paquetes' ? paquetesLoading : consultoresLoading}
          className="self-end sm:self-auto w-full sm:w-auto"
        >
          Refrescar Datos
        </Button>
      </div>

      {/* ========================================================= */}
      {/* CONTENIDO PESTAÑA 1: PAQUETES POR ÁREA                    */}
      {/* ========================================================= */}
      {activeTab === 'paquetes' && (
        <div className="space-y-6">
          {/* Tarjetas KPI Superiores */}
          {paquetesLoading && paquetesData.length === 0 ? (
            <CardSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* KPI 1 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Paquetes Ofertados
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {formatNumber(kpis.totalPaquetes)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  En {paquetesData.length} áreas activas visualizadas
                </span>
              </div>

              {/* KPI 2 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Valor Total Económico
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(kpis.valorTotal)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Valoración total en catálogo
                </span>
              </div>

              {/* KPI 3 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Precio Promedio por Paquete
                  </span>
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(promedioGeneral)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Media ponderada por servicio
                </span>
              </div>
            </div>
          )}

          {/* Filtro en Servidor Responsivo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Filtrar por área tecnológica..."
                icon={Search}
                value={filtroAreaPaquetes}
                onChange={(e) => {
                  setFiltroAreaPaquetes(e.target.value);
                  setPaquetesPagination((prev) => ({ ...prev, page: 1 }));
                }}
              />
            </div>

            {/* Selector de registros por página con ancho corregido min-w-[130px] pr-8 */}
            <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
              <span className="shrink-0">Mostrar:</span>
              <select
                value={paquetesPagination.pageSize}
                onChange={(e) => {
                  setPaquetesPagination((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 1,
                  }));
                }}
                className="min-w-[130px] pr-8 rounded-lg border-slate-300 py-1.5 px-3 text-xs text-slate-700 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
              >
                <option value={5}>5 por pág.</option>
                <option value={10}>10 por pág.</option>
                <option value={20}>20 por pág.</option>
              </select>
            </div>
          </div>

          {/* Tabla Paginada en Servidor con scroll horizontal fluido */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden w-full min-w-0">
            {paquetesLoading ? (
              <div className="p-4">
                <TableSkeleton rows={4} cols={4} />
              </div>
            ) : paquetesData.length === 0 ? (
              <EmptyState
                title="No hay resultados en el reporte"
                description={
                  filtroAreaPaquetes
                    ? `No se encontraron paquetes para el área "${filtroAreaPaquetes}".`
                    : 'No hay datos suficientes para generar el reporte de paquetes.'
                }
              />
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                        onClick={() => handleSortPaquetes('Area')}
                      >
                        Área Tecnológica {renderSortIcon(paquetesSort, 'Area')}
                      </th>
                      <th
                        className="py-3.5 px-6 text-center cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                        onClick={() => handleSortPaquetes('CantidadPaquetes')}
                      >
                        Cantidad Paquetes {renderSortIcon(paquetesSort, 'CantidadPaquetes')}
                      </th>
                      <th
                        className="py-3.5 px-6 text-right cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                        onClick={() => handleSortPaquetes('ValorTotalEconomico')}
                      >
                        Valor Total Económico {renderSortIcon(paquetesSort, 'ValorTotalEconomico')}
                      </th>
                      <th
                        className="py-3.5 px-6 text-right cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                        onClick={() => handleSortPaquetes('PrecioPromedio')}
                      >
                        Precio Promedio {renderSortIcon(paquetesSort, 'PrecioPromedio')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paquetesData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-medium text-slate-900">
                          {row.area}
                        </td>
                        <td className="py-3.5 px-6 text-center font-semibold text-slate-700">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs bg-slate-100">
                            {row.cantidadPaquetes}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-slate-900">
                          {formatCurrency(row.valorTotalEconomico)}
                        </td>
                        <td className="py-3.5 px-6 text-right font-semibold text-emerald-700">
                          {formatCurrency(row.precioPromedio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación Server-Side Responsiva */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
              <span>
                Página <strong className="text-slate-900">{paquetesPagination.page}</strong> de{' '}
                <strong className="text-slate-900">{paquetesPagination.totalPages}</strong> (Total:{' '}
                {paquetesPagination.totalCount} registros)
              </span>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={paquetesPagination.page <= 1 || paquetesLoading}
                  onClick={() =>
                    setPaquetesPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  className="flex-1 sm:flex-initial"
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={
                    paquetesPagination.page >= paquetesPagination.totalPages ||
                    paquetesLoading
                  }
                  onClick={() =>
                    setPaquetesPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                  className="flex-1 sm:flex-initial"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTENIDO PESTAÑA 2: TOP FACTURACIÓN                      */}
      {/* ========================================================= */}
      {activeTab === 'consultores' && (
        <div className="space-y-6">
          {/* Filtro en Servidor Responsivo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Filtrar por especialidad..."
                icon={Search}
                value={filtroAreaConsultores}
                onChange={(e) => {
                  setFiltroAreaConsultores(e.target.value);
                  setConsultoresPagination((prev) => ({ ...prev, page: 1 }));
                }}
              />
            </div>

            {/* Selector con ancho corregido min-w-[130px] pr-8 */}
            <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
              <span className="shrink-0">Mostrar:</span>
              <select
                value={consultoresPagination.pageSize}
                onChange={(e) => {
                  setConsultoresPagination((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 1,
                  }));
                }}
                className="min-w-[130px] pr-8 rounded-lg border-slate-300 py-1.5 px-3 text-xs text-slate-700 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
              >
                <option value={5}>5 por pág.</option>
                <option value={10}>10 por pág.</option>
                <option value={20}>20 por pág.</option>
              </select>
            </div>
          </div>

          {/* Tabla con Barras de Progreso Visuales con scroll horizontal fluido */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden w-full min-w-0">
            {consultoresLoading ? (
              <div className="p-4">
                <TableSkeleton rows={5} cols={5} />
              </div>
            ) : consultoresData.length === 0 ? (
              <EmptyState
                title="No se encontraron métricas de consultores"
                description={
                  filtroAreaConsultores
                    ? `No hay consultores registrados para "${filtroAreaConsultores}".`
                    : 'Aún no se dispone de datos de facturación acumulada.'
                }
              />
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Ranking & Consultor</th>
                      <th className="py-3.5 px-6">Área</th>
                      <th className="py-3.5 px-6 text-right">Tarifa / Hora</th>
                      <th className="py-3.5 px-6 text-center">Proyectos Activos</th>
                      <th
                        className="py-3.5 px-6 text-right min-w-[220px] cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                        onClick={() => handleSortConsultores('FacturacionEstimada')}
                      >
                        Facturación Estimada Mensual {renderSortIcon(consultoresSort, 'FacturacionEstimada')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {consultoresData.map((c, idx) => {
                      const facturacion = Number(c.facturacionEstimada) || 0;
                      const percentage =
                        maxFacturacion > 0
                          ? Math.round((facturacion / maxFacturacion) * 100)
                          : 0;

                      return (
                        <tr
                          key={c.id || idx}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Ranking y Consultor */}
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <span
                                className={clsx(
                                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                                  idx === 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : idx === 1
                                    ? 'bg-slate-200 text-slate-800'
                                    : idx === 2
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'text-slate-400 font-normal'
                                )}
                              >
                                {idx === 0 ? (
                                  <Award className="w-3.5 h-3.5 text-amber-600" />
                                ) : (
                                  idx + 1
                                )}
                              </span>

                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {c.nombreCompleto}
                                </span>
                                <span className="text-xs text-slate-400 block">
                                  {c.emailCorporativo}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Área */}
                          <td className="py-3.5 px-6">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                              <Briefcase className="w-3 h-3 text-slate-400" />
                              {c.areaEspecializacion}
                            </span>
                          </td>

                          {/* Tarifa / Hora */}
                          <td className="py-3.5 px-6 text-right font-medium text-slate-800">
                            {formatCurrency(c.tarifaHora)}
                            <span className="text-xs text-slate-400 font-normal"> /h</span>
                          </td>

                          {/* Proyectos */}
                          <td className="py-3.5 px-6 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                              {c.cantidadProyectosActivos ?? 0}
                            </span>
                          </td>

                          {/* Facturación con Barra de Progreso */}
                          <td className="py-3.5 px-6 text-right">
                            <div className="font-bold text-slate-900 text-sm">
                              {formatCurrency(facturacion)}
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                              <div
                                className="bg-slate-900 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(5, percentage)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación Server-Side Tab 2 Responsiva */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
              <span>
                Página <strong className="text-slate-900">{consultoresPagination.page}</strong> de{' '}
                <strong className="text-slate-900">{consultoresPagination.totalPages}</strong> (Total:{' '}
                {consultoresPagination.totalCount} registros)
              </span>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={consultoresPagination.page <= 1 || consultoresLoading}
                  onClick={() =>
                    setConsultoresPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  className="flex-1 sm:flex-initial"
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={
                    consultoresPagination.page >= consultoresPagination.totalPages ||
                    consultoresLoading
                  }
                  onClick={() =>
                    setConsultoresPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                  className="flex-1 sm:flex-initial"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
