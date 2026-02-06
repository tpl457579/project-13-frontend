import './AdminProducts.css'
import { useRef } from 'react';
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
import DogLoader from '../../components/DogLoader/DogLoader';
import Modal from '../../components/Modal/Modal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

const AdminProducts = () => {
  const dashboardRef = useRef(null);
  const { products, setProducts, loading, error } = useProducts();

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

  const {
    searchTerm, setSearchTerm,
    size, setSize,
    maxPrice, setMaxPrice,
    minRating, setMinRating,
    filteredProducts, clearFilters
  } = useFilters(products);

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredProducts, 8);

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
      closeModal();
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
      setDeleteModal(false);
    } catch {
      ShowPopup('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout 
      title="Admin Product Dashboard"
      dashboardRef={dashboardRef}
      onLayoutClick={handleFullscreen}
      onAddClick={() => openModal()}
      searchBar={
        <SearchBar 
          value={searchTerm} 
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
          placeholder='Search products...' 
        />
      }
      filterControls={
        <FilterControls 
          size={size} setSize={(val) => { setSize(val); setPage(1); }}
          maxPrice={maxPrice} setMaxPrice={(val) => { setMaxPrice(val); setPage(1); }}
          minRating={minRating} setMinRating={(val) => { setMinRating(val); setPage(1); }}
          clearFilters={() => { clearFilters(); setPage(1); }} 
        />
      }
    >
     
      {loading ? <DogLoader /> : error ? <p className="error">{error}</p> : (
        <>
          <div className='card-list'>
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
    </AdminLayout>
  );
};

export default AdminProducts;