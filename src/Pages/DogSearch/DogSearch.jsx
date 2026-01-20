import './DogSearch.css'
import { useState, useEffect } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import DogPopup from '../../components/DogPopup.jsx'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import { apiFetch } from '../../components/apiFetch.js' // Import your helper

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
  const [temperaments, setTemperaments] = useState([])
  const [lettersOpen, setLettersOpen] = useState(false)
  const [selectedDog, setSelectedDog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchDogs() {
      try {
        setLoading(true)
        // Switch from external Render API to your internal MongoDB API
        const res = await apiFetch('/') 
        
        // Ensure data is an array (handling different possible API response shapes)
        const data = res?.dogs || res?.data || res
        const validDogs = (Array.isArray(data) ? data : [])
          .map((d) => ({ ...d, dogSize: getSize(d) }))
        
        setDogs(validDogs)

        // Generate temperament list from MongoDB data
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
        console.error("Error fetching dogs from MongoDB:", err)
        setDogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchDogs()
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

          <select
            className='filter-select-dog-search'
            value={temperament}
            onChange={(e) => {
              setTemperament(e.target.value)
              setLoadedCount(ITEMS_PER_PAGE)
            }}
          >
            <option value='All'>Temperaments</option>
            {temperaments.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button className='clear-filters-btn' onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <h3>Click on the dogs to learn more</h3>

        {visibleDogs.length === 0 ? (
          <p className='resultsText'>No dog breeds match your search.</p>
        ) : (
          <div className='dog-search-grid'>
            {visibleDogs.map((dog) => (
              <div
                key={dog._id || dog.id} // MongoDB uses _id
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

        <p className='resultsText' style={{ margin: '15px 0' }}>
          Showing {visibleDogs.length} of {filteredDogs.length} dogs
        </p>

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

      <div className='alphabet-container'>
        <button
          className='alphabet-toggle-btn'
          onClick={() => setLettersOpen(!lettersOpen)}
        >
          <img
            className='az-img'
            src='https://cdn-icons-png.flaticon.com/128/11449/11449637.png'
            alt="A-Z"
          />
        </button>

        <div className={`alphabet-letters ${lettersOpen ? 'open' : ''}`}>
          {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l) => (
            <button
              key={l}
              className={`alphabet-btn ${letter === l ? 'active' : ''}`}
              onClick={() => {
                setLetter(l)
                setLoadedCount(ITEMS_PER_PAGE)
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}