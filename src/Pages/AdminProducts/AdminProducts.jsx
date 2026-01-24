import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProducts } from '../../Hooks/useProducts'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFilters } from '../../Hooks/useFilters.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import { usePagination } from '../../Hooks/usePagination.js'
import ProductForm from '../../components/ProductForm/ProductForm'
import DogLoader from '../../components/DogLoader/DogLoader'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { apiFetch } from '../../components/apiFetch.js'
import { Footer } from '../../components/Footer/Footer.jsx'

import './AdminProducts.css'

const PLACEHOLDER = './assets/images/placeholder.png'

const AdminProducts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { products, setProducts, loading, error } = useProducts()
  
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products'

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

  const handleTabChange = (tab) => {
    if (tab === 'products') {
      navigate('/admin-products')
    } else {
      navigate('/admin-dogs')
    }
  }

  const openModal = useCallback((item = null) => {
    setEditingProduct(item)
    setIsSubmitting(false)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((item) => {
    setSelectedProduct(item)
    setDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setSelectedProduct(null)
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
      closeDeleteModal()
    } catch {
      showPopup('Failed to delete', 'error')
    } finally {
      setIsDeleting(false)
    }
  }, [selectedProduct, setProducts, closeDeleteModal])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setProductPage(1)
  }, [clearFilters, setProductPage])

  return (
    <div className='admin-products'>
      <h1>Admin Product Dashboard</h1>

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
        placeholder='Search products...' 
      />
      
      <FilterControls 
        size={size} 
        setSize={setSize} 
        maxPrice={maxPrice} 
        setMaxPrice={setMaxPrice} 
        minRating={minRating} 
        setMinRating={setMinRating} 
        clearFilters={handleClearFilters} 
      />

      <button className='admin-add-btn' onClick={() => openModal(null)}>+</button>

      {loading ? (
        <DogLoader />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className='product-list'>
            {visibleProducts.length ? visibleProducts.map(p => (
              <div key={p._id} className='admin-product-card'>
                <img src={p.imageUrl || PLACEHOLDER} alt={p.name} />
                <div className='admin-product-card-info'>
                  <a href={p.url} target='_blank' rel='noopener noreferrer'><h4>{p.name}</h4></a>
                  <p>€{Number(p.price || 0).toFixed(2)}</p>
                  {p.rating && <p>Rating: {p.rating} ⭐</p>}
                  <div className='admin-product-buttons'>
                    <Button onClick={() => openModal(p)}>Edit</Button>
                    <Button onClick={() => openDeleteModal(p)}>Delete</Button>
                  </div>
                </div>
              </div>
            )) : <p>No products found.</p>}
          </div>

          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <PaginationControls
                currentPage={currentProductPage}
                totalPages={totalProductPages}
                goPrev={() => setProductPage(prev => Math.max(prev - 1, 1))}
                goNext={() => setProductPage(prev => Math.min(prev + 1, totalProductPages))}
              />
            </div>
          </div>
        </>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <ProductForm 
            initialData={editingProduct || {}} 
            isSubmitting={isSubmitting} 
            onCancel={closeModal} 
            onSubmit={handleSaveProduct} 
          />
        </Modal>
      )}

      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={closeDeleteModal}>
          <div className='delete-modal-content'>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
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

export default AdminProducts