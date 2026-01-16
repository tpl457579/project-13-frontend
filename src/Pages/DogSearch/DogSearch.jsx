import './DogSearch.css'
import { useState, useEffect, useMemo } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import PaginationControls from '../../components/PaginationControls/PaginationControls.jsx'
import DogPopup from '../../components/DogPopup.jsx'

const ITEMS_PER_PAGE = 8

const getSize = (dog) => {
  if (!dog.weight) return null
  const w = String(dog.weight).split('-')[0].trim()
  const weightNum = Number(w)
  if (isNaN(weightNum)) return null
  if (weightNum <= 10) return 'small'
  if (weightNum <= 25) return 'medium'
  return 'large'
}

export default function DogSearchPaginated() {
  const [dogs, setDogs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [temperamentFilter, setTemperamentFilter] = useState('all')
  const [temperaments, setTemperaments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDog, setSelectedDog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchDogs() {
      try {
        setLoading(true)
        const res = await fetch(
          'https://dog-character-api.onrender.com/api/dogs'
        )
        const data = await res.json()
        const validDogs = data
          .filter((d) => d.id != null)
          .map((d) => ({ ...d, dogSize: getSize(d) }))
        setDogs(validDogs)

        const allTemps = validDogs.flatMap((d) =>
          d.temperament ? d.temperament.split(',').map((t) => t.trim()) : []
        )
        const freqMap = {}
        allTemps.forEach((t) => (freqMap[t] = (freqMap[t] || 0) + 1))
        const topTen = Object.entries(freqMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([temp]) => temp)
        setTemperaments(topTen)
      } catch {
        setDogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchDogs()
  }, [])

  const filteredDogs = useMemo(() => {
    if (!dogs) return []
    return dogs.filter((dog) => {
      const matchesSearch = dog.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesSize = sizeFilter === 'all' || dog.dogSize === sizeFilter
      const matchesTemp =
        temperamentFilter === 'all' ||
        (dog.temperament &&
          dog.temperament
            .toLowerCase()
            .includes(temperamentFilter.toLowerCase()))
      return matchesSearch && matchesSize && matchesTemp
    })
  }, [dogs, search, sizeFilter, temperamentFilter])

  const totalPages = Math.ceil(filteredDogs.length / ITEMS_PER_PAGE)
  const currentDogs = filteredDogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const openModal = (dog) => {
    setSelectedDog(dog)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedDog(null)
    setIsModalOpen(false)
  }

  if (loading || !dogs) return <DogLoader />

  return (
    <div className='dog-search-container'>
      <h1>Dog Breed Lookup</h1>

      <div>
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          placeholder='Search breed...'
        />
        <div className='filters'>
          <select
            className='filter-select-dog-search'
            value={sizeFilter}
            onChange={(e) => {
              setSizeFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value='all'>All Sizes</option>
            <option value='small'>Small</option>
            <option value='medium'>Medium </option>
            <option value='large'>Large </option>
          </select>

          <select
            className='filter-select-dog-search'
            value={temperamentFilter}
            onChange={(e) => {
              setTemperamentFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value='all'>Temperaments</option>
            {temperaments.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h3>Click on the dogs to learn more</h3>

      {currentDogs.length === 0 ? (
        <p className='resultsText'>No dog breeds match your search.</p>
      ) : (
        <div className='dog-search-grid'>
          {currentDogs.map((dog) => (
            <div
              key={dog.id}
              className='dogCard'
              onClick={() => openModal(dog)}
            >
              {dog.image_link && (
                <img src={dog.image_link} alt={dog.name} className='dogImg' />
              )}
              <h3>{dog.name}</h3>
            </div>
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        goPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        goNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />
      <DogPopup
        isOpen={isModalOpen}
        closePopup={closeModal}
        dog={selectedDog}
      />
    </div>
  )
}
