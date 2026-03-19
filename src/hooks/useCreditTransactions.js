import { useMemo } from 'react';
import useProfileStore from '../stores/profileStore';

const mapMovementToTransaction = (movement) => {
  const isAbono = movement.type_movement === 'Abono';
  return {
    id: movement.credit_line_history_id ?? movement.id,
    date: movement.created_at ? new Date(movement.created_at.replace(' ', 'T')) : new Date(),
    description: movement.description ?? '',
    amount: isAbono ? -Math.abs(movement.amount ?? 0) : Math.abs(movement.amount ?? 0),
    type: isAbono ? 'payment' : 'purchase',
    status: 'completed',
  };
};

export const useCreditTransactions = (limit = 4) => {
  const profileInformation = useProfileStore((state) => state.profileInformation);
  const isProfileLoaded = useProfileStore((state) => state.isProfileLoaded);

  const transactions = useMemo(() => {
    const movements = profileInformation?.history_last_movements ?? [];
    const mapped = movements.map(mapMovementToTransaction);
    const sorted = [...mapped].sort((a, b) => b.date - a.date);
    return sorted.slice(0, limit);
  }, [profileInformation?.history_last_movements, limit]);

  const loading = !profileInformation && !isProfileLoaded;

  return { transactions, loading };
};

