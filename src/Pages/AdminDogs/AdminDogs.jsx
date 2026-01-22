import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import DogForm from '../../components/DogForm/DogForm.jsx'
import DogLoader from '../../components/DogLoader/DogLoader'
import SearchBar from '../../components/SearchBar/SearchBar'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { apiFetch } from '../../components/apiFetch.js'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import { Footer } from '../../components/Footer/Footer.jsx'

import './AdminDogs.css'

const PLACEHOLDER = './assets/images/placeholder.png'
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

const AdminDogs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [temperaments, setTemperaments] = useState([])
  const [lettersOpen, setLettersOpen] = useState(false)
  const [editingDog, setEditingDog] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedDog, setSelectedDog] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dogDetailsOpen, setDogDetailsOpen] = useState({})

  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products'

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
      } catch {
        setError('Failed to fetch dogs')
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

  const handleTabChange = (tab) => {
    if (tab === 'products') {
      navigate('/admin-products')
    } else {
      navigate('/admin-dogs')
    }
  }

  const openModal = useCallback(dog => { setEditingDog(dog || null); setShowModal(true) }, [])
  const closeModal = useCallback(() => { setEditingDog(null); setShowModal(false) }, [])
  const openDeleteModal = useCallback(dog => { setSelectedDog(dog); setDeleteModal(true) }, [])
  const closeDeleteModal = useCallback(() => { setSelectedDog(null); setDeleteModal(false) }, [])

 const handleSaveDog = async (dogData) => {
  setIsSubmitting(true)
  try {
    const token = localStorage.getItem('token')
    
    const res = await apiFetch('/dogs/save', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      data: dogData 
    })

  
    const dog = res?.dog || res?.data || res

    if (editingDog) {
      setDogs(prev => prev.map(d => (d._id === dog._id ? { ...dog, dogSize: getSize(dog) } : d)))
      showPopup('Dog updated successfully')
    } else {
      setDogs(prev => [...prev, { ...dog, dogSize: getSize(dog) }])
      showPopup('Dog added successfully')
    }
    closeModal()
  } catch (err) {
    console.error("Save Error Detail:", err) 
    showPopup('Failed to save dog', 'error')
  } finally {
    setIsSubmitting(false)
  }
}

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/dogs/${selectedDog._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setDogs(prev => prev.filter(d => d._id !== selectedDog._id))
      showPopup('Dog deleted successfully')
      closeDeleteModal()
    } catch { showPopup('Failed to delete', 'error') }
    finally { setIsDeleting(false) }
  }

  if (loading) return <DogLoader />

  return (
    <div className='dog-search-layout admin-products'>
      <main className='dog-search-main'>
        <h1 className='dog-title-h1'>Admin Dog Dashboard</h1>

        <div className='admin-tabs'>
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} 
            onClick={() => handleTabChange('products')}
          >
            Products
          </button>
          <button 
            className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} 
            onClick={() => handleTabChange('dogs')}
          >
            Dogs
          </button>
        </div>
        
        <SearchBar 
          value={search} 
          onChange={e => { setSearch(e.target.value); setLoadedCount(ITEMS_PER_PAGE); }} 
          placeholder='Search breed...' 
        />

        <div className='filters'>
          <select className='filter-select-dog-search' value={size} onChange={e => { setSize(e.target.value); setLoadedCount(ITEMS_PER_PAGE); }}>
            <option value='All'>All Sizes</option>
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>

          <select className='filter-select-dog-search' value={temperament} onChange={e => { setTemperament(e.target.value); setLoadedCount(ITEMS_PER_PAGE); }}>
            <option value='All'>Temperaments</option>
            {temperaments.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <button className='clear-filters-btn' onClick={() => { clearFilters(); setLoadedCount(ITEMS_PER_PAGE); }}>Clear Filters</button>
          <button className='admin-add-btn' onClick={() => openModal(null)}>+</button>
        </div>

        <div className='dog-list'>
          {visibleDogs.length ? visibleDogs.map(dog => (
            <div key={dog._id} className='admin-dog-card'>
              <img className='admin-dog-card-img' src={dog.image_link || PLACEHOLDER} alt={dog.name} onError={e => e.target.src = PLACEHOLDER} />
              <div className='admin-dog-card-info'>
                <h4>{dog.name}</h4>
                 
                
                <div className='admin-card-buttons'>
                  <Button onClick={() => openModal(dog)}>Edit</Button>
                  <Button onClick={() => openDeleteModal(dog)}>Delete</Button>
                </div>
              </div>
            </div>
          )) : <p>No dogs found matching your filters.</p>}
        </div>
        

        <div className='dog-pagination-container'>
          <div className='pagination-wrapper'>
             <p className='resultsText' style={{ margin: '15px 0' }}>
          Showing {visibleDogs.length} of {filteredDogs.length} dogs
        </p>
              <button
                className='load-more-btn'
                onClick={() => setLoadedCount((prev) => prev + ITEMS_PER_PAGE)}
                style={{
                    padding: '15px 40px',
                    margin: '20px 0',
                    cursor: 'pointer',
                    borderRadius: '50px'
                }}
              >
                Load More Dogs
              </button>
            
          </div>
        </div>
      </main>

      <div className='dog-alphabet-container'>
        <button className='alphabet-toggle-btn' onClick={() => setLettersOpen(!lettersOpen)}>
          <img className='az-img' src='https://cdn-icons-png.flaticon.com/128/11449/11449637.png' alt="A-Z" />
        </button>
        <div className={`alphabet-letters ${lettersOpen ? 'open' : ''}`}>
          {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l) => (
            <button
              key={l}
              className={`alphabet-btn ${letter === l ? 'active' : ''}`}
              onClick={() => { setLetter(l); setLoadedCount(ITEMS_PER_PAGE); }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <DogForm initialData={editingDog || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveDog} />
        </Modal>
      )}
      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={closeDeleteModal}>
          <div className='delete-modal-content'>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{selectedDog?.name}</strong>?</p>
            <div className='modal-buttons'>
              <Button onClick={handleDelete} loading={isDeleting} showSpinner>Delete</Button>
              <Button onClick={closeDeleteModal}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
      <Footer openModal={() => openModal(null)} />
    </div>
    
  )
  
}

export default AdminDogs