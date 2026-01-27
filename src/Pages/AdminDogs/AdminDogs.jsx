import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDogs } from '../../Hooks/useDogs'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import { usePagination } from '../../Hooks/usePagination.js'
import DogForm from '../../components/DogForm/DogForm'
import DogLoader from '../../components/DogLoader/DogLoader'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import DeleteModal from '../../components/DeleteModal/DeleteModal.jsx'
import { apiFetch } from '../../components/apiFetch.js'
import { Footer } from '../../components/Footer/Footer.jsx'

import './AdminDogs.css'

const PLACEHOLDER = './assets/images/placeholder.png'

const AdminDogs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { dogs, setDogs, loading, error } = useDogs()
  
  const [editingDog, setEditingDog] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedDog, setSelectedDog] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products'

  const {
    searchTerm,
    setSearchTerm,
    energy,
    setEnergy,
    playfulness,
    setPlayfulness,
    filteredDogs,
    clearFilters
  } = useDogFilters(dogs)

  const {
    paginatedData: visibleDogs,
    totalPages: totalDogPages,
    currentPage: currentDogPage,
    setPage: setDogPage
  } = usePagination(filteredDogs, 8)

  useEffect(() => {
    setDogPage(1)
  }, [searchTerm, energy, playfulness, setDogPage])

  const handleTabChange = (tab) => {
    if (tab === 'products') {
      navigate('/admin-products')
    } else {
      navigate('/admin-dogs')
    }
  }

  const openModal = useCallback((item = null) => {
    setEditingDog(item)
    setIsSubmitting(false)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingDog(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((item) => {
    setSelectedDog(item)
    setDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setSelectedDog(null)
    setDeleteModal(false)
  }, [])

  const handleSaveDog = useCallback(
    async (payload) => {
      try {
        const token = localStorage.getItem('token')
        const res = await apiFetch('/dogs/save', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        })
        const dog = res?.dog || res?.data || res
        setIsSubmitting(true)
        if (!dog?._id) {
          showPopup('Failed to save dog', 'error')
          return
        }
        if (editingDog && editingDog._id) {
          setDogs((prev) => prev.map((d) => (d._id === dog._id ? dog : d)))
          showPopup('Dog edited successfully')
        } else {
          setDogs((prev) => [...prev, dog])
          showPopup('Dog added successfully')
        }
        closeModal()
      } catch {
        showPopup('Failed to save dog', 'error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [editingDog, closeModal, setDogs]
  )

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (selectedDog?._id) {
        await apiFetch(`/dogs/${selectedDog._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        setDogs((prev) => prev.filter((d) => d._id !== selectedDog._id))
        showPopup('Dog deleted successfully')
      }
      closeDeleteModal()
    } catch {
      showPopup('Failed to delete', 'error')
    } finally {
      setIsDeleting(false)
    }
  }, [selectedDog, setDogs, closeDeleteModal])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setDogPage(1)
  }, [clearFilters, setDogPage])

  return (
    <div className='admin-dogs'>
      <h1 className='admin-dogs-h1'>Admin Dog Dashboard</h1>

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
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder='Search dogs...' 
      />
      
      <FilterControls 
        energy={energy} 
        setEnergy={setEnergy} 
        playfulness={playfulness} 
        setPlayfulness={setPlayfulness} 
        clearFilters={handleClearFilters} 
      />

      <button className='admin-add-btn' onClick={() => openModal(null)}>+</button>

      {loading ? (
        <DogLoader />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className='dog-list'>
            {visibleDogs.length ? visibleDogs.map(d => (
              <div key={d._id} className='admin-dog-card'>
                <img src={d.imageUrl || d.image_link || PLACEHOLDER} alt={d.name} />
                <div className='admin-dog-card-info'>
                  <h4
  className="admin-dog-card-info"
  style={{
    fontSize: d.name.length > 22 ? "15px" : "18px"
  }}
>
  {d.name}</h4>
                  <div className='admin-dog-buttons'>
                    <Button onClick={() => openModal(d)}>Edit</Button>
                    <Button onClick={() => openDeleteModal(d)}>Delete</Button>
                  </div>
                </div>
              </div>
            )) : <p>No dogs found.</p>}
          </div>

          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <PaginationControls
                currentPage={currentDogPage}
                totalPages={totalDogPages}
                goPrev={() => setDogPage(prev => Math.max(prev - 1, 1))}
                goNext={() => setDogPage(prev => Math.min(prev + 1, totalDogPages))}
              />
            </div>
          </div>
        </>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <DogForm 
            initialData={editingDog || {}} 
            isSubmitting={isSubmitting} 
            onCancel={closeModal} 
            onSubmit={handleSaveDog} 
          />
        </Modal>
      )}

      <DeleteModal 
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedDog?.name}
      />

      <Footer openModal={() => openModal(null)} />
    </div>
  )
}

export default AdminDogs