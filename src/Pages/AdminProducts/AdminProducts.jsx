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

  const [editingProduct, setEditingProduct] = useState(null)
  const [editingDog, setEditingDog] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDog, setSelectedDog] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [addTypeModal, setAddTypeModal] = useState(false)
  const [addType, setAddType] = useState(null)
  const [activeTab, setActiveTab] = useState('products')

  const [currentDogPage, setDogPage] = useState(1)
  const dogsPerPage = 8
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
    totalPages: totalProductPages,
    currentPage: currentProductPage,
    setPage: setProductPage
  } = usePagination(filteredProducts, 8)

  useEffect(() => {
    setProductPage(1)
  }, [searchTerm, size, maxPrice, minRating, setProductPage])

  useEffect(() => {
    async function fetchDogs() {
      try {
        const res = await apiFetch('/dogs')
        const data = res?.dogs || res?.data || res
        setDogs(Array.isArray(data) ? data : [])
      } catch {
        setDogsError('Failed to fetch dogs')
      } finally {
        setDogsLoading(false)
      }
    }
    fetchDogs()
  }, [])

  const openModal = useCallback((item = null, type) => {
    setAddType(type)
    if (type === 'product') setEditingProduct(item)
    if (type === 'dog') setEditingDog(item)
    setIsSubmitting(false)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setEditingDog(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((item, type) => {
    if (type === 'product') setSelectedProduct(item)
    if (type === 'dog') setSelectedDog(item)
    setDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setSelectedProduct(null)
    setSelectedDog(null)
    setDeleteModal(false)
  }, [])

  const handleSaveProduct = useCallback(
    async ({ name, price, rating, description = '', imageUrl, publicId, url }) => {
      const payload = {
        ...(editingProduct ? { _id: editingProduct._id } : {}),
        name,
        rating,
        price,
        description,
        imageUrl,
        publicId,
        url
      }
      try {
        const token = localStorage.getItem('token')
        const res = await apiFetch('/products/save', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        })
        const product = res?.product || res?.data || res
        setIsSubmitting(true)
        if (!product?._id) {
          showPopup('Failed to save product', 'error')
          return
        }
        if (editingProduct && editingProduct._id) {
          setProducts((prev) => prev.map((p) => (p._id === product._id ? product : p)))
          showPopup('Product edited successfully')
        } else {
          setProducts((prev) => [...prev, product])
          showPopup('Product added successfully')
        }
        closeModal()
      } catch {
        showPopup('Failed to save product', 'error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [editingProduct, closeModal, setProducts]
  )

  const handleSaveDog = async (dogData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch('/dogs/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: { ...(editingDog ? { _id: editingDog._id } : {}), ...dogData }
      })
      const dog = res?.dog || res?.data || res
      if (!dog?._id) {
        showPopup('Failed to save dog', 'error')
        return
      }
      if (editingDog) {
        setDogs((prev) => prev.map((d) => (d._id === dog._id ? dog : d)))
        showPopup('Dog updated successfully')
      } else {
        setDogs((prev) => [...prev, dog])
        showPopup('Dog added successfully')
      }
      closeModal()
    } catch {
      showPopup('Failed to save dog', 'error')
    }
  }

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (selectedProduct?._id) {
        await apiFetch(`/products/${selectedProduct._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id))
        showPopup('Product deleted successfully')
      }
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
  }, [selectedProduct, selectedDog, setProducts, closeDeleteModal])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setProductPage(1)
  }, [clearFilters, setProductPage])

  const paginatedDogs = dogs.slice(
    (currentDogPage - 1) * dogsPerPage,
    currentDogPage * dogsPerPage
  )
  const totalDogPages = Math.ceil(dogs.length / dogsPerPage)

  return (
    <div className='admin-products'>
      <h1>Admin Dashboard</h1>

      <div className='admin-tabs'>
        <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} onClick={() => setActiveTab('dogs')}>Dogs</button>
      </div>

      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search products...' />
      <FilterControls size={size} setSize={setSize} maxPrice={maxPrice} setMaxPrice={setMaxPrice} minRating={minRating} setMinRating={setMinRating} clearFilters={handleClearFilters} />
      <button className='admin-add-btn' onClick={() => setAddTypeModal(true)}>+</button>

      {activeTab === 'products' && (
        <>
          {loading ? <DogLoader /> : error ? <p>{error}</p> : (
            <>
              <div className='product-list'>
                {visibleProducts.length ? visibleProducts.map(p => (
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
              <div className='product-page'>
                <PaginationControls
                  currentPage={currentProductPage}
                  totalPages={totalProductPages}
                  goPrev={() => setProductPage(Math.max(currentProductPage - 1, 1))}
                  goNext={() => setProductPage(Math.min(currentProductPage + 1, totalProductPages))}
                />
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'dogs' && (
        <>
          {dogsLoading ? <DogLoader /> : dogsError ? <p>{dogsError}</p> : (
            <>
              <div className='product-list'>
                {paginatedDogs.length ? paginatedDogs.map(dog => (
                  <div key={dog._id} className='admin-dog-card'>
                    <img className='admin-dog-card-img' src={dog.image_link || PLACEHOLDER} alt={dog.name} onError={e => e.target.src = PLACEHOLDER} />
                    <div className='admin-product-card-info'>
                      <h4>{dog.name}</h4>
                      {dog.weight && <p><strong>Weight:</strong> {dog.weight}</p>}
                      {dog.height && <p><strong>Height:</strong> {dog.height}</p>}
                      {dog.temperament && <p><strong>Temperament:</strong> {Array.isArray(dog.temperament) ? dog.temperament.join(', ') : dog.temperament}</p>}

                      <button className='toggle-details-btn' onClick={() => setDogDetailsOpen(prev => ({ ...prev, [dog._id]: !prev[dog._id] }))}>
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
              <div className='dog-page'>
                <PaginationControls
                  currentPage={currentDogPage}
                  totalPages={totalDogPages}
                  goPrev={() => setDogPage(Math.max(currentDogPage - 1, 1))}
                  goNext={() => setDogPage(Math.min(currentDogPage + 1, totalDogPages))}
                />
              </div>
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
            <ProductForm initialData={editingProduct || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveProduct} />
          ) : (
            <DogForm initialData={editingDog || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveDog} />
          )}
        </Modal>
      )}

      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={closeDeleteModal}>
          <div className='delete-modal-content'>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{selectedProduct?.name || selectedDog?.name}</strong>?</p>
            <div className='modal-buttons'>
              <Button onClick={handleDelete} loading={isDeleting} loadingText='Deleting' showSpinner>Delete</Button>
              <Button onClick={closeDeleteModal}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      <Footer openModal={() => setAddTypeModal(true)} />
    </div>
  )
}

export default AdminProducts
