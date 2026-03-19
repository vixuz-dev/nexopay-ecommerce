import { useState, useEffect, useCallback } from 'react';
import { creditLineService } from '../api/services/creditLineService';

const LIMIT = 10;

const mapMovementToTransaction = (movement) => {
  const isAbono = movement.type_movement === 'Abono';
  return {
    id: movement.credit_line_history_id ?? movement.id ?? String(Math.random()),
    date: movement.created_at ? new Date(movement.created_at.replace(' ', 'T')) : new Date(),
    description: movement.description ?? '',
    amount: isAbono ? -Math.abs(movement.amount ?? 0) : Math.abs(movement.amount ?? 0),
    type: isAbono ? 'payment' : 'purchase',
    status: 'completed',
  };
};

const parseHistoryResponse = (data, page, limit) => {
  if (!data) return { movements: [], total: 0 };
  let movements = [];
  let total = 0;
  if (Array.isArray(data)) {
    movements = data;
    total = data.length;
  } else {
    movements = data.movements ?? data.data ?? data.history ?? [];
    movements = Array.isArray(movements) ? movements : [];
    total = data.total ?? data.total_count ?? data.totalRecords ?? null;
    if (total == null) {
      total = movements.length < limit ? (page - 1) * limit + movements.length : page * limit + 1;
    }
  }
  return { movements, total };
};

export const useAccountMovements = (page = 1) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const data = await creditLineService.getCreditLineHistory({
        page: pageNum,
        limit: LIMIT,
      });
      const { movements, total: totalCount } = parseHistoryResponse(data, pageNum, LIMIT);
      const mapped = movements.map(mapMovementToTransaction);
      const sorted = [...mapped].sort((a, b) => b.date - a.date);
      setTransactions(sorted);
      setTotal(totalCount);
      return { movements, total: totalCount };
    } catch (err) {
      setError(err);
      setTransactions([]);
      setTotal(0);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const totalPages = Math.ceil(total / LIMIT);

  return {
    transactions,
    loading,
    error,
    total,
    totalPages,
    limit: LIMIT,
    fetchPage,
  };
};
