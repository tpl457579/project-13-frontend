import './AdminAnimals.css';
import { useRef, useEffect, useState } from 'react';
import { useDogs } from '../../Hooks/useDogs';
import { useCats } from '../../Hooks/useCats';
import { useDogFilters } from '../../Hooks/useDogFilters';
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
import AdminAnimalCard from '../../components/AdminAnimalCard/AdminAnimalCard';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import AnimalForm from '../../components/AnimalForm/AnimalForm';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

const ITEMS_PER_PAGE = 8;

const AdminAnimals = ({ type = 'dog' }) => {
  const isDog = type === 'dog';
  const label = isDog ? 'dog' : 'cat';

  const dashboardRef = useRef(null);
  const [lettersOpen, setLettersOpen] = useState(false);

  const { dogs, setDogs, loading: dogsLoading, error: dogsError } = useDogs();
  const { cats, setCats, loading: catsLoading, error: catsError } = useCats();

  const animals = isDog ? dogs : cats;
  const setAnimals = isDog ? setDogs : setCats;
  const loading = isDog ? dogsLoading : catsLoading;
  const error = isDog ? dogsError : catsError;

  const {
    editingItem,
    showModal,
    deleteModal,
    setDeleteModal,
    selectedItem,
    isSubmitting,
    setIsSubmitting,
    isDeleting,
    setIsDeleting,
    openModal,
    closeModal,
    openDeleteModal,
  } = useAdminActions(dashboardRef);

  const dogFilters = useDogFilters(isDog ? animals : []);
  const catFilters = useCatFilters(!isDog ? animals : []);

  const { search, setSearch, letter, setLetter, setLoadedCount, clearFilters } = isDog ? dogFilters : catFilters;
  const size = isDog ? dogFilters.size : null;
  const setSize = isDog ? dogFilters.setSize : null;
  const filteredAnimals = isDog ? dogFilters.filteredDogs : catFilters.filteredCats;

  const storageKey = `admin_${label}s`;

  const {
    paginatedData: visibleAnimals,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredAnimals, ITEMS_PER_PAGE, `${storageKey}_page`);

  const handleCloseAll = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    closeModal();
    setDeleteModal(false);
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`${storageKey}_scroll`);
    if (savedScroll && !loading && visibleAnimals.length > 0) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem(`${storageKey}_scroll`, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleAnimals.length, storageKey]);

  const handleSave = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/${label}s/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: payload
      });
      const saved = res?.[label] || res?.data || res;
      setAnimals(prev => editingItem
        ? prev.map(a => a._id === saved._id ? saved : a)
        : [...prev, saved]);
      ShowPopup(`${isDog ? 'Dog' : 'Cat'} ${editingItem ? 'updated' : 'added'} successfully`);
      handleCloseAll();
    } catch {
      ShowPopup(`Failed to save ${label}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem?._id) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/${label}s/${selectedItem._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnimals(prev => prev.filter(a => a._id !== selectedItem._id));
      ShowPopup(`${isDog ? 'Dog' : 'Cat'} deleted successfully`);
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
    sessionStorage.removeItem(`${storageKey}_scroll`);
    sessionStorage.setItem(`${storageKey}_page`, '1');
    window.scrollTo(0, 0);
  };

  return (
    <AdminLayout
      title={`Admin ${isDog ? 'Dog' : 'Cat'} Dashboard`}
      dashboardRef={dashboardRef}
      onAddClick={() => openModal()}
      searchBar={
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={`Search ${label}s...`}
        />
      }
      filterControls={
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <FilterControls
            {...(isDog ? { size, setSize: (val) => { setSize(val); setPage(1); } } : {})}
            clearFilters={handleClearAll}
          />
          <p className="resultsText" style={{ margin: '15px 0' }}>
            Showing {visibleAnimals.length} of {filteredAnimals.length} {label}s
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
          {visibleAnimals.length === 0 ? (
            <p className="resultsText">No {label} breeds match your search.</p>
          ) : (
            <div className={`admin-${label}-grid`}>
              {visibleAnimals.map((animal) => (
                <AdminAnimalCard
                  key={animal._id}
                  animal={animal}
                  type={type}
                  onEdit={openModal}
                  onDelete={openDeleteModal}
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
          <AnimalForm
            type={type}
            initialData={editingItem || {}}
            isSubmitting={isSubmitting}
            onCancel={handleCloseAll}
            onSubmit={handleSave}
          />
        </Modal>
      )}

      <DeleteModal
        isOpen={deleteModal}
        onClose={handleCloseAll}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedItem?.name}
      />
    </AdminLayout>
  );
};

export default AdminAnimals;