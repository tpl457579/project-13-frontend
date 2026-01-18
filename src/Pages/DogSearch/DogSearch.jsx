import './DogSearch.css'
import { useState, useEffect, useMemo } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
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
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sizeFilter, setSizeFilter] = useState('All')
  const [temperamentFilter, setTemperamentFilter] = useState('All')
  const [temperaments, setTemperaments] = useState([])
  const [letterFilter, setLetterFilter] = useState('All')
  const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE)
  const [lettersOpen, setLettersOpen] = useState(false)

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
    return dogs.filter((dog) => {
      const matchesSearch = dog.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesSize = sizeFilter === 'All' || dog.dogSize === sizeFilter
      const matchesTemp =
        temperamentFilter === 'All' ||
        (dog.temperament &&
          dog.temperament
            .toLowerCase()
            .includes(temperamentFilter.toLowerCase()))
      const matchesLetter =
        letterFilter === 'All' ||
        dog.name[0].toLowerCase() === letterFilter.toLowerCase()
      return matchesSearch && matchesSize && matchesTemp && matchesLetter
    })
  }, [dogs, search, sizeFilter, temperamentFilter, letterFilter])

  const visibleDogs = filteredDogs.slice(0, loadedCount)

  const openModal = (dog) => {
    setSelectedDog(dog)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedDog(null)
    setIsModalOpen(false)
  }

  if (loading) return <DogLoader />

  return (
    <div className='dog-search-layout'>
      <main className='dog-search-main'>
        <h1 className='dog-search-h1'>Dog Breed Lookup</h1>

        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setLoadedCount(ITEMS_PER_PAGE)
          }}
          placeholder='Search breed...'
        />

        <div className='filters'>
          <select
            className='filter-select-dog-search'
            value={sizeFilter}
            onChange={(e) => {
              setSizeFilter(e.target.value)
              setLoadedCount(ITEMS_PER_PAGE)
            }}
          >
            <option value='All'>All Sizes</option>
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>

          <select
            className='filter-select-dog-search'
            value={temperamentFilter}
            onChange={(e) => {
              setTemperamentFilter(e.target.value)
              setLoadedCount(ITEMS_PER_PAGE)
            }}
          >
            <option value='All'>Temperaments</option>
            {temperaments.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <h3>Click on the dogs to learn more</h3>

        {visibleDogs.length === 0 ? (
          <p className='resultsText'>No dog breeds match your search.</p>
        ) : (
          <div className='dog-search-grid'>
            {visibleDogs.map((dog) => (
              <div
                key={dog.id}
                className='dogCard'
                onClick={() => openModal(dog)}
              >
                {dog.image_link && (
                  <img
                    src={dog.image_link}
                    alt={dog.name}
                    className='dogImg'
                  />
                )}
                <h3>{dog.name}</h3>
              </div>
            ))}
          </div>
        )}

        {loadedCount < filteredDogs.length && (
          <button
            className='load-more-btn'
            onClick={() =>
              setLoadedCount((prev) => prev + ITEMS_PER_PAGE)
            }
          >
            Load More Dogs
          </button>
        )}

        <DogPopup
          isOpen={isModalOpen}
          closePopup={closeModal}
          dog={selectedDog}
        />
      </main>

      <div className="alphabet-container">
  <button
    className="alphabet-toggle-btn"
    onClick={() => setLettersOpen(!lettersOpen)}
  >
    <img className='az-img' src='https://cdn-icons-png.flaticon.com/128/11449/11449637.png'/>
  </button>

  <div className={`alphabet-letters ${lettersOpen ? 'open' : ''}`}>
    {['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((letter) => (
      <button
        key={letter}
        className={`alphabet-btn ${
          letterFilter === letter ? 'active' : ''
        }`}
        onClick={() => {
          setLetterFilter(letter)
          setLoadedCount(ITEMS_PER_PAGE)
        }}
      >
        {letter}
      </button>
    ))}
  </div>
</div>

     </div>
   
  )
}
