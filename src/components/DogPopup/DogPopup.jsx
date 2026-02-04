import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import './DogPopup.css'
import PawIcon from '../PawIcon'

const TraitMeter = ({ label, value, className }) => {
  if (value == null) return null
  const filledCount = Math.max(0, Math.min(5, Math.round(value)))

  return (
    <div className={`trait-container ${className}`}>
      <div className="trait-meter">
        <span className="trait-label">{label}</span>
        <div className="trait-icons">
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = i <= filledCount
            return (
              <PawIcon
                key={i}
                id={`${label}-${i}`}
                width={40}
                height={40}
                fillColor="#8e4aed"
                strokeColor="#cccccc"
                strokeWidth={6}
                percent={filled ? 100 : 0} 
                className={`trait-icon ${filled ? 'filled animate' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const DogPopup = ({ isOpen, closePopup, dog }) => {
  const [activeTab, setActiveTab] = useState('info')
  const popupRef = useRef(null)

  const toggleFullscreen = () => {
    const element = document.documentElement
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {})
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
      if (popupRef.current) {
        popupRef.current.focus()
      }
    }
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  const handleClose = () => {
    exitFullscreen()
    closePopup()
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('info')
    }
  }, [isOpen])

  if (!dog) return null

  const formattedTemperament = Array.isArray(dog.temperament)
    ? dog.temperament.join(', ')
    : dog.temperament

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div 
        ref={popupRef}
        className="suitable-dog-popup-content" 
        tabIndex="-1"
        onClick={(e) => {
          e.stopPropagation()
          toggleFullscreen()
        }}
        style={{ outline: 'none' }}
      >
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <h2 className="popup-heading">{dog.name}</h2>

        <div className="popup-tabs">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setActiveTab('info'); }}
          >
            General Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'traits' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setActiveTab('traits'); }}
          >
            Dog Traits
          </button>
        </div>

        <div className="popup-wrapper">
          {dog.image_link && <img src={dog.image_link} alt={dog.name} className="dogImgLarge" />}

          <div className="popup-text">
            {activeTab === 'info' ? (
              <div className="info-section">
                <div className="data-row"><strong>Weight:</strong> <span>{dog.weight}</span></div>
                <div className="data-row"><strong>Height:</strong> <span>{dog.height}</span></div>
                <div className="data-row"><strong>Life Span:</strong> <span>{dog.life_span}</span></div>
                {formattedTemperament && (
                  <div className="data-row temperament-row">
                    <strong>Temperament:</strong> 
                    <p>{formattedTemperament}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="traits-grid">
                <TraitMeter label="Playfulness" value={dog.playfulness} />
                <TraitMeter label="Energy" value={dog.energy} />
                <TraitMeter label="Shedding" value={dog.shedding} />
                <TraitMeter label="Grooming" value={dog.grooming} />
                <TraitMeter label="Protectiveness" value={dog.protectiveness} />
                <TraitMeter label="Children" value={dog.good_with_children} />
                <TraitMeter label="Other Dogs" value={dog.good_with_other_dogs} />
                <TraitMeter label="Strangers" value={dog.good_with_strangers} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DogPopup