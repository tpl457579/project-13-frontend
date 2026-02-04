import { useState, useEffect, useMemo, useCallback } from 'react'

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => {
    const length = Array.isArray(data) ? data.length : 0
    return Math.max(1, Math.ceil(length / itemsPerPage))
  }, [data, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [data.length, itemsPerPage])

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return []
    const start = (currentPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }, [data, currentPage, itemsPerPage])

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  return {
    currentPage,
    totalPages,
    paginatedData,
    setPage: setCurrentPage,
    nextPage,
    prevPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  }
}