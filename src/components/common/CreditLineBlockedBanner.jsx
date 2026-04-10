import { HiOutlineLockClosed } from 'react-icons/hi2';
import useUserStore from '../../stores/userStore';
import { isCreditLineBlocked } from '../../utils/creditLinePurchaseAccess';

/**
 * Aviso global cuando la línea de crédito está aprobada pero bloqueada (`creditStatus: false`).
 */
const CreditLineBlockedBanner = () => {
  const user = useUserStore((state) => state.user);

  if (!user || !isCreditLineBlocked(user)) {
    return null;
  }

  return (
    <div className="bg-primary-50 border-b border-primary-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-start gap-2 md:gap-3">
          <HiOutlineLockClosed className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm lg:text-base text-neutral-800 leading-relaxed">
            <span className="font-semibold">Tu línea de crédito ha sido bloqueada.</span>{' '}
            No podrás realizar compras ni movimientos con crédito hasta que se regularice tu
            cuenta. Si consideras que es un error, contacta directamente al equipo de NexoPay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditLineBlockedBanner;
