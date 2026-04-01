import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

const MAX_VISIBLE_PAGES = 5;

/**
 * @param {Object} props
 * @param {number} props.currentPage - Página actual (1-based)
 * @param {number} props.totalPages  - Total de páginas
 * @param {(page: number) => void} props.onPageChange
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <HiOutlineChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`min-w-[2.5rem] h-10 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'border border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Página siguiente"
      >
        <HiOutlineChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
