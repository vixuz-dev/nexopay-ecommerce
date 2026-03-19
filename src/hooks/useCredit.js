import { useMemo } from 'react';
import useProfileStore from '../stores/profileStore';

const mapProfileToCreditInfo = (creditLineInfo) => {
  if (!creditLineInfo || !creditLineInfo.has_line_credit) return null;
  return {
    creditLimit: creditLineInfo.limit_credit_amount ?? 0,
    creditUsed: creditLineInfo.credit_used ?? 0,
    creditAvailable: creditLineInfo.remaining_credit_amount ?? 0,
    currentBalance: creditLineInfo.credit_used ?? 0,
    usagePercentage: creditLineInfo.usage_percentage ?? 0,
    cutOffDate: creditLineInfo.next_cutoff_date ?? '—',
    paymentDueDate: creditLineInfo.next_payment_date ?? '—',
    minimumPayment: Number(creditLineInfo.minimum_payment) || 0,
    daysUntilCutoff: creditLineInfo.days_until_cutoff ?? null,
  };
};

export const useCredit = () => {
  const profileInformation = useProfileStore((state) => state.profileInformation);
  const isProfileLoaded = useProfileStore((state) => state.isProfileLoaded);
  const creditLineInfo = profileInformation?.credit_line_information;

  const creditInfo = useMemo(() => mapProfileToCreditInfo(creditLineInfo), [creditLineInfo]);
  const loading = !profileInformation && !isProfileLoaded;

  return { creditInfo, loading };
};

