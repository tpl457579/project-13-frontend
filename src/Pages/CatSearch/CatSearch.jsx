import './CatSearch.css'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader/Loader.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import AnimalPopup from '../../components/AnimalPopup/AnimalPopup.jsx'
import { useCatFilters } from '../../Hooks/useCatFilters.js'
import { apiFetch } from '../../components/apiFetch.js' 
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'
import IdeaBulb from '../../components/IdeaBulb/IdeaBulb.jsx'

const ITEMS_PER_PAGE = 8

/* const getSize = (cat) => {
  if (!cat.weight) return null
  const weightStr = typeof cat.weight === 'object' ? cat.weight.metric : String(cat.weight)
  const w = weightStr.split('-')[0].trim()
  const weightNum = Number(w)
  if (isNaN(weightNum)) return null
  if (weightNum <= 7) return 'small'
  if (weightNum <= 14) return 'medium'
  return 'large'
} */

export default function CatSearch() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [temperaments, setTemperaments] = useState([])
  const [lettersOpen, setLettersOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTempOpen, setIsTempOpen] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function fetchCats() {
      try {
        setLoading(true)
        const res = await apiFetch('/cats') 
        const data = res?.cats || res?.data || res
        const validCats = (Array.isArray(data) ? data : [])
          /* .map((d) => ({ ...d, catSize: getSize(d) })) */
        
        setCats(validCats)

        const allTemps = validCats.flatMap((d) =>
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
        setCats([])
      } finally {
        setLoading(false)
      }
    }
    fetchCats()
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
    /* size, setSize, */
    temperament, setTemperament,
    letter, setLetter,
    filteredCats,
    visibleCats,
    loadedCount,
    setLoadedCount,
    clearFilters
  } = useCatFilters(cats)

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

  const openModal = (cat) => {
    setSelectedCat(cat);
    setIsModalOpen(true);

    const isShortScreen = window.innerHeight <= 520;
    if (isShortScreen && !document.fullscreenElement) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {
        });
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    }
  };

  const closeModal = () => {
    setSelectedCat(null)
    setIsModalOpen(false)
  }

  if (loading) return <Loader />

  return (
    <div className='cat-search-layout'>
      <main className='cat-search-main'>
        <h1 className='cat-search-h1'>Cat Breed Lookup</h1>

        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setLoadedCount(ITEMS_PER_PAGE)
          }}
          placeholder='Search breed...'
        />

        <div className='filters'>
  {/* <select
    className='filter-select-cat-search'
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
 */}
  <div className="custom-dropdown" ref={dropdownRef}>
    <button 
      type="button"
      className="filter-select-cat-search dropdown-trigger"
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

  <div className='filter-tip-container'>
    <button className='clear-filters-btn' onClick={handleClearAll}>
      Clear Filters
    </button>
    <IdeaBulb 
      tip="CatSearch" 
      storageKey="has_seen_search_tip" 
      className="cat-search-tip" 
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

        <h4 className='cat-search-h4'>Click on the cats to learn more</h4>

        <p className='resultsText' style={{ margin: '15px 0' }}>
          Showing {visibleCats.length} of {filteredCats.length} cats
        </p>

        {visibleCats.length === 0 ? (
          <p className='resultsText'>No cat breeds match your search.</p>
        ) : (
          <div className='cat-search-grid'>
            {visibleCats.map((cat) => (
              <SmallAnimalCard 
                key={cat._id || cat.id} 
                cat={cat} 
                onClick={() => openModal(cat)} 
              />
            ))}
          </div>
        )}

        {showTopBtn && (
          <button className="back-to-top" onClick={goToTop}>
            ↑
          </button>
        )}

        {loadedCount < filteredCats.length && (
           <button
             className='load-more-btn'
             onClick={() => setLoadedCount((prev) => prev + ITEMS_PER_PAGE)}
           >
             Load More Cats
           </button>
        )}

        <AnimalPopup
          isOpen={isModalOpen}
          closePopup={closeModal}
          cat={selectedCat}
        />
      </main>
    </div>
  )
}