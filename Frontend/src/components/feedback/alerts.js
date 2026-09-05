import Swal from 'sweetalert2';

// Instancia base personalizada con tipografía y botones acordes al diseño Slate B2B
const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-xl border border-slate-200 bg-white shadow-xl text-slate-800 font-sans',
    title: 'text-lg font-semibold text-slate-900',
    htmlContainer: 'text-sm text-slate-600',
    confirmButton: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20 mr-2',
    cancelButton: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20',
  },
  buttonsStyling: false,
});

/**
 * Muestra notificación flotante discreta tipo Toast.
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-lg border border-slate-200 bg-white shadow-lg text-slate-800 text-sm font-sans',
  },
});

export const toastSuccess = (title) => {
  Toast.fire({
    icon: 'success',
    title,
  });
};

export const toastError = (title) => {
  Toast.fire({
    icon: 'error',
    title,
  });
};

export const toastWarning = (title) => {
  Toast.fire({
    icon: 'warning',
    title,
  });
};

export const showWarning = (title, text) => {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Entendido',
  });
};

export const showError = (title, text) => {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Aceptar',
  });
};

/**
 * Diálogo de confirmación para acciones destructivas (Soft Delete).
 */
export const confirmDestructive = async ({
  title = '¿Estás seguro?',
  text = 'Esta acción desactivará el registro en el sistema.',
  confirmButtonText = 'Sí, desactivar',
  cancelButtonText = 'Cancelar',
} = {}) => {
  const result = await customSwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: 'rounded-xl border border-slate-200 bg-white shadow-xl text-slate-800 font-sans',
      title: 'text-lg font-semibold text-slate-900',
      htmlContainer: 'text-sm text-slate-600',
      confirmButton: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 mr-2',
      cancelButton: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20',
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};
