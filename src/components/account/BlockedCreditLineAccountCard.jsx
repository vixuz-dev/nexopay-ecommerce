import { useEffect, useMemo } from 'react';
import { HiOutlineCreditCard, HiOutlinePhone } from 'react-icons/hi2';
import useUserStore from '../../stores/userStore';
import useCreditStore from '../../stores/creditStore';
import useProfileStore from '../../stores/profileStore';
import { APP_CONFIG } from '../../constants/app';
import { isCreditLineBlocked } from '../../utils/creditLinePurchaseAccess';
import { formatPrice, calculateCreditUsage, parseCreditLineLimitAmount } from '../../utils/creditUtils';

const supportMailto = `mailto:${APP_CONFIG.SUPPORT_EMAIL}?subject=${encodeURIComponent('Línea de crédito bloqueada')}`;

/**
 * Tarjeta de estado “crédito bloqueado” en cuenta (misma regla que `isCreditLineBlocked`).
 */
const BlockedCreditLineAccountCard = () => {
  const user = useUserStore((s) => s.user);
  const creditLine = useCreditStore((s) => s.creditLine);
  const fetchCreditLine = useCreditStore((s) => s.fetchCreditLine);
  const profileLine = useProfileStore((s) => s.profileInformation?.credit_line_information);

  useEffect(() => {
    if (!user || !isCreditLineBlocked(user)) return;
    void fetchCreditLine().catch(() => {});
  }, [user, fetchCreditLine]);

  const { creditLimit, creditUsed, usagePercentage } = useMemo(() => {
    const fromApi = creditLine && typeof creditLine === 'object' ? creditLine : null;
    const limitRaw =
      parseCreditLineLimitAmount(fromApi) ??
      parseCreditLineLimitAmount(profileLine) ??
      (user?.limitCreditAmount != null ? Number(user.limitCreditAmount) : null);
    const limit = limitRaw != null && !Number.isNaN(limitRaw) ? Math.max(0, limitRaw) : 0;
    const usedRaw =
      Number(fromApi?.credit_used ?? fromApi?.creditUsed ?? profileLine?.credit_used ?? 0) || 0;
    const used = Math.max(0, usedRaw);
    const pct =
      limit > 0
        ? Math.min(100, Number(calculateCreditUsage(used, limit)))
        : 0;
    return { creditLimit: limit, creditUsed: used, usagePercentage: pct };
  }, [creditLine, profileLine, user]);

  if (!user || !isCreditLineBlocked(user)) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-xl p-6 md:p-8 text-white">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-white/90 text-sm font-medium mb-1">Línea de Crédito NexoPay</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">Crédito bloqueado</h2>
        </div>
        <div className="p-3 bg-black/20 rounded-xl shrink-0" aria-hidden>
          <HiOutlineCreditCard className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
        <div className="bg-black/15 rounded-xl p-3 md:p-4">
          <p className="text-white/80 text-xs mb-1">Límite de Crédito</p>
          <p className="text-lg md:text-xl font-bold tabular-nums">{formatPrice(creditLimit)}</p>
        </div>
        <div className="bg-black/15 rounded-xl p-3 md:p-4">
          <p className="text-white/80 text-xs mb-1">Saldo usado</p>
          <p className="text-lg md:text-xl font-bold tabular-nums">{formatPrice(creditUsed)}</p>
        </div>
      </div>

      <p className="text-sm md:text-base text-white/95 leading-relaxed mb-4">
        Tu línea de crédito ha sido bloqueada por motivos de seguridad. Por favor, contacta a soporte
        para más información.
      </p>

      <div className="flex justify-center mb-2">
        <a
          href={supportMailto}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-neutral-900 shadow-md transition-colors hover:bg-neutral-100"
        >
          <HiOutlinePhone className="w-5 h-5 shrink-0" aria-hidden />
          Contactar soporte
        </a>
      </div>

      <div className="mt-6 pt-2">
        <div className="flex justify-between text-sm text-white/90 mb-2">
          <span>Uso de crédito</span>
          <span className="font-semibold tabular-nums">{usagePercentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-white/90 transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
            role="progressbar"
            aria-valuenow={usagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de uso de crédito"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockedCreditLineAccountCard;
