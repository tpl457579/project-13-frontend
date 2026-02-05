import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProducts } from '../../Hooks/useProducts'
import { useFilters } from '../../Hooks/useFilters.js'
import { usePagination } from '../../Hooks/usePagination.js'
import { apiFetch } from '../../components/apiFetch.js'
import ShowPopup from '../../components/ShowPopup/ShowPopup.js'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import ProductForm from '../../components/ProductForm/ProductForm'
import DogLoader from '../../components/DogLoader/DogLoader'
import ProductCard from '../../components/ProductCard/ProductCard'
import Modal from '../../components/Modal/Modal.jsx'
import DeleteModal from '../../components/DeleteModal/DeleteModal.jsx'
import { Footer } from '../../components/Footer/Footer.jsx'
import './AdminProducts.css'

const AdminProducts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dashboardRef = useRef(null)
  
  const { products, setProducts, loading, error } = useProducts()
  
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products'

  const {
    searchTerm, setSearchTerm,
    size, setSize,
    maxPrice, setMaxPrice,
    minRating, setMinRating,
    filteredProducts, clearFilters
  } = useFilters(products)

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredProducts, 8)

  const handleFullscreenLogic = () => {
    const isLandscape = window.innerHeight <= 520
    if (isLandscape && !document.fullscreenElement) {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {})
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
      
      if (dashboardRef.current) {
        dashboardRef.current.focus()
      }
    }
  }

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen()
      }
    }
  }, [])

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

  const handleSaveProduct = async (formData) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const payload = editingProduct ? { ...formData, _id: editingProduct._id } : formData
      const res = await apiFetch('/products/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      })
      const savedProduct = res?.product || res?.data || res
      if (!savedProduct?._id) throw new Error()
      setProducts(prev => 
        editingProduct 
          ? prev.map(p => p._id === savedProduct._id ? savedProduct : p)
          : [...prev, savedProduct]
      )
      ShowPopup(`Product ${editingProduct ? 'updated' : 'added'} successfully`)
      closeModal()
    } catch {
      ShowPopup('Failed to save product', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct?._id) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/products/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => prev.filter(p => p._id !== selectedProduct._id))
      ShowPopup('Product deleted successfully')
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

  return (
    <div 
      className='admin-products' 
      ref={dashboardRef} 
      tabIndex="-1"
      onClick={handleFullscreenLogic}
      style={{ outline: 'none' }}
    >
      <h1>Admin Product Dashboard</h1>

      <div className='admin-tabs'>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} 
          onClick={(e) => { e.stopPropagation(); navigate('/admin-products'); }}
        >Products</button>
        <button 
          className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} 
          onClick={(e) => { e.stopPropagation(); navigate('/admin-dogs'); }}
        >Dogs</button>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
        placeholder='Search products...' 
      />
      
      <FilterControls 
        size={size} setSize={(val) => { setSize(val); setPage(1); }}
        maxPrice={maxPrice} setMaxPrice={(val) => { setMaxPrice(val); setPage(1); }}
        minRating={minRating} setMinRating={(val) => { setMinRating(val); setPage(1); }}
        clearFilters={handleClearFilters} 
      />

      <button className='admin-add-btn' onClick={(e) => { e.stopPropagation(); openModal(); }}>+</button>

      {loading ? <DogLoader /> : error ? <p className="error">{error}</p> : (
        <>
          <div className='product-list'>
            {visibleProducts.length ? visibleProducts.map(p => (
              <ProductCard 
                key={p._id}
                product={p}
                showAdminActions={true}
                showHeart={false}
                onEdit={openModal}
                onDelete={openDeleteModal}
              />
            )) : <p>No products found.</p>}
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
          <ProductForm 
            initialData={editingProduct || {}} 
            isSubmitting={isSubmitting} 
            onCancel={closeModal} 
            onSubmit={handleSaveProduct} 
          />
        </Modal>
      )}

      <DeleteModal 
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedProduct?.name}
      />

      <Footer openModal={() => openModal()} />
    </div>
  )
}

export default AdminProducts