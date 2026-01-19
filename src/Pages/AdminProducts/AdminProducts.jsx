import { useState, useCallback, useEffect } from 'react'
import { useProducts } from '../../Hooks/useProducts'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFilters } from '../../Hooks/useFilters.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import { usePagination } from '../../Hooks/usePagination.js'
import ProductForm from '../../components/ProductForm/ProductForm'
import DogForm from '../../components/DogForm/DogForm.jsx'
import DogLoader from '../../components/DogLoader/DogLoader'
import './AdminProducts.css'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { apiFetch } from '../../components/apiFetch.js'
import { Footer } from '../../components/Footer/Footer.jsx'

const PLACEHOLDER = './assets/images/placeholder.png'

const AdminProducts = () => {
  const { products, setProducts, loading, error } = useProducts()
  const [dogs, setDogs] = useState([])
  const [dogsLoading, setDogsLoading] = useState(true)
  const [dogsError, setDogsError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [addTypeModal, setAddTypeModal] = useState(false)
  const [addType, setAddType] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
  const [searchDogsTerm, setSearchDogsTerm] = useState('')
  const [dogDetailsOpen, setDogDetailsOpen] = useState({})

  const {
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredProducts,
    clearFilters
  } = useFilters(products)

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    setPage
  } = usePagination(filteredProducts, 8)

  const filteredDogs = dogs.filter((dog) =>
    dog.name.toLowerCase().includes(searchDogsTerm.toLowerCase())
  )

  const {
    paginatedData: visibleDogs,
    totalPages: dogTotalPages,
    currentPage: dogCurrentPage,
    setPage: setDogPage
  } = usePagination(filteredDogs, 8)

  useEffect(() => { setPage(1) }, [searchTerm, size, maxPrice, minRating, setPage])
  useEffect(() => { setDogPage(1) }, [searchDogsTerm, setDogPage])

  useEffect(() => {
    async function fetchDogs() {
      setDogsLoading(true)
      try {
        const res = await apiFetch('/dogs')
        setDogs(Array.isArray(res?.dogs) ? res.dogs : [])
      } catch (e) {
        setDogsError('Failed to fetch dogs')
      } finally {
        setDogsLoading(false)
      }
    }
    fetchDogs()
  }, [])

  const openModal = useCallback((item = null, type = 'product') => {
    setEditingItem(item)
    setIsSubmitting(false)
    setAddType(type)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingItem(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((item, type = 'product') => {
    setSelectedItem({ ...item, type })
    setDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setSelectedItem(null)
    setDeleteModal(false)
  }, [])

  const handleSaveProduct = useCallback(
    async ({ name, price, rating, description = '', imageUrl, publicId, url }) => {
      const payload = { ...(editingItem ? { _id: editingItem._id } : {}), name, rating, price, description, imageUrl, publicId, url }
      try {
        const token = localStorage.getItem('token')
        const res = await apiFetch('/products/save', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        })
        const product = res?.product || res?.data || res
        setIsSubmitting(true)
        if (!product?._id) { showPopup('Failed to save product', 'error'); return }
        if (editingItem && editingItem._id) {
          setProducts((prev) => prev.map((p) => (p._id === product._id ? product : p)))
          showPopup('Product edited successfully')
        } else {
          setProducts((prev) => [...prev, product])
          showPopup('Product added successfully')
        }
        closeModal()
      } catch {
        showPopup('Failed to save product', 'error')
      } finally { setIsSubmitting(false) }
    },
    [editingItem, closeModal, setProducts]
  )

  const handleSaveDog = async (dogData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch('/dogs/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: dogData
      })
      setDogs((prev) => [...prev, res?.dog || dogData])
      showPopup('Dog added successfully')
      closeModal()
    } catch {
      showPopup('Failed to save dog', 'error')
    }
  }

  const handleDelete = useCallback(async () => {
    if (!selectedItem) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (selectedItem.type === 'product') {
        await apiFetch(`/products/${selectedItem._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setProducts((prev) => prev.filter((p) => p._id !== selectedItem._id))
      } else {
        await apiFetch(`/dogs/${selectedItem._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setDogs((prev) => prev.filter((d) => d._id !== selectedItem._id))
      }
      showPopup(`${selectedItem.type === 'product' ? 'Product' : 'Dog'} deleted successfully`)
      closeDeleteModal()
    } catch {
      showPopup('Failed to delete item', 'error')
    } finally { setIsDeleting(false) }
  }, [selectedItem, setProducts, closeDeleteModal])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setPage(1)
  }, [clearFilters, setPage])

  return (
    <div className='admin-products'>
      <h1>Admin Dashboard</h1>

      <div className='admin-tabs'>
        <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} onClick={() => setActiveTab('dogs')}>Dogs</button>
      </div>

      <button className='admin-add-btn' onClick={() => setAddTypeModal(true)}>+</button>

      {activeTab === 'products' && (
        <>
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search products...' />
          <FilterControls size={size} setSize={setSize} maxPrice={maxPrice} setMaxPrice={setMaxPrice} minRating={minRating} setMinRating={setMinRating} clearFilters={handleClearFilters} />
          {loading ? <DogLoader /> : error ? <p>{error}</p> : (
            <>
              <div className='product-list'>
                {visibleProducts.length ? visibleProducts.map((p) => (
                  <div key={p._id} className='admin-product-card'>
                    <img src={p.imageUrl || PLACEHOLDER} alt={p.name} />
                    <div className='admin-product-card-info'>
                      <a href={p.url} target='_blank' rel='noopener noreferrer'><h4>{p.name}</h4></a>
                      <p>€{Number(p.price || 0).toFixed(2)}</p>
                      {p.rating && <p>Rating: {p.rating} ⭐</p>}
                      <div className='admin-card-buttons'>
                        <Button onClick={() => openModal(p, 'product')}>Edit</Button>
                        <Button onClick={() => openDeleteModal(p, 'product')}>Delete</Button>
                      </div>
                    </div>
                  </div>
                )) : <p>No products found.</p>}
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} goPrev={() => setPage(currentPage - 1)} goNext={() => setPage(currentPage + 1)} />
            </>
          )}
        </>
      )}

      {activeTab === 'dogs' && (
  <>
    <SearchBar
      value={searchDogsTerm}
      onChange={(e) => setSearchDogsTerm(e.target.value)}
      placeholder='Search dogs...'
    />
    {dogsLoading ? (
      <DogLoader />
    ) : dogsError ? (
      <p>{dogsError}</p>
    ) : (
      <>
        <div className='product-list'>
          {visibleDogs.length ? visibleDogs.map((dog) => (
            <div key={dog._id} className='admin-dog-card'>
              <img
                src={dog.image_link || PLACEHOLDER}
                alt={dog.name}
                onError={(e) => (e.target.src = PLACEHOLDER)}
              />
              <div className='admin-product-card-info'>
                <h4>{dog.name}</h4>
                {dog.weight && <p><strong>Weight:</strong> {dog.weight}</p>}
                {dog.height && <p><strong>Height:</strong> {dog.height}</p>}
                {dog.temperament && <p><strong>Temperament:</strong> {dog.temperament}</p>}
                <button
                  className='toggle-details-btn'
                  onClick={() =>
                    setDogDetailsOpen(prev => ({ ...prev, [dog._id]: !prev[dog._id] }))
                  }
                >
                  {dogDetailsOpen[dog._id] ? 'Hide Details ▲' : 'Show Details ▼'}
                </button>
                {dogDetailsOpen[dog._id] && (
                  <div className='dog-details-scroll'>
                    {dog.life_span && <p><strong>Life Span:</strong> {dog.life_span}</p>}
                    {dog.good_with_children != null && <p><strong>Good with children:</strong> {dog.good_with_children}/10</p>}
                    {dog.good_with_other_dogs != null && <p><strong>Good with other dogs:</strong> {dog.good_with_other_dogs}/10</p>}
                    {dog.good_with_strangers != null && <p><strong>Good with strangers:</strong> {dog.good_with_strangers}/10</p>}
                    {dog.energy != null && <p><strong>Energy:</strong> {dog.energy}/10</p>}
                    {dog.playfulness != null && <p><strong>Playfulness:</strong> {dog.playfulness}/10</p>}
                    {dog.protectiveness != null && <p><strong>Protectiveness:</strong> {dog.protectiveness}/10</p>}
                    {dog.shedding != null && <p><strong>Shedding:</strong> {dog.shedding}/10</p>}
                    {dog.grooming != null && <p><strong>Grooming:</strong> {dog.grooming}/10</p>}
                  </div>
                )}
                <div className='admin-card-buttons'>
                  <Button onClick={() => openModal(dog, 'dog')}>Edit</Button>
                  <Button onClick={() => openDeleteModal(dog, 'dog')}>Delete</Button>
                </div>
              </div>
            </div>
          )) : <p>No dogs found.</p>}
        </div>
        <PaginationControls
          currentPage={dogCurrentPage}
          totalPages={dogTotalPages}
          goPrev={() => dogCurrentPage > 1 && setDogPage(dogCurrentPage - 1)}
          goNext={() => dogCurrentPage < dogTotalPages && setDogPage(dogCurrentPage + 1)}
        />
      </>
    )}
  </>
)}


      {addTypeModal && (
        <Modal isOpen={addTypeModal} onClose={() => setAddTypeModal(false)}>
          <div className='add-type-container'>
            <div className='add-type-modal'>
              <h3 className='admin-add-title'>Add New</h3>
              <div className='add-type-buttons'>
                <Button onClick={() => { setAddType('product'); setAddTypeModal(false); openModal(null, 'product') }}>Product</Button>
                <Button onClick={() => { setAddType('dog'); setAddTypeModal(false); setShowModal(true) }}>Dog</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          {addType === 'product' ? (
            <ProductForm initialData={editingItem || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveProduct} />
          ) : (
            <DogForm initialData={editingItem || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveDog} />
          )}
        </Modal>
      )}

      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={closeDeleteModal}>
          <div className='delete-modal-content'>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{selectedItem?.name}</strong>?</p>
            <div className='modal-buttons'>
              <Button variant='secondary' onClick={handleDelete} loading={isDeleting} loadingText='Deleting' showSpinner>Delete</Button>
              <Button variant='primary' onClick={closeDeleteModal}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      <Footer openModal={() => setAddTypeModal(true)} />
    </div>
  )
}

export default AdminProducts
