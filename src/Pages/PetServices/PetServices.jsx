import './PetServices.css'
import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '../../components/apiFetch'


const SERVICE_TYPES = [
  { label: 'Vets',        value: 'veterinary_care', icon: '🏥' },
  { label: 'Groomers',    value: 'pet_store',        icon: '✂️' },
  { label: 'Pet Food',    value: 'pet_store',        icon: '🦴' },
  { label: 'Accessories', value: 'pet_store',        icon: '🛍️' },
  { label: 'Parks',       value: 'park',             icon: '🌳' },
]

export default function PetServices() {
  const [coords, setCoords] = useState(null)
  const [manualLocation, setManualLocation] = useState('')
  const [activeService, setActiveService] = useState(SERVICE_TYPES[0])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationName, setLocationName] = useState('')
  const mapRef = useRef(null)
  const googleMapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setCoords({ lat: coords.latitude, lng: coords.longitude })
        setLocationName('your current location')
      },
      () => setError('Could not get location. Please enter one manually.')
    )
  }, [])

  useEffect(() => {
    if (coords) fetchServices()
  }, [coords, activeService])

  useEffect(() => {
    if (coords && window.google) initMap()
  }, [coords])

  useEffect(() => {
    if (googleMapRef.current && results.length > 0) updateMarkers()
  }, [results])

  const initMap = () => {
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 13,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
    })

    new window.google.maps.Marker({
      position: coords,
      map: googleMapRef.current,
      title: 'You are here',
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#4f46e5', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }
    })
  }

  const updateMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    results.forEach((place, i) => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: googleMapRef.current,
        title: place.name,
        label: { text: String(i + 1), color: 'white', fontWeight: 'bold' }
      })
      markersRef.current.push(marker)
    })

    if (results.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(coords)
      results.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }))
      googleMapRef.current.fitBounds(bounds)
    }
  }

 const fetchServices = async () => {
  if (!coords) return
  setLoading(true)
  setError(null)
  try {
    const data = await apiFetch(`/popup/services?lat=${coords.lat}&lng=${coords.lng}&type=${activeService.value}`)
    setResults(Array.isArray(data) ? data : [])
  } catch {
    setError('Failed to load results')
    setResults([])
  } finally {
    setLoading(false)
  }
}

  const handleManualSearch = async () => {
    if (!manualLocation.trim()) return
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
      )
      const data = await res.json()
      const loc = data.results?.[0]?.geometry?.location
      if (!loc) return setError('Location not found')
      setCoords({ lat: loc.lat, lng: loc.lng })
      setLocationName(manualLocation)
      if (window.google) initMap()
    } catch {
      setError('Could not geocode location')
    }
  }

  return (
    <div className="pet-services">
      <h1>🐾 Pet Services Near You</h1>

      <div className="location-bar">
        <input
          type="text"
          placeholder="Enter a location..."
          value={manualLocation}
          onChange={e => setManualLocation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
          className="location-input"
        />
        <button onClick={handleManualSearch} className="location-btn">Search</button>
        <button onClick={() => navigator.geolocation?.getCurrentPosition(
          ({ coords: c }) => { setCoords({ lat: c.latitude, lng: c.longitude }); setLocationName('your current location') }
        )} className="location-btn secondary">📍 Use My Location</button>
      </div>

      <div className="service-tabs">
        {SERVICE_TYPES.map(s => (
          <button
            key={s.value + s.label}
            className={`service-tab ${activeService.label === s.label ? 'active' : ''}`}
            onClick={() => setActiveService(s)}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div ref={mapRef} className="services-map" />

      {locationName && (
        <p className="results-label">
          Top 3 <strong>{activeService.label}</strong> near <strong>{locationName}</strong>
        </p>
      )}

      {loading && <p className="services-loading">Finding {activeService.label}...</p>}
      {error && <p className="services-error">{error}</p>}

      <div className="services-cards">
        {results.map((place, i) => (
          <a
            key={place.placeId}
            href={`https://www.google.com/maps/place/?q=place_id:${place.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="service-card"
          >
            <span className="service-number">{i + 1}</span>
            <div className="service-info">
              <span className="service-name">{place.name}</span>
              <span className="service-address">{place.address}</span>
              {place.openNow !== undefined && (
                <span className={`service-open ${place.openNow ? 'open' : 'closed'}`}>
                  {place.openNow ? '● Open now' : '● Closed'}
                </span>
              )}
            </div>
            <div className="service-meta">
              {place.rating && <span className="service-rating">⭐ {place.rating}</span>}
              {place.totalRatings && <span className="service-reviews">({place.totalRatings})</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}