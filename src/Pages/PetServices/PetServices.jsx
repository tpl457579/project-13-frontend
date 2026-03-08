import './PetServices.css'
import { useState, useEffect, useRef } from 'react'
import { CiLocationOn } from "react-icons/ci"
import { LiaDirectionsSolid } from "react-icons/lia"
import { CiGlobe } from "react-icons/ci"
import { PiPhoneOutgoingThin } from "react-icons/pi"

const getLabels = () => {
  const lang = navigator.language?.slice(0, 2) || 'en'
  const translations = {
    en: ['Vets', 'Groomers', 'Pet Food', 'Accessories', 'Parks', 'Boarding', 'Trainers'],
    es: ['Veterinario', 'Peluquero Mascota', 'Comida para Mascotas', 'Accesorios para Mascotas', 'Parques para perros', 'Residencia Mascotas', 'Adiestradores'],
    fr: ['Vétérinaires', 'Toiletteurs', 'Nourriture pour Animaux', 'Accessoires', 'Parcs', 'Pension Animaux', 'Dresseurs'],
    de: ['Tierärzte', 'Tierpfleger', 'Tierfutter', 'Zubehör', 'Parks', 'Tierpension', 'Trainer'],
    it: ['Veterinari', 'Toelettatori', 'Cibo per Animali', 'Accessori', 'Parchi', 'Pensione Animali', 'Addestratori'],
    pt: ['Veterinários', 'Tosadores', 'Comida para Animais', 'Acessórios', 'Parques', 'Hotel Pet', 'Treinadores'],
    nl: ['Dierenartsen', 'Groomers', 'Dierenvoer', 'Accessoires', 'Parken', 'Dierenpension', 'Trainers'],
    pl: ['Weterynarze', 'Groomerzy', 'Karma dla Zwierząt', 'Akcesoria', 'Parki', 'Hotel dla Zwierząt', 'Trenerzy'],
  }
  return translations[lang] || translations.en
}

const [vets, groomers, food, accessories, parks, boarding, trainers] = getLabels()

const SERVICE_TYPES = [
  { label: vets,        value: 'veterinary_care', keyword: 'veterinary' },
  { label: groomers,    value: 'pet_store',        keyword: 'pet groomer' },
  { label: food,        value: 'pet_store',        keyword: 'pet food' },
  { label: accessories, value: 'pet_store',        keyword: 'pet accessories' },
  { label: parks,       value: 'park',             keyword: 'dog park' },
  { label: boarding,    value: 'lodging',          keyword: 'pet boarding kennel' },
  { label: trainers,    value: 'establishment',    keyword: 'dog trainer' },
]

export default function PetServices() {
  const [coords, setCoords] = useState(null)
  const [manualLocation, setManualLocation] = useState('Madrid')
  const [activeService, setActiveService] = useState(SERVICE_TYPES[0])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const mapRef = useRef(null)
  const googleMapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude })
        setLocationName('your current location')
      },
      () => setError('Could not get location. Please enter one manually.')
    )
  }, [])

  useEffect(() => {
    const waitForGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(waitForGoogle)
        if (coords) {
          initMap(coords)
        } else {
          const madridCoords = { lat: 40.4168, lng: -3.7038 }
          setLocationName('Madrid')
          initMap(madridCoords)
        }
      }
    }, 100)
    return () => clearInterval(waitForGoogle)
  }, [coords])

  useEffect(() => {
    if (googleMapRef.current && coords) {
      searchPlaces(googleMapRef.current, coords, activeService)
    }
  }, [activeService])

  const initMap = async (center, zoom, skipSearch = false) => {
    const { Map } = await window.google.maps.importLibrary("maps")
    const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker")
    const { ColorScheme } = await window.google.maps.importLibrary("core")

    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const map = new Map(mapRef.current, {
      center: center || { lat: 40.4168, lng: -3.7038 },
      zoom: zoom ?? (center ? 14 : 12),
      mapId: '13e801420677322ee903aec6',
      colorScheme: isDark ? ColorScheme.DARK : ColorScheme.LIGHT,
    })

    googleMapRef.current = map

    if (googleMapRef._themeCleanup) googleMapRef._themeCleanup()

    const handleThemeChange = (e) => {
      const currentCenter = map.getCenter()
      const currentZoom = map.getZoom()
      initMap({ lat: currentCenter.lat(), lng: currentCenter.lng() }, currentZoom, true)
    }

    window.addEventListener('themechange', handleThemeChange)
    googleMapRef._themeCleanup = () => window.removeEventListener('themechange', handleThemeChange)

    const youPin = new PinElement({
      background: '#8e44ad',
      borderColor: '#ffffff',
      glyphColor: '#ffffff',
    })

    new AdvancedMarkerElement({
      position: center,
      map,
      title: 'You are here',
      content: youPin.element,
    })

    if (!skipSearch) {
      searchPlaces(map, center, activeService)
    }
  }

  const showDirections = (destination) => {
    if (!coords) return
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${destination.lat},${destination.lng}`,
      '_blank'
    )
  }

  const fetchPlaceDetails = (placeId) => {
    const serviceDiv = document.createElement('div')
    const service = new window.google.maps.places.PlacesService(serviceDiv)

    service.getDetails(
      {
        placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'user_ratings_total', 'reviews', 'website', 'photos', 'geometry']
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSelectedPlace(result)
          googleMapRef.current.setCenter({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() })
          googleMapRef.current.setZoom(17)
        }
      }
    )
  }

  const searchPlaces = (map, center, service) => {
    setLoading(true)
    setError(null)
    setResults([])

    markersRef.current.forEach(m => m.map = null)
    markersRef.current = []

    const serviceDiv = document.createElement('div')
    const placesService = new window.google.maps.places.PlacesService(serviceDiv)

    placesService.nearbySearch(
      {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: 10000,
        type: service.value,
        ...(service.keyword && { keyword: service.keyword })
      },
      (res, status) => {
        setLoading(false)
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !res) {
          setError('No results found nearby')
          return
        }

        const top3 = res
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
          .map(r => ({
            name: r.name,
            address: r.vicinity,
            rating: r.rating,
            totalRatings: r.user_ratings_total,
            placeId: r.place_id,
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
            openNow: r.opening_hours?.isOpen(),
          }))

        setResults(top3)

        top3.forEach((r, i) => {
          const el = document.createElement('div')
          el.style.cssText = `
            width:28px;height:28px;background:#8e44ad;color:white;
            border-radius:50%;display:flex;align-items:center;
            justify-content:center;font-weight:bold;font-size:13px;
            border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
          `
          el.textContent = String(i + 1)

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: r.lat, lng: r.lng },
            map,
            title: r.name,
            content: el,
            gmpClickable: true,
          })

          marker.addListener('click', () => {
            fetchPlaceDetails(r.placeId)
          })

          markersRef.current.push(marker)
        })

        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(center)
        top3.forEach(r => bounds.extend({ lat: r.lat, lng: r.lng }))
        map.fitBounds(bounds)
      }
    )
  }

  const handleManualSearch = async () => {
    if (!manualLocation.trim()) return
    setError(null)
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
      )
      const data = await res.json()
      const loc = data.results?.[0]?.geometry?.location
      if (!loc) return setError('Location not found')
      const newCoords = { lat: loc.lat, lng: loc.lng }
      setCoords(newCoords)
      setLocationName(manualLocation)
      if (window.google) initMap(newCoords)
    } catch {
      setError('Could not geocode location')
    }
  }

  return (
    <div className="pet-services">
      <h1>Pet Services Near You</h1>

      <div className="location-bar">
        <div className="location-input-wrapper">
          <input
            type="text"
            placeholder="Enter a location..."
            value={manualLocation}
            onChange={e => setManualLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
            className="location-input"
          />
          {manualLocation && (
            <button className="input-clear-btn" onClick={() => setManualLocation('')}>×</button>
          )}
        </div>
        <button onClick={handleManualSearch} className="location-btn">Search</button>
        <button
          onClick={() => navigator.geolocation?.getCurrentPosition(
            ({ coords: c }) => {
              const newCoords = { lat: c.latitude, lng: c.longitude }
              setCoords(newCoords)
              setLocationName('your current location')
              if (window.google) initMap(newCoords)
            }
          )}
          className="location-btn secondary"
        >
          <CiLocationOn /> Use My Location
        </button>
      </div>

      <div className="service-tabs">
        {SERVICE_TYPES.map(s => (
          <button
            key={s.value + s.label}
            className={`service-tab ${activeService.label === s.label ? 'active' : ''}`}
            onClick={() => setActiveService(s)}
          >
            {s.label}
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
          <div
            key={place.placeId}
            className="service-card"
            onClick={() => fetchPlaceDetails(place.placeId)}
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
          </div>
        ))}
      </div>

      {selectedPlace && (
        <div className="place-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="place-popup" onClick={e => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setSelectedPlace(null)}>×</button>

            <h2 className="place-popup-title">{selectedPlace.name}</h2>
            <p className="place-popup-address">{selectedPlace.formatted_address}</p>

            {selectedPlace.formatted_phone_number && (
              <p className="place-popup-phone"><PiPhoneOutgoingThin /> {selectedPlace.formatted_phone_number}</p>
            )}

            {selectedPlace.website && (
              <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="place-popup-website">
                <CiGlobe /> Visit Website
              </a>
            )}

            {selectedPlace.rating && (
              <p className="place-popup-rating">
                ⭐ {selectedPlace.rating} <span>({selectedPlace.user_ratings_total} reviews)</span>
              </p>
            )}

            <button
              className="directions-btn"
              onClick={() => showDirections({
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
              })}
            >
              <LiaDirectionsSolid /> Get Directions
            </button>

            {selectedPlace.opening_hours?.weekday_text && (
              <div className="place-popup-hours">
                <h4>Opening Hours</h4>
                {selectedPlace.opening_hours.weekday_text.map((day, i) => (
                  <p key={i}>{day}</p>
                ))}
              </div>
            )}

            {selectedPlace.reviews?.slice(0, 2).map((review, i) => (
              <div key={i} className="place-review">
                <div className="review-header">
                  <div>
                    <span className="review-author">{review.author_name}</span>
                    <span className="review-rating">⭐ {review.rating}</span>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}