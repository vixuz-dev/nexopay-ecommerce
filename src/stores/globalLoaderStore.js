import { create } from 'zustand';

const DEFAULT_MESSAGE = 'Cargando…';

/**
 * Loader global de pantalla completa: visibilidad y mensaje configurable.
 */
const useGlobalLoaderStore = create((set) => ({
  visible: false,
  message: DEFAULT_MESSAGE,

  /**
   * Muestra el overlay. Si `text` es un string no vacío, actualiza el mensaje; si no, usa el predeterminado.
   * @param {string} [text]
   */
  show: (text) => {
    const message =
      typeof text === 'string' && text.trim() !== ''
        ? text.trim()
        : DEFAULT_MESSAGE;
    set({ visible: true, message });
  },

  /** Oculta el overlay. */
  hide: () => set({ visible: false }),

  /**
   * Cambia el texto debajo del GIF sin mostrar u ocultar.
   * @param {string} text
   */
  setMessage: (text) => {
    if (typeof text !== 'string' || text.trim() === '') return;
    set({ message: text.trim() });
  },
}));

export default useGlobalLoaderStore;
