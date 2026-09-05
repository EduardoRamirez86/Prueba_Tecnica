import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, Briefcase } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import consultorService from '../api/consultorService';
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
  nombreCompleto: '',
  emailCorporativo: '',
  areaEspecializacion: '',
  tarifaHora: '',
  cantidadProyectosActivos: 0,
  activo: true,
};

export const Consultores = () => {
  const { isAdmin } = useAuth();

  const [consultores, setConsultores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga inicial
  const cargarConsultores = async () => {
    try {
      setIsLoading(true);
      const data = await consultorService.listar();
      setConsultores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener lista de consultores:', err);
      toastError('No se pudo cargar la lista de consultores.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarConsultores();
  }, []);

  // Filtrado reactivo en memoria (cliente)
  const filteredConsultores = useMemo(() => {
    if (!searchTerm.trim()) return consultores;
    const term = searchTerm.toLowerCase();
    return consultores.filter(
      (c) =>
        c.nombreCompleto?.toLowerCase().includes(term) ||
        c.emailCorporativo?.toLowerCase().includes(term) ||
        c.areaEspecializacion?.toLowerCase().includes(term)
    );
  }, [consultores, searchTerm]);

  // Apertura de modal de creación
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Apertura de modal de edición
  const handleOpenEditModal = (consultor) => {
    setModalMode('edit');
    setFormData({
      id: consultor.id,
      nombreCompleto: consultor.nombreCompleto || '',
      emailCorporativo: consultor.emailCorporativo || '',
      areaEspecializacion: consultor.areaEspecializacion || '',
      tarifaHora: consultor.tarifaHora || '',
      cantidadProyectosActivos: consultor.cantidadProyectosActivos ?? 0,
      activo: consultor.activo !== undefined ? consultor.activo : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validación local rápida del formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.nombreCompleto.trim()) {
      errors.nombreCompleto = 'El nombre completo es requerido.';
    }
    if (!formData.emailCorporativo.trim()) {
      errors.emailCorporativo = 'El correo corporativo es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailCorporativo)) {
      errors.emailCorporativo = 'Formato de correo corporativo inválido.';
    }
    if (!formData.areaEspecializacion.trim()) {
      errors.areaEspecializacion = 'El área de especialización es requerida.';
    }
    if (!formData.tarifaHora || Number(formData.tarifaHora) <= 0) {
      errors.tarifaHora = 'La tarifa por hora debe ser un valor mayor a cero.';
    }
    const proyectos = Number(formData.cantidadProyectosActivos);
    if (isNaN(proyectos) || proyectos < 0 || proyectos > 5 || !Number.isInteger(proyectos)) {
      errors.cantidadProyectosActivos = 'La cantidad de proyectos activos debe ser un entero entre 0 y 5.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Envío del formulario (Crear / Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        cantidadProyectosActivos: Number(formData.cantidadProyectosActivos),
      };

      if (modalMode === 'create') {
        await consultorService.crear(payload);
        toastSuccess('Consultor creado exitosamente.');
      } else {
        await consultorService.actualizar(payload.id, payload);
        toastSuccess('Consultor actualizado correctamente.');
      }
      setIsModalOpen(false);
      await cargarConsultores();
    } catch (err) {
      console.error('Error al guardar consultor:', err);
      const apiErrors = err.validationErrors || [err.response?.data?.message || 'Error al guardar los datos.'];
      toastError(apiErrors.join('. '));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminación lógica (Soft Delete)
  const handleDelete = async (consultor) => {
    const confirmed = await confirmDestructive({
      title: '¿Desactivar consultor?',
      text: `¿Deseas dar de baja a "${consultor.nombreCompleto}"? El registro quedará inactivo.`,
      confirmButtonText: 'Sí, desactivar',
    });

    if (!confirmed) return;

    try {
      await consultorService.eliminar(consultor.id);
      toastSuccess('Consultor desactivado correctamente.');
      await cargarConsultores();
    } catch (err) {
      console.error('Error al desactivar consultor:', err);
      toastError('No se pudo desactivar el consultor.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones y Búsqueda Responsiva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar por nombre, correo o área..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={cargarConsultores}
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
              Nuevo Consultor
            </Button>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla con scroll horizontal fluido */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden w-full min-w-0">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : filteredConsultores.length === 0 ? (
          <EmptyState
            title="No se encontraron consultores"
            description={
              searchTerm
                ? `No hay resultados coincidentes con "${searchTerm}".`
                : 'Aún no se han registrado consultores activos en el sistema.'
            }
            actionLabel={searchTerm ? 'Limpiar búsqueda' : isAdmin ? 'Crear Consultor' : undefined}
            onAction={searchTerm ? () => setSearchTerm('') : isAdmin ? handleOpenCreateModal : undefined}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Consultor</th>
                  <th className="py-3.5 px-6">Área de Especialización</th>
                  <th className="py-3.5 px-6 text-right">Tarifa / Hora</th>
                  <th className="py-3.5 px-6 text-center">Proyectos Activos</th>
                  <th className="py-3.5 px-6 text-center">Estado</th>
                  {isAdmin && (
                    <th className="py-3.5 px-6 text-right">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredConsultores.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Nombre y Email */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                          {c.nombreCompleto?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">
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
                    <td className="py-3.5 px-6 text-right font-medium text-slate-900">
                      {formatCurrency(c.tarifaHora)}
                      <span className="text-xs text-slate-400 font-normal"> /h</span>
                    </td>

                    {/* Proyectos Activos */}
                    <td className="py-3.5 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                        {c.cantidadProyectosActivos ?? 0}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-6 text-center">
                      <Badge variant={c.activo ? 'active' : 'inactive'} dot>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>

                    {/* Acciones RBAC (Solo Admin) */}
                    {isAdmin && (
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            title="Editar consultor"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            title="Desactivar consultor"
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
      </div>

      {/* Modal Unificado de Crear / Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Registrar Nuevo Consultor' : 'Modificar Consultor'}
        description={
          modalMode === 'create'
            ? 'Completa los datos del profesional para incorporarlo al directorio activo.'
            : 'Actualiza los parámetros profesionales y operativos del consultor.'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            id="nombreCompleto"
            name="nombreCompleto"
            required
            placeholder="Ej: Sofia Lemus"
            value={formData.nombreCompleto}
            error={formErrors.nombreCompleto}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nombreCompleto: e.target.value }))
            }
          />

          <Input
            label="Correo Corporativo"
            id="emailCorporativo"
            name="emailCorporativo"
            type="email"
            required
            placeholder="ejemplo@consultoria.local"
            value={formData.emailCorporativo}
            error={formErrors.emailCorporativo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, emailCorporativo: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="areaEspecializacion"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Área de Especialización <span className="text-rose-500">*</span>
              </label>
              <select
                id="areaEspecializacion"
                name="areaEspecializacion"
                required
                className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 hover:border-slate-400 transition-colors bg-white"
                value={formData.areaEspecializacion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, areaEspecializacion: e.target.value }))
                }
              >
                <option value="">Selecciona un área...</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Arquitectura Software">Arquitectura Software</option>
                <option value="DevOps">DevOps</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Estrategia">Estrategia</option>
              </select>
              {formErrors.areaEspecializacion && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.areaEspecializacion}</p>
              )}
            </div>

            <Input
              label="Tarifa por Hora (USD)"
              id="tarifaHora"
              name="tarifaHora"
              type="number"
              step="0.01"
              min="30"
              max="200"
              required
              helperText="Rango: $30.00 - $200.00 USD/h"
              placeholder="Ej: 75.00"
              value={formData.tarifaHora}
              error={formErrors.tarifaHora}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tarifaHora: e.target.value }))
              }
            />

            <Input
              label="Proyectos Activos"
              id="cantidadProyectosActivos"
              name="cantidadProyectosActivos"
              type="number"
              step="1"
              min="0"
              max="5"
              required
              helperText="Rango: 0 - 5 proyectos activos"
              placeholder="Ej: 2"
              value={formData.cantidadProyectosActivos}
              error={formErrors.cantidadProyectosActivos}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cantidadProyectosActivos: e.target.value }))
              }
            />
          </div>

          {/* Estado Activo (solo en edición) */}
          {modalMode === 'edit' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Estado Operativo
                </span>
                <span className="text-xs text-slate-500">
                  Define si el consultor puede ser asignado a nuevos proyectos
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

          {/* Botones de acción del Modal */}
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
              {modalMode === 'create' ? 'Crear Consultor' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Consultores;
