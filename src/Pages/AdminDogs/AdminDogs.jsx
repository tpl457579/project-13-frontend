import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDogs } from '../../Hooks/useDogs'
import { useDogFilters } from '../../Hooks/useDogFilters.js'
import { usePagination } from '../../Hooks/usePagination.js'
import { apiFetch } from '../../components/apiFetch.js'
import ShowPopup  from '../../components/ShowPopup/ShowPopup.js'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter.jsx'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import DogForm from '../../components/DogForm/DogForm'
import DogLoader from '../../components/DogLoader/DogLoader'
import Modal from '../../components/Modal/Modal.jsx'
import DeleteModal from '../../components/DeleteModal/DeleteModal.jsx'
import { Footer } from '../../components/Footer/Footer.jsx'

import './AdminDogs.css'
import toggleFullscreen from '../../components/FullScreenToggle.jsx'

const PLACEHOLDER = '../placeholder.png'

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
  const [lettersOpen, setLettersOpen] = useState(false)

  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products'

  const {
    search, setSearch,
    letter, setLetter,
    setLoadedCount,
    energy, setEnergy,
    playfulness, setPlayfulness,
    filteredDogs, clearFilters
  } = useDogFilters(dogs)

  const {
    paginatedData: visibleDogs,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredDogs, 8)

  const openModal = useCallback((item = null) => {
    setEditingDog(item)
    setIsSubmitting(false)
    setShowModal(true)
    toggleFullscreen()
  }, [])

  const closeModal = useCallback(() => {
    setEditingDog(null)
    setShowModal(false)
    toggleFullscreen()
  }, [])

  const openDeleteModal = useCallback((item) => {
    setSelectedDog(item)
    setDeleteModal(true)
  }, [])

  const handleSaveDog = async (payload) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch('/dogs/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      })
      
      const savedDog = res?.dog || res?.data || res
      if (!savedDog?._id) throw new Error()

      setDogs(prev => 
        editingDog 
          ? prev.map(d => d._id === savedDog._id ? savedDog : d)
          : [...prev, savedDog]
      )

      ShowPopup(`Dog ${editingDog ? 'updated' : 'added'} successfully`)
      closeModal()
    } catch {
      ShowPopup('Failed to save dog', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDog?._id) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/dogs/${selectedDog._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setDogs(prev => prev.filter(d => d._id !== selectedDog._id))
      ShowPopup('Dog deleted successfully')
      setDeleteModal(false)
    } catch {
      ShowPopup('Failed to delete', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setPage(1)
  }, [clearFilters, setPage])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className='admin-dogs'>
      <h1 className='admin-dogs-h1'>Admin Dog Dashboard</h1>

      <div className='admin-tabs'>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} 
          onClick={() => navigate('/admin-products')}
        >Products</button>
        <button 
          className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} 
          onClick={() => navigate('/admin-dogs')}
        >Dogs</button>
      </div>

      <SearchBar value={search} onChange={handleSearchChange} placeholder='Search dogs...' />
      
      <FilterControls 
        energy={energy} setEnergy={(val) => { setEnergy(val); setPage(1); }}
        playfulness={playfulness} setPlayfulness={(val) => { setPlayfulness(val); setPage(1); }}
        clearFilters={handleClearFilters} 
      />

      <AlphabetFilter 
        lettersOpen={lettersOpen} 
        setLettersOpen={setLettersOpen}
        letter={letter}
        setLetter={(l) => { setLetter(l); setPage(1); }}
        setLoadedCount={setLoadedCount}
        ITEMS_PER_PAGE={8} 
      />

      <button className='admin-add-btn' onClick={() => openModal()}>+</button>

      {loading ? <DogLoader /> : error ? <p className="error">{error}</p> : (
        <>
          <div className='dog-list'>
            {visibleDogs.length ? visibleDogs.map(d => (
              <div key={d._id} className='admin-dog-card'>
                <img 
                  src={d.imageUrl || d.image_link || PLACEHOLDER} 
                  alt={d.name} 
                  className="dog-card-image" 
                />
                <div className='admin-dog-card-content'>
                  <h4 className="dog-card-title" style={{ fontSize: d.name.length > 22 ? "15px" : "18px" }}>
                    {d.name}
                  </h4>
                  <div className='admin-dog-card-buttons'>
                   <button type="button" onClick={() => openModal(d)}>
                                   <AiOutlineEdit size={18}/> Edit
                                 </button>
                                 <button type="button" onClick={() => openDeleteModal(d)}>
                                   <AiOutlineDelete size={18}/> Delete
                                 </button>
                  </div>
                </div>
              </div>
            )) : <p className='no-dogs'>No dogs found.</p>}
          </div>

          {totalPages > 1 && (
            <div className='pagination-container'>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                goPrev={prevPage}
                goNext={nextPage}
              />
            </div>
          )}
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
        onClose={() => setDeleteModal(false)} 
        onConfirm={handleDelete} 
        isDeleting={isDeleting} 
        itemName={selectedDog?.name} 
      />
      <Footer openModal={() => openModal()} />
    </div>
  )
}

export default AdminDogs