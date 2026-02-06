import './AdminDogs.css'
import { useRef } from 'react';
import { useDogs } from '../../Hooks/useDogs';
import { useDogFilters } from '../../Hooks/useDogFilters';
import { usePagination } from '../../Hooks/usePagination';
import { useAdminActions } from '../../Hooks/useAdminActions';
import { apiFetch } from '../../components/apiFetch';
import ShowPopup from '../../components/ShowPopup/ShowPopup';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterControls from '../../FilterControls/FilterControls';
import AlphabetFilter from '../../components/AlphabetFilter/AlphabetFilter';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import AdminDogCard from '../../components/AdminDogCard/AdminDogCard';
import DogLoader from '../../components/DogLoader/DogLoader';
import Modal from '../../components/Modal/Modal';
import DogForm from '../../components/DogForm/DogForm';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

const AdminDogs = () => {
  const dashboardRef = useRef(null);
  const { dogs, setDogs, loading, error } = useDogs();
  
  const {
    editingItem: editingDog, 
    showModal, deleteModal, setDeleteModal,
    selectedItem: selectedDog,
    isSubmitting, setIsSubmitting,
    isDeleting, setIsDeleting,
    openModal, closeModal, openDeleteModal,
    handleFullscreen
  } = useAdminActions(dashboardRef);

  const {
    search, setSearch, letter, setLetter, setLoadedCount,
    energy, setEnergy, playfulness, setPlayfulness,
    filteredDogs, clearFilters
  } = useDogFilters(dogs);

  const {
    paginatedData: visibleDogs, totalPages, currentPage,
    nextPage, prevPage, setPage
  } = usePagination(filteredDogs, 8);

  const handleSaveDog = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/dogs/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: payload
      });
      const savedDog = res?.dog || res?.data || res;
      setDogs(prev => editingDog 
        ? prev.map(d => d._id === savedDog._id ? savedDog : d) 
        : [...prev, savedDog]);
      ShowPopup(`Dog ${editingDog ? 'updated' : 'added'} successfully`);
      closeModal();
    } catch {
      ShowPopup('Failed to save dog', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDog?._id) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/dogs/${selectedDog._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDogs(prev => prev.filter(d => d._id !== selectedDog._id));
      ShowPopup('Dog deleted successfully');
      setDeleteModal(false);
    } catch {
      ShowPopup('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout 
      title="Admin Dog Dashboard" 
      dashboardRef={dashboardRef}
      onLayoutClick={handleFullscreen}
      onAddClick={() => openModal()}
      searchBar={
        <SearchBar 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          placeholder='Search dogs...' 
        />
      }
      filterControls={
        <FilterControls 
          energy={energy} setEnergy={(val) => { setEnergy(val); setPage(1); }}
          playfulness={playfulness} setPlayfulness={(val) => { setPlayfulness(val); setPage(1); }}
          clearFilters={() => { clearFilters(); setPage(1); }} 
        />
      }
      alphabetFilter={
        <AlphabetFilter 
          letter={letter} setLetter={(l) => { setLetter(l); setPage(1); }}
          setLoadedCount={setLoadedCount} ITEMS_PER_PAGE={8} 
        />
      }
    >
     
      {loading ? <DogLoader /> : error ? <p className="error">{error}</p> : (
        <>
          <div className='card-list'>
            {visibleDogs.map(d => (
              <AdminDogCard key={d._id} dog={d} onEdit={openModal} onDelete={openDeleteModal} />
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationControls currentPage={currentPage} totalPages={totalPages} goPrev={prevPage} goNext={nextPage} />
          )}
        </>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <DogForm initialData={editingDog || {}} isSubmitting={isSubmitting} onCancel={closeModal} onSubmit={handleSaveDog} />
        </Modal>
      )}

      <DeleteModal 
        isOpen={deleteModal} onClose={() => setDeleteModal(false)} 
        onConfirm={handleDelete} isDeleting={isDeleting} itemName={selectedDog?.name} 
      />
    </AdminLayout>
  );
};

export default AdminDogs;