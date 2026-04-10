import useGlobalLoaderStore from '../../stores/globalLoaderStore';
import moneyGif from '../../assets/images/loaders/money.gif';

const AUTH_BOOTSTRAP_MESSAGE = 'Cargando…';

/**
 * Overlay de carga global: GIF centrado y mensaje desde Zustand (o modo arranque de sesión).
 * @param {{ forceVisible?: boolean }} props — Si es true, se muestra aunque el store esté oculto (p. ej. auth init).
 */
// eslint-disable-next-line react/prop-types -- props documentados con JSDoc
const GlobalLoader = ({ forceVisible = false }) => {
  const storeVisible = useGlobalLoaderStore((s) => s.visible);
  const storeMessage = useGlobalLoaderStore((s) => s.message);
  const isOpen = storeVisible || forceVisible;
  const message =
    storeVisible ? storeMessage : forceVisible ? AUTH_BOOTSTRAP_MESSAGE : storeMessage;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-4 bg-white/75 backdrop-blur-sm"
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <img
        src={moneyGif}
        alt=""
        className="h-28 w-auto max-w-[min(200px,80vw)] object-contain"
        width={200}
        height={112}
        decoding="async"
      />
      <p className="max-w-xs text-center text-sm font-medium text-neutral-700">{message}</p>
    </div>
  );
};

export default GlobalLoader;
