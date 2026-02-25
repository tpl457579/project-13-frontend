import './AnimalSearch.css'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader/Loader'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import AnimalPopup from '../../components/AnimalPopup/AnimalPopup.jsx'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import { useCatFilters } from '../../Hooks/useCatFilters.js'
import { apiFetch } from '../../components/apiFetch.js'
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'
import IdeaBulb from '../../components/IdeaBulb/IdeaBulb.jsx'
import { AiOutlineArrowUp } from 'react-icons/ai'

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

export default function AnimalSearch({ type = 'dog' }) {
  const isDog = type === 'dog'
  const label = isDog ? 'dog' : 'cat'

  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [temperaments, setTemperaments] = useState([])
  const [lettersOpen, setLettersOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTempOpen, setIsTempOpen] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function fetchAnimals() {
      try {
        setLoading(true)
        const res = await apiFetch(`/${label}s`)
        const data = res?.[`${label}s`] || res?.data || res
        const validAnimals = (Array.isArray(data) ? data : [])
          .map((a) => isDog ? { ...a, dogSize: getSize(a) } : a)

        setAnimals(validAnimals)

        // Cats: build temperament list from data; dogs: temperaments come from elsewhere
        if (!isDog) {
          const allTemps = validAnimals.flatMap((a) =>
            a.temperament
              ? (Array.isArray(a.temperament) ? a.temperament : a.temperament.split(',')).map((t) => t.trim())
              : []
          )
          const freqMap = {}
          allTemps.forEach((t) => (freqMap[t] = (freqMap[t] || 0) + 1))
          const topTen = Object.entries(freqMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([temp]) => temp)
          setTemperaments(topTen)
        }
      } catch (err) {
        console.error(`Error fetching ${label}s:`, err)
        setAnimals([])
      } finally {
        setLoading(false)
      }
    }
    fetchAnimals()
  }, [label, isDog])

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTempOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dogFilters = useDogFilters(isDog ? animals : [])
  const catFilters = useCatFilters(!isDog ? animals : [])

  const {
    search, setSearch,
    temperament, setTemperament,
    letter, setLetter,
    loadedCount, setLoadedCount,
    clearFilters
  } = isDog ? dogFilters : catFilters

  const filteredAnimals = isDog ? dogFilters.filteredDogs : catFilters.filteredCats
  const visibleAnimals = isDog ? dogFilters.visibleDogs : catFilters.visibleCats
  const size = isDog ? dogFilters.size : null
  const setSize = isDog ? dogFilters.setSize : null

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

  const openModal = (animal) => {
    setSelectedAnimal(animal)
    setIsModalOpen(true)
    const isShortScreen = window.innerHeight <= 520
    if (isShortScreen && !document.fullscreenElement) {
      const el = document.documentElement
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    }
  }

  const closeModal = () => {
    setSelectedAnimal(null)
    setIsModalOpen(false)
  }

  if (loading) return <Loader />

  return (
    <div className='animal-search-layout'>
      <main className='animal-search-main'>
        <h1 className='animal-search-h1'>{isDog ? 'Dog' : 'Cat'} Breed Lookup</h1>

        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setLoadedCount(ITEMS_PER_PAGE)
          }}
          placeholder='Search breed...'
        />

        <div className='animal-filter'>
          {isDog && (
            <select
              className='filter-select-animal-search'
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
          )}

          <div className='custom-dropdown' ref={dropdownRef}>
            <button
              type='button'
              className='filter-select-animal-search dropdown-trigger'
              onClick={() => setIsTempOpen(!isTempOpen)}
            >
              {temperament.length > 0 ? `Selected (${temperament.length})` : 'Temperaments'}
            </button>

            {isTempOpen && (
              <div className='dropdown-menu'>
                {temperaments.map((t) => (
                  <div key={t} className='dropdown-item' onClick={() => handleTempClick(t)}>
                    <span>{t}</span>
                    {temperament.includes(t) && <span className='tick'>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='filter-tip-container'>
            <button className='clear-filters-btn' onClick={handleClearAll}>
              Clear Filters
            </button>
            <IdeaBulb
              tip={isDog ? 'DogSearch' : 'CatSearch'}
              storageKey='has_seen_search_tip'
              className='animal-search-tip'
            />
          </div>
        </div>

        <AlphabetFilter
          lettersOpen={lettersOpen}
          setLettersOpen={setLettersOpen}
          letter={letter}
          setLetter={setLetter}
          setLoadedCount={setLoadedCount}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        />

        <h4 className='animal-search-h4'>Click on the {label}s to learn more</h4>

        <p className='resultsText' style={{ margin: '15px 0' }}>
          Showing {visibleAnimals.length} of {filteredAnimals.length} {label}s
        </p>

        {visibleAnimals.length === 0 ? (
          <p className='resultsText'>No {label} breeds match your search.</p>
        ) : (
          <div className='animal-search-grid'>
            {visibleAnimals.map((animal) => (
              <SmallAnimalCard
                key={animal._id ?? animal.id}
                {...{ [label]: animal }}
                onClick={() => openModal(animal)}
              />
            ))}
          </div>
        )}

        {showTopBtn && (
          <button className='back-to-top' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <AiOutlineArrowUp />
          </button>
        )}

        {loadedCount < filteredAnimals.length && (
          <button
            className='load-more-btn'
            onClick={() => setLoadedCount((prev) => prev + ITEMS_PER_PAGE)}
          >
            Load More {isDog ? 'Dogs' : 'Cats'}
          </button>
        )}

        <AnimalPopup
          isOpen={isModalOpen}
          closePopup={closeModal}
          {...{ [label]: selectedAnimal }}
        />
      </main>
    </div>
  )
}