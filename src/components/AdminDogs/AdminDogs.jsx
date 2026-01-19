import { useState, useEffect } from 'react'
import DogForm from '../../components/DogForm/DogForm'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/Buttons/Button'
import Spinner from '../../components/Spinner/Spinner'
import { showPopup } from '../../components/ShowPopup/ShowPopup'
import './AdminDogs.css'

const PLACEHOLDER = './assets/images/placeholder.png'

export default function AdminDogs() {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDog, setEditingDog] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDog, setDeleteDog] = useState(null)

  const fetchDogs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('https://project-13-backend-1sra.onrender.com/api/v1/dogs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setDogs(Array.isArray(data) ? data : data.dogs || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch dogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [])

  const openModal = (dog = null) => {
    setEditingDog(dog)
    setShowModal(true)
    setIsSubmitting(false)
  }

  const closeModal = () => {
    setEditingDog(null)
    setShowModal(false)
  }

  const handleAddEditDog = async (dogData) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const method = dogData._id ? 'PUT' : 'POST'
      const url = dogData._id
        ? `https://project-13-backend-1sra.onrender.com/api/v1/dogs/${dogData._id}`
        : 'https://project-13-backend-1sra.onrender.com/api/v1/dogs'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(dogData)
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const savedDog = await res.json()

      if (dogData._id) {
        setDogs((prev) => prev.map((d) => (d._id === savedDog._id ? savedDog : d)))
        showPopup('Dog updated successfully')
      } else {
        setDogs((prev) => [...prev, savedDog])
        showPopup('Dog added successfully')
      }
      closeModal()
    } catch (err) {
      showPopup(err.message || 'Failed to save dog', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteModal = (dog) => {
    setDeleteDog(dog)
    setIsDeleting(false)
  }

  const closeDeleteModal = () => {
    setDeleteDog(null)
  }

  const handleDeleteDog = async () => {
    if (!deleteDog) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`https://project-13-backend-1sra.onrender.com/api/v1/dogs/${deleteDog._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      setDogs((prev) => prev.filter((d) => d._id !== deleteDog._id))
      showPopup('Dog deleted successfully')
      closeDeleteModal()
    } catch (err) {
      showPopup(err.message || 'Failed to delete dog', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='admin-dogs'>
      <div className='admin-dogs-header'>
        <h2>Dogs</h2>
        <Button onClick={() => openModal()}>Add Dog</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p>{error}</p>
      ) : dogs.length === 0 ? (
        <p>No dogs found.</p>
      ) : (
        <div className='dog-card-list'>
          {dogs.map((dog) => (
            <div className='dog-card' key={dog._id}>
              <img src={dog.image_link || PLACEHOLDER} alt={dog.name} onError={(e) => (e.target.src = PLACEHOLDER)} />
              <h3>{dog.name}</h3>
              <p><strong>Weight:</strong> {dog.weight}</p>
              <p><strong>Height:</strong> {dog.height}</p>
              <p><strong>Life Span:</strong> {dog.life_span}</p>
              <p><strong>Temperament:</strong> {dog.temperament}</p>
              <p><strong>Good with children:</strong> {dog.good_with_children}</p>
              <p><strong>Good with other dogs:</strong> {dog.good_with_other_dogs}</p>
              <p><strong>Shedding:</strong> {dog.shedding}</p>
              <p><strong>Grooming:</strong> {dog.grooming}</p>
              <p><strong>Good with strangers:</strong> {dog.good_with_strangers}</p>
              <p><strong>Playfulness:</strong> {dog.playfulness}</p>
              <p><strong>Protectiveness:</strong> {dog.protectiveness}</p>
              <p><strong>Energy:</strong> {dog.energy}</p>
              <div className='dog-card-buttons'>
                <Button onClick={() => openModal(dog)}>Edit</Button>
                <Button onClick={() => openDeleteModal(dog)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <DogForm initialData={editingDog || {}} onSubmit={handleAddEditDog} onCancel={closeModal} isSubmitting={isSubmitting} />
        </Modal>
      )}

      {deleteDog && (
        <Modal isOpen={!!deleteDog} onClose={closeDeleteModal}>
          <div className='delete-modal-content'>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteDog.name}</strong>?</p>
            <div className='modal-buttons'>
              <Button variant='secondary' onClick={handleDeleteDog} loading={isDeleting} loadingText='Deleting' showSpinner>Delete</Button>
              <Button variant='primary' onClick={closeDeleteModal}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
