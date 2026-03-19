import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../api/services/orderService';

const STATUS_API_MAP = {
  all: 'Todos',
  Todos: 'Todos',
  pending: 'Pendiente',
  Pendiente: 'Pendiente',
  shipping: 'En envío',
  'En envío': 'En envío',
  completed: 'Completado',
  Completado: 'Completado',
  cancelled: 'Cancelado',
  Cancelado: 'Cancelado',
};

export const useOrders = (options = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(options.page ?? 1);
  const [statusFilter, setStatusFilter] = useState(options.status ?? 'all');

  const fetchOrders = useCallback(async (page = 1, status = statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const apiStatus = STATUS_API_MAP[status] ?? 'Todos';
      const result = await orderService.getOrdersByStatus({
        status: apiStatus,
        page,
        limit: options.limit ?? 10,
      });
      setOrders(result.orders);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      return result;
    } catch (err) {
      setError(err);
      setOrders([]);
      setTotalItems(0);
      setTotalPages(1);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [statusFilter, options.limit]);

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter, fetchOrders]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
    fetchOrders(page, statusFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [statusFilter, fetchOrders]);

  const changeStatus = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  return {
    orders,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    statusFilter,
    fetchOrders,
    goToPage,
    changeStatus,
  };
};
