import './AdminCats.css';
import { useRef, useEffect, useState } from 'react';
import { useCats } from '../../Hooks/useCats';
import { useCatFilters } from '../../Hooks/useCatFilters';
import { usePagination } from '../../Hooks/usePagination';
import { useAdminActions } from '../../Hooks/useAdminActions';
import { apiFetch } from '../../components/apiFetch';
import ShowPopup from '../../components/ShowPopup/ShowPopup';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterControls from '../../FilterControls/FilterControls';
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import AdminCatCard from '../../components/AdminCatCard/AdminCatCard';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import CatForm from '../../components/CatForm/CatForm';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import IdeaBulb from '../../components/IdeaBulb/IdeaBulb';

const ITEMS_PER_PAGE = 8;

const AdminCats = () => {
  const dashboardRef = useRef(null);
  const { cats, setCats, loading, error } = useCats();
  const [lettersOpen, setLettersOpen] = useState(false);

  const {
    editingItem: editingCat,
    showModal,
    deleteModal,
    setDeleteModal,
    selectedItem: selectedCat,
    isSubmitting,
    setIsSubmitting,
    isDeleting,
    setIsDeleting,
    openModal,
    closeModal,
    openDeleteModal,
    handleFullscreen
  } = useAdminActions(dashboardRef);

  const {
    search, setSearch, letter, setLetter, setLoadedCount,
    size, setSize,
    filteredCats, clearFilters
  } = useCatFilters(cats);

  const {
    paginatedData: visibleCats,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredCats, ITEMS_PER_PAGE, 'admin_cats_page');

  const handleCloseAll = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    closeModal();
    setDeleteModal(false);
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('admin_cats_scroll');
    if (savedScroll && !loading && visibleCats.length > 0) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem('admin_cats_scroll', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleCats.length]);

  const handleSaveCat = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/cats/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: payload
      });
      const savedCat = res?.cat || res?.data || res;
      setCats(prev => editingCat
        ? prev.map(d => d._id === savedCat._id ? savedCat : d)
        : [...prev, savedCat]);
      ShowPopup(`Cat ${editingCat ? 'updated' : 'added'} successfully`);
      handleCloseAll();
    } catch {
      ShowPopup('Failed to save cat', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCat?._id) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/cats/${selectedCat._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCats(prev => prev.filter(d => d._id !== selectedCat._id));
      ShowPopup('Cat deleted successfully');
      handleCloseAll();
    } catch {
      ShowPopup('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = () => {
    clearFilters();
    setPage(1);
    setLettersOpen(false);
    sessionStorage.removeItem('admin_cats_scroll');
    sessionStorage.setItem('admin_cats_page', '1');
    window.scrollTo(0, 0);
  };

  return (
    <AdminLayout
      title="Admin Cat Dashboard"
      dashboardRef={dashboardRef}
      onLayoutClick={handleFullscreen}
      onAddClick={() => openModal()}
      searchBar={
        <SearchBar
          value={search}
          onChange={(e) => { 
            setSearch(e.target.value); 
            setPage(1);
          }}
          placeholder='Search cats...'
        />
      }
      filterControls={
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <FilterControls
            size={size}
            setSize={(val) => { 
                setSize(val); 
                setPage(1); 
            }}
            clearFilters={handleClearAll}
          />
          <IdeaBulb 
            tip="AdminCats" 
            storageKey="has_seen_admin_tip" 
            className="bulb-admin-filters" 
          />
          <p className="resultsText" style={{ margin: '15px 0' }}>
            Showing {visibleCats.length} of {filteredCats.length} cats
          </p>
        </div>
      }
      alphabetFilter={
        <AlphabetFilter
          lettersOpen={lettersOpen}
          setLettersOpen={setLettersOpen}
          letter={letter}
          setLetter={(val) => {
            setLetter(val);
            setPage(1);
          }}
          setLoadedCount={setLoadedCount}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        />
      }
    >
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {visibleCats.length === 0 ? (
            <p className="resultsText">No cat breeds match your search.</p>
          ) : (
            <div className="admin-cat-grid">
              {visibleCats.map((cat) => (
                <AdminCatCard
                  key={cat.id ?? cat._id}
                  cat={cat}
                  onEdit={() => openModal(cat)}
                  onDelete={() => openDeleteModal(cat)}
                />
              ))}
            </div>
          )}

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
          <CatForm
            initialData={editingCat || {}}
            isSubmitting={isSubmitting}
            onCancel={handleCloseAll}
            onSubmit={handleSaveCat}
          />
        </Modal>
      )}

      <DeleteModal
        isOpen={deleteModal}
        onClose={handleCloseAll}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedCat?.name}
      />
    </AdminLayout>
  );
};

export default AdminCats;
