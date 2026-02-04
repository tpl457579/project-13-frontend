import { useState, useMemo, useCallback } from 'react'

const ITEMS_PER_PAGE = 8

export const useDogFilters = (dogs) => {
  const [search, setSearch] = useState('')
  const [size, setSize] = useState('All')
  const [temperament, setTemperament] = useState([]) 
  const [letter, setLetter] = useState('All')
  const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE)

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      const matchesSearch = dog.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesSize = size === 'All' || dog.dogSize === size

     const matchesTemperament =
  temperament.length === 0 ||
  temperament.every((t) => {
    const dogTemp = Array.isArray(dog.temperament)
      ? dog.temperament.join(', ')
      : dog.temperament;

    return dogTemp?.toLowerCase().includes(t.toLowerCase());
  });

      const matchesLetter =
        letter === 'All' ||
        letter === '' ||
        dog.name.toUpperCase().startsWith(letter.toUpperCase())

      return matchesSearch && matchesSize && matchesTemperament && matchesLetter
    })
  }, [dogs, search, size, temperament, letter])

  const visibleDogs = useMemo(
    () => filteredDogs.slice(0, loadedCount),
    [filteredDogs, loadedCount]
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
    filteredDogs,
    visibleDogs,
    loadedCount,
    setLoadedCount,
    clearFilters
  }
}