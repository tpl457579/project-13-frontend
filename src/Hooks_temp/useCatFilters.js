import { useState, useMemo, useCallback } from 'react'

const ITEMS_PER_PAGE = 8

export const useCatFilters = (cats) => {
  const [search, setSearch] = useState('')
  const [size, setSize] = useState('All')
  const [temperament, setTemperament] = useState([]) 
  const [letter, setLetter] = useState('All')
  const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE)

  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesSize = size === 'All' || cat.catSize === size

     const matchesTemperament =
  temperament.length === 0 ||
  temperament.every((t) => {
    const catTemp = Array.isArray(cat.temperament)
      ? cat.temperament.join(', ')
      : cat.temperament;

    return catTemp?.toLowerCase().includes(t.toLowerCase());
  });

      const matchesLetter =
        letter === 'All' ||
        letter === '' ||
        cat.name.toUpperCase().startsWith(letter.toUpperCase())

      return matchesSearch && matchesSize && matchesTemperament && matchesLetter
    })
  }, [cats, search, size, temperament, letter])

  const visibleCats = useMemo(
    () => filteredCats.slice(0, loadedCount),
    [filteredCats, loadedCount]
  )

  const clearFilters = useCallback(() => {
    setSearch('')
    setSize('All')
    setTemperament([])
    setLetter('All')
    setLoadedCount(ITEMS_PER_PAGE)
  }, [])

  return {
    search,
    setSearch,
    size,
    setSize,
    temperament,
    setTemperament,
    letter,
    setLetter,
    filteredCats,
    visibleCats,
    loadedCount,
    setLoadedCount,
    clearFilters
  }
}