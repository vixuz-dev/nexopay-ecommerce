import { useEffect, useMemo, useState } from 'react';
import useCreditStore from '../stores/creditStore';
import useProfileStore from '../stores/profileStore';
import { getDaysUntil, parseCreditLineLimitAmount } from '../utils/creditUtils';
import { isApprovedCreditLineStatus } from '../utils/emailVerification';

/**
 * Si el backend no manda `days_until_cutoff` pero sí fecha de corte, calcula días en el cliente.
 * @param {Record<string, unknown>} info
 */
const withDerivedCutoffFields = (info) => {
  if (!info || typeof info !== 'object') return info;
  let days = info.daysUntilCutoff;
  const cut = info.cutOffDate;
  if (
    (days == null || Number.isNaN(Number(days))) &&
    cut &&
    typeof cut === 'string' &&
    cut !== '—'
  ) {
    const parsed = new Date(cut);
    if (!Number.isNaN(parsed.getTime())) {
      days = getDaysUntil(cut);
    }
  }
  return { ...info, daysUntilCutoff: days != null && !Number.isNaN(Number(days)) ? Number(days) : null };
};

const mapCreditLineApiToCreditInfo = (data) => {
  if (!data) return null;
  const limit = parseCreditLineLimitAmount(data);
  return {
    creditLimit: limit ?? 0,
    creditUsed: Number(data.credit_used ?? data.creditUsed ?? 0) || 0,
    creditAvailable: Number(data.remaining_credit_amount ?? data.remainingCreditAmount ?? 0) || 0,
    currentBalance: Number(data.credit_used ?? data.creditUsed ?? 0) || 0,
    usagePercentage: Number(data.usage_percentage ?? data.usagePercentage ?? 0) || 0,
    cutOffDate: data.next_cutoff_date ?? data.nextCutoffDate ?? '—',
    paymentDueDate: data.next_payment_date ?? data.nextPaymentDate ?? '—',
    minimumPayment: Number(data.minimum_payment ?? data.minimumPayment) || 0,
    daysUntilCutoff: data.days_until_cutoff ?? data.daysUntilCutoff ?? null,
  };
};

/**
 * Enriquece datos de get_credit_line con campos del perfil si existen (sin usar has_line_credit).
 * @param {Record<string, unknown>} apiMapped
 * @param {Record<string, unknown>|null|undefined} profileLine
 */
const mergeCreditLineWithProfile = (apiMapped, profileLine) => {
  if (!profileLine || typeof profileLine !== 'object') return apiMapped;
  const p = profileLine;
  const pLimit =
    parseCreditLineLimitAmount(p) ??
    (p.limit_credit_amount != null && !Number.isNaN(Number(p.limit_credit_amount))
      ? Number(p.limit_credit_amount)
      : null);
  const useProfileLimit = !apiMapped.creditLimit && pLimit != null && pLimit > 0;
  return {
    ...apiMapped,
    creditLimit: useProfileLimit ? pLimit : apiMapped.creditLimit || pLimit || 0,
    creditUsed: apiMapped.creditUsed || Number(p.credit_used) || 0,
    creditAvailable: apiMapped.creditAvailable || Number(p.remaining_credit_amount) || 0,
    currentBalance: apiMapped.currentBalance || Number(p.credit_used) || 0,
    usagePercentage: apiMapped.usagePercentage || Number(p.usage_percentage) || 0,
    cutOffDate:
      apiMapped.cutOffDate && apiMapped.cutOffDate !== '—'
        ? apiMapped.cutOffDate
        : (p.next_cutoff_date ?? '—'),
    paymentDueDate:
      apiMapped.paymentDueDate && apiMapped.paymentDueDate !== '—'
        ? apiMapped.paymentDueDate
        : (p.next_payment_date ?? '—'),
    minimumPayment: apiMapped.minimumPayment || Number(p.minimum_payment) || 0,
    daysUntilCutoff: apiMapped.daysUntilCutoff ?? p.days_until_cutoff ?? null,
  };
};

/**
 * @param {Record<string, unknown>|null|undefined} profileLine
 */
const creditInfoFromProfileOnly = (profileLine) => {
  if (!profileLine || typeof profileLine !== 'object') return null;
  const limit =
    parseCreditLineLimitAmount(profileLine) ??
    (profileLine.limit_credit_amount != null ? Number(profileLine.limit_credit_amount) : 0);
  const hasAny =
    (limit != null && limit > 0) ||
    (profileLine.credit_used != null && Number(profileLine.credit_used) > 0) ||
    (profileLine.next_cutoff_date != null && String(profileLine.next_cutoff_date).trim() !== '');
  if (!hasAny) return null;
  return {
    creditLimit: limit || 0,
    creditUsed: Number(profileLine.credit_used) || 0,
    creditAvailable: Number(profileLine.remaining_credit_amount) || 0,
    currentBalance: Number(profileLine.credit_used) || 0,
    usagePercentage: Number(profileLine.usage_percentage) || 0,
    cutOffDate: profileLine.next_cutoff_date ?? '—',
    paymentDueDate: profileLine.next_payment_date ?? '—',
    minimumPayment: Number(profileLine.minimum_payment) || 0,
    daysUntilCutoff: profileLine.days_until_cutoff ?? null,
  };
};

export const useCredit = () => {
  const showButton = useCreditStore((s) => s.showButton);
  const requestStatus = useCreditStore((s) => s.requestStatus);
  const isStatusLoaded = useCreditStore((s) => s.isStatusLoaded);
  const creditLine = useCreditStore((s) => s.creditLine);
  const fetchCreditLine = useCreditStore((s) => s.fetchCreditLine);
  const profileLine = useProfileStore((s) => s.profileInformation?.credit_line_information);

  const approved = isStatusLoaded && isApprovedCreditLineStatus(showButton, requestStatus);

  const [lineFetchDone, setLineFetchDone] = useState(false);

  useEffect(() => {
    if (!approved) {
      setLineFetchDone(false);
      return;
    }
    if (creditLine != null) {
      setLineFetchDone(true);
      return;
    }
    setLineFetchDone(false);
    let cancelled = false;
    fetchCreditLine()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLineFetchDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [approved, creditLine, fetchCreditLine]);

  const creditInfo = useMemo(() => {
    if (!approved) return null;
    const apiMapped = creditLine ? mapCreditLineApiToCreditInfo(creditLine) : null;
    let merged;
    if (apiMapped) {
      merged = mergeCreditLineWithProfile(apiMapped, profileLine);
    } else {
      merged = creditInfoFromProfileOnly(profileLine);
    }
    return merged ? withDerivedCutoffFields(merged) : null;
  }, [approved, creditLine, profileLine]);

  const loading = !isStatusLoaded || (approved && !lineFetchDone);

  return { creditInfo, loading };
};
