import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Modal from '../Modal/Modal.jsx'
import Button from '../Buttons/Button.jsx'
import './VetClinicPopup.css'

const VET_PAGES = [
  '/dog-search',
  '/cat-search',
]

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

export default function VetClinicPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()

  const handleClose = () => {
    sessionStorage.setItem('vetPopupShown', 'true')
    setIsOpen(false)
  }

  useEffect(() => {
  if (!VET_PAGES.includes(location.pathname)) return
  if (sessionStorage.getItem('vetPopupShown') === 'true') return

  const timer = setTimeout(() => {
    fetchNearbyClinics()
  }, 15000)

  return () => clearTimeout(timer)
}, [location.pathname])

  const fetchNearbyClinics = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setIsOpen(true)
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=veterinary_care&key=${GOOGLE_API_KEY}`
          )
          const data = await res.json()
          const top3 = (data.results || []).slice(0, 3).map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            placeId: place.place_id
          }))
          setClinics(top3)
        } catch {
          setError('Could not load clinics')
        } finally {
          setLoading(false)
          setIsOpen(true)
        }
      },
      () => {
        setError('Location access denied')
        setLoading(false)
        setIsOpen(true)
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="popup-container">
        <div className="vet-clinic-popup" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close-btn" onClick={handleClose}>×</button>

          <div className="popup-icon">
            <span>🏥</span>
          </div>

          <h2 className="popup-title">Vet Clinics Near You</h2>
          <p className="popup-subtitle">Top-rated veterinary clinics in your area</p>

          {loading && <p className="vet-loading">Finding clinics near you...</p>}
          {error && <p className="vet-error">{error}</p>}

          {!loading && !error && clinics.length > 0 && (
            <div className="clinic-list">
              {clinics.map((clinic) => (
                <a
                  key={clinic.placeId}
                  href={`https://www.google.com/maps/place/?q=place_id:${clinic.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clinic-card"
                >
                  <div className="clinic-info">
                    <span className="clinic-name">{clinic.name}</span>
                    <span className="clinic-address">{clinic.address}</span>
                  </div>
                  {clinic.rating && (
                    <span className="clinic-rating">⭐ {clinic.rating}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          {!loading && !error && clinics.length === 0 && (
            <p className="vet-error">No clinics found nearby.</p>
          )}

          <Button variant="primary" className="cta-button" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}