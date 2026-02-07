import { useState, useEffect } from 'react';

export const usePagination = (data, itemsPerPage, key) => {
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem(key);
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    sessionStorage.setItem(key, currentPage);
  }, [currentPage, key]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return {
    paginatedData,
    totalPages,
    currentPage,
    setPage: setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1))
  };
};