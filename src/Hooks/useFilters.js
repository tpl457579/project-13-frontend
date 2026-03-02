import { useState, useMemo } from 'react'

export const useFilters = (allProducts, setPage, mode = "default") => {
  const [searchTerm, setSearchTerm] = useState('')
  const [size, setSize] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(term))
    }

    if (size) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(size.toLowerCase())
      )
    }

    if (maxPrice) {
      if (mode === "admin") {
        filtered = filtered.filter((p) => {
          switch (maxPrice) {
            case 'under10':
              return p.price < 10
            case '10to25':
              return p.price >= 10 && p.price <= 25
            case '25to50':
              return p.price >= 25 && p.price <= 50
            case '50plus':
              return p.price > 50
            default:
              return true
          }
        })
      } else {
        const max = parseFloat(maxPrice)
        filtered = filtered.filter((p) => p.price <= max)
      }
    }

    if (minRating) {
      const ratingValue = parseFloat(minRating)
      if (mode === "admin") {
        filtered = filtered.filter((p) => p.rating <= ratingValue)
      } else {
        filtered = filtered.filter((p) => p.rating >= ratingValue)
      }
    }

    return filtered
  }, [allProducts, searchTerm, size, maxPrice, minRating, mode])

  const clearFilters = () => {
    setSearchTerm('')
    setSize('')
    setMaxPrice('')
    setMinRating('')
    if (setPage) setPage(1)
  }

  return {
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredProducts,
    clearFilters
  }
}
