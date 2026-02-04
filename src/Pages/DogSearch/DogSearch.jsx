import './DogSearch.css'
import { useState, useEffect, useRef } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import DogPopup from '../../components/DogPopup/DogPopup.jsx'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import { apiFetch } from '../../components/apiFetch.js' 
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter.jsx'
import SmallDogCard from '../../components/SmallDogCard/SmallDogCard.jsx'

const ITEMS_PER_PAGE = 8

const getSize = (dog) => {
  if (!dog.weight) return null
  const weightStr = typeof dog.weight === 'object' ? dog.weight.metric : String(dog.weight)
  const w = weightStr.split('-')[0].trim()
  const weightNum = Number(w)
  if (isNaN(weightNum)) return null
  if (weightNum <= 10) return 'small'
  if (weightNum <= 25) return 'medium'
  return 'large'
}

export default function DogSearchPaginated() {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [temperaments, setTemperaments] = useState([])
  const [lettersOpen, setLettersOpen] = useState(false)
  const [selectedDog, setSelectedDog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTempOpen, setIsTempOpen] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function fetchDogs() {
      try {
        setLoading(true)
        const res = await apiFetch('/dogs') 
        const data = res?.dogs || res?.data || res
        const validDogs = (Array.isArray(data) ? data : [])
          .map((d) => ({ ...d, dogSize: getSize(d) }))
        
        setDogs(validDogs)

        const allTemps = validDogs.flatMap((d) =>
          d.temperament ? (Array.isArray(d.temperament) ? d.temperament : d.temperament.split(',')).map((t) => t.trim()) : []
        )
        const freqMap = {}
        allTemps.forEach((t) => (freqMap[t] = (freqMap[t] || 0) + 1))
        const topTen = Object.entries(freqMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([temp]) => temp)
        setTemperaments(topTen)
      } catch (err) {
        setDogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchDogs()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTempOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const {
    search, setSearch,
    size, setSize,
    temperament, setTemperament,
    letter, setLetter,
    filteredDogs,
    visibleDogs,
    loadedCount,
    setLoadedCount,
    clearFilters
  } = useDogFilters(dogs)

  const handleTempClick = (t) => {
    const newTemps = temperament.includes(t)
      ? temperament.filter((item) => item !== t)
      : [...temperament, t]
    setTemperament(newTemps)
    setLoadedCount(ITEMS_PER_PAGE)
  }

  const handleClearAll = () => {
    clearFilters()
    setIsTempOpen(false)
    setLettersOpen(false)
  }

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
            value={size}
            onChange={(e) => {
              setSize(e.target.value)
              setLoadedCount(ITEMS_PER_PAGE)
            }}
          >
            <option value='All'>All Sizes</option>
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>

          <div className="custom-dropdown" ref={dropdownRef}>
            <button 
              type="button"
              className="filter-select-dog-search dropdown-trigger"
              onClick={() => setIsTempOpen(!isTempOpen)}
            >
              {temperament.length > 0 ? `Selected (${temperament.length})` : "Temperaments"}
            </button>

            {isTempOpen && (
              <div className="dropdown-menu">
                {temperaments.map((t) => (
                  <div 
                    key={t} 
                    className="dropdown-item" 
                    onClick={() => handleTempClick(t)}
                  >
                    <span>{t}</span>
                    {temperament.includes(t) && <span className="tick">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className='clear-filters-btn' onClick={handleClearAll}>
            Clear Filters
          </button>
        </div>

        <AlphabetFilter 
          lettersOpen={lettersOpen} 
          setLettersOpen={setLettersOpen}
          letter={letter}
          setLetter={setLetter}
          setLoadedCount={setLoadedCount}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE} 
        />

        <h4 className='dog-search-h4'>Click on the dogs to learn more</h4>

        {visibleDogs.length === 0 ? (
          <p className='resultsText'>No dog breeds match your search.</p>
        ) : (
          <div className='dog-search-grid'>
            {visibleDogs.map((dog) => (
              <SmallDogCard 
                key={dog._id || dog.id} 
                dog={dog} 
                onClick={() => openModal(dog)} 
              />
            ))}
          </div>
        )}

        <p className='resultsText' style={{ margin: '15px 0' }}>
          Showing {visibleDogs.length} of {filteredDogs.length} dogs
        </p>

        {showTopBtn && (
          <button className="back-to-top" onClick={goToTop}>
            ↑
          </button>
        )}

        {loadedCount < filteredDogs.length && (
           <button
             className='load-more-btn'
             onClick={() => setLoadedCount((prev) => prev + ITEMS_PER_PAGE)}
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
    </div>
  )
}