import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, Layers, DollarSign } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import paqueteService from '../api/paqueteService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TableSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatters';
import { toastSuccess, toastError, confirmDestructive } from '../components/feedback/alerts';

const initialFormData = {
  id: null,
  nombre: '',
  descripcion: '',
  area: '',
  precio: '',
  activo: true,
};

export const Paquetes = () => {
  const { isAdmin } = useAuth();

  const [paquetes, setPaquetes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga inicial
  const cargarPaquetes = async () => {
    try {
      setIsLoading(true);
      const data = await paqueteService.listar();
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener paquetes:', err);
      toastError('No se pudo cargar el catálogo de paquetes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarPaquetes();
  }, []);

  // Filtrado reactivo en cliente
  const filteredPaquetes = useMemo(() => {
    if (!searchTerm.trim()) return paquetes;
    const term = searchTerm.toLowerCase();
    return paquetes.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term) ||
        p.area?.toLowerCase().includes(term)
    );
  }, [paquetes, searchTerm]);

  // Paginación en cliente
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredPaquetes.length / pageSize));
  
  const paginatedPaquetes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPaquetes.slice(startIndex, startIndex + pageSize);
  }, [filteredPaquetes, currentPage]);

  // Modal Crear
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Modal Editar
  const handleOpenEditModal = (paquete) => {
    setModalMode('edit');
    setFormData({
      id: paquete.id,
      nombre: paquete.nombre || '',
      descripcion: paquete.descripcion || '',
      area: paquete.area || '',
      precio: paquete.precio || '',
      activo: paquete.activo !== undefined ? paquete.activo : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validación local del formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del paquete es obligatorio.';
    }
    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es obligatoria.';
    }
    if (!formData.area.trim()) {
      errors.area = 'El área tecnológica es requerida.';
    }
    if (!formData.precio || Number(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser un número positivo mayor a 0.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar (Crear / Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (modalMode === 'create') {
        await paqueteService.crear(formData);
        toastSuccess('Paquete creado exitosamente.');
      } else {
        await paqueteService.actualizar(formData.id, formData);
        toastSuccess('Paquete actualizado correctamente.');
      }
      setIsModalOpen(false);
      await cargarPaquetes();
    } catch (err) {
      console.error('Error al procesar paquete:', err);
      const apiErrors = err.validationErrors || [err.response?.data?.message || 'Error al procesar el paquete.'];
      toastError(apiErrors.join('. '));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminación lógica (Soft Delete)
  const handleDelete = async (paquete) => {
    const confirmed = await confirmDestructive({
      title: '¿Desactivar paquete de consultoría?',
      text: `¿Estás seguro de dar de baja el paquete "${paquete.nombre}"?`,
      confirmButtonText: 'Sí, desactivar',
    });

    if (!confirmed) return;

    try {
      await paqueteService.eliminar(paquete.id);
      toastSuccess('Paquete desactivado correctamente.');
      await cargarPaquetes();
    } catch (err) {
      console.error('Error al desactivar paquete:', err);
      toastError('No se pudo desactivar el paquete.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Controles y Búsqueda Responsiva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar paquete por nombre, área o descripción..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={cargarPaquetes}
            disabled={isLoading}
            title="Refrescar lista"
            className="flex-1 sm:flex-initial"
          >
            Actualizar
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenCreateModal}
              className="flex-1 sm:flex-initial"
            >
              Nuevo Paquete
            </Button>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla con scroll horizontal fluido */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden w-full min-w-0">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : filteredPaquetes.length === 0 ? (
          <EmptyState
            title="No se encontraron paquetes"
            description={
              searchTerm
                ? `No existen coincidencias para el término "${searchTerm}".`
                : 'Aún no se han configurado paquetes de consultoría en el catálogo.'
            }
            actionLabel={searchTerm ? 'Limpiar búsqueda' : isAdmin ? 'Crear Paquete' : undefined}
            onAction={searchTerm ? () => setSearchTerm('') : isAdmin ? handleOpenCreateModal : undefined}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Paquete</th>
                  <th className="py-3.5 px-6">Área</th>
                  <th className="py-3.5 px-6 text-right">Precio Estándar</th>
                  <th className="py-3.5 px-6 text-center">Estado</th>
                  {isAdmin && (
                    <th className="py-3.5 px-6 text-right">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedPaquetes.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Nombre y Descripción */}
                    <td className="py-3.5 px-6 max-w-sm">
                      <div className="font-medium text-slate-900 block">
                        {p.nombre}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2" title={p.descripcion}>
                        {p.descripcion}
                      </p>
                    </td>

                    {/* Área */}
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {p.area}
                      </span>
                    </td>

                    {/* Precio */}
                    <td className="py-3.5 px-6 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {formatCurrency(p.precio)}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <Badge variant={p.activo ? 'active' : 'inactive'} dot>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>

                    {/* Acciones RBAC (Solo Admin) */}
                    {isAdmin && (
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            title="Editar paquete"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            title="Desactivar paquete"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación Cliente */}
        {!isLoading && filteredPaquetes.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <span>
              Página <strong className="text-slate-900">{currentPage}</strong> de{' '}
              <strong className="text-slate-900">{totalPages}</strong> (Total:{' '}
              {filteredPaquetes.length} registros)
            </span>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex-1 sm:flex-initial"
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex-1 sm:flex-initial"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Unificado Crear / Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Crear Paquete de Consultoría' : 'Modificar Paquete'}
        description={
          modalMode === 'create'
            ? 'Define los alcances y valor comercial del paquete de servicios.'
            : 'Actualiza los términos comerciales y descripción del paquete.'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Paquete"
            id="nombre"
            name="nombre"
            required
            placeholder="Ej: Auditoría de Ciberseguridad"
            value={formData.nombre}
            error={formErrors.nombre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nombre: e.target.value }))
            }
          />

          <div>
            <label
              htmlFor="descripcion"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Descripción de Alcance <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 hover:border-slate-400 transition-colors"
              placeholder="Detalla las actividades, entregables y objetivos del servicio..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
              }
            />
            {formErrors.descripcion && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="area"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Área Tecnológica <span className="text-rose-500">*</span>
              </label>
              <select
                id="area"
                name="area"
                required
                className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 hover:border-slate-400 transition-colors bg-white"
                value={formData.area}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, area: e.target.value }))
                }
              >
                <option value="">Selecciona un área...</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Arquitectura Software">Arquitectura Software</option>
                <option value="DevOps">DevOps</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Estrategia">Estrategia</option>
              </select>
              {formErrors.area && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.area}</p>
              )}
            </div>

            <Input
              label="Precio Comercial (USD)"
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              min="500"
              max="15000"
              required
              helperText="Rango: $500 - $15,000 USD"
              placeholder="Ej: 3500.00"
              icon={DollarSign}
              value={formData.precio}
              error={formErrors.precio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, precio: e.target.value }))
              }
            />
          </div>

          {/* Toggle Activo (Solo en edición) */}
          {modalMode === 'edit' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Disponibilidad en Catálogo
                </span>
                <span className="text-xs text-slate-500">
                  Los paquetes inactivos no se ofertan a nuevos clientes
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, activo: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isSubmitting={isSubmitting}
            >
              {modalMode === 'create' ? 'Crear Paquete' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Paquetes;
