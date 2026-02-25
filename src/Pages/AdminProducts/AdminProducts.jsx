import './AdminProducts.css'
import { useRef, useEffect, useState, useMemo } from 'react';
import { useProducts } from '../../Hooks/useProducts';
import { useFilters } from '../../Hooks/useFilters';
import { usePagination } from '../../Hooks/usePagination';
import { useAdminActions } from '../../Hooks/useAdminActions';
import { apiFetch } from '../../components/apiFetch';
import ShowPopup from '../../components/ShowPopup/ShowPopup';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterControls from '../../FilterControls/FilterControls';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductForm from '../../components/ProductForm/ProductForm';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

const AdminProducts = () => {
  const dashboardRef = useRef(null);
  const { products, setProducts, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const {
    editingItem: editingProduct,
    showModal, closeModal,
    deleteModal, setDeleteModal,
    selectedItem: selectedProduct,
    isSubmitting, setIsSubmitting,
    isDeleting, setIsDeleting,
    openModal, openDeleteModal,
    handleFullscreen
  } = useAdminActions(dashboardRef);

  const { searchTerm, setSearchTerm, size, setSize, maxPrice, setMaxPrice, minRating, setMinRating, filteredProducts, clearFilters } = useFilters(products, null, "admin");

  const categoryFilteredProducts = useMemo(() => {
    if (activeCategory === 'All') return filteredProducts;
    return filteredProducts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [filteredProducts, activeCategory]);

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(categoryFilteredProducts, 8, 'admin_products_page');

  const handleCloseAll = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    closeModal();
    setDeleteModal(false);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('admin_products_scroll');
    if (savedScroll && !loading && visibleProducts.length > 0) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem('admin_products_scroll', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleProducts.length]);

  const handleSaveProduct = async (formData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = editingProduct ? { ...formData, _id: editingProduct._id } : formData
      
      const res = await apiFetch('/products/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      });

      const savedProduct = res?.product || res?.data || res;
      if (!savedProduct?._id) throw new Error();

      setProducts(prev => 
        editingProduct 
          ? prev.map(p => p._id === savedProduct._id ? savedProduct : p)
          : [...prev, savedProduct]
      );

      ShowPopup(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
      handleCloseAll();
    } catch {
      ShowPopup('Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?._id) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await apiFetch(`/products/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== selectedProduct._id));
      ShowPopup('Product deleted successfully');
      handleCloseAll();
    } catch {
      ShowPopup('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = () => {
    clearFilters();
    setActiveCategory('All');
    setPage(1);
    sessionStorage.removeItem('admin_products_scroll');
    sessionStorage.setItem('admin_products_page', '1');
    window.scrollTo(0, 0);
  };

  return (
    <AdminLayout 
      title="Admin Product Dashboard"
      dashboardRef={dashboardRef}
      onLayoutClick={handleFullscreen}
      onAddClick={() => openModal()}
      searchBar={
        <>
          <div className="category-tabs">
            {['All', 'Toys', 'Food', 'Clothing'].map(cat => (
              <button 
                key={cat} 
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
            placeholder='Search products...' 
          />
        </>
      }
      filterControls={
        <div className="admin-filter-wrapper">
          <FilterControls
            size={size}
            setSize={(val) => { setSize(val); setPage(1); }}
            maxPrice={maxPrice}
            setMaxPrice={(val) => { setMaxPrice(val); setPage(1); }}
            minRating={minRating}
            setMinRating={(val) => { setMinRating(val); setPage(1); }}
            clearFilters={handleClearAll}
            mode="admin"
          />
          <p className="results-text">
            Showing {visibleProducts.length} of {categoryFilteredProducts.length} items
          </p>
        </div>
      }
    >
      {loading ? <Loader /> : error ? <p className="error">{error}</p> : (
        <>
          <div className="admin-product-grid">
            {visibleProducts.length ? visibleProducts.map(p => (
              <ProductCard 
                key={p._id}
                product={p}
                showAdminActions={true}
                showHeart={false}
                onEdit={() => openModal(p)}
                onDelete={() => openDeleteModal(p)}
              />
            )) : <p>No products found in this category.</p>}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              goPrev={prevPage}
              goNext={nextPage}
            />
          )}
        </>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseAll}>
          <ProductForm 
            initialData={editingProduct || {}} 
            isSubmitting={isSubmitting} 
            onCancel={handleCloseAll} 
            onSubmit={handleSaveProduct} 
          />
        </Modal>
      )}

      <DeleteModal 
        isOpen={deleteModal}
        onClose={handleCloseAll}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedProduct?.name}
      />
    </AdminLayout>
  );
};

export default AdminProducts;