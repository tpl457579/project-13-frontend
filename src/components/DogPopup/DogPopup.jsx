import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
/* import '../../src/Pages/SuitableDog/SuitableDog.css' */
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
  const [showTraits, setShowTraits] = useState(false)

  const toggleFullscreen = () => {
    const element = document.documentElement
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => console.error(err))
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
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
      setShowTraits(false)
    }
  }, [isOpen])

  if (!dog) return null

  const formattedTemperament = Array.isArray(dog.temperament)
    ? dog.temperament.join(', ')
    : dog.temperament

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div 
        className="suitable-dog-popup-content" 
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen(); 
        }}
      >
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <h2 className="popup-heading" style={{ fontSize: dog.name.length > 21 ? "20px" : "24px" }}>
          {dog.name}
        </h2>

        <div className="popup-wrapper">
          {dog.image_link && <img src={dog.image_link} alt={dog.name} className="dogImgLarge" />}

          <div className="popup-text">
            {!showTraits ? (
              <div className="info-section">
                {dog.weight && <p><strong>Weight:</strong> {dog.weight}</p>}
                {dog.height && <p><strong>Height:</strong> {dog.height}</p>}
                {formattedTemperament && (
                  <p><strong>Temperament:</strong> {formattedTemperament}</p>
                )}
                {dog.life_span && <p><strong>Life Span:</strong> {dog.life_span}</p>}

                <button className="traits-toggle-btn" onClick={() => setShowTraits(true)}>
                  Show Traits
                </button>
              </div>
            ) : (
              <div className="traits-section">
                <TraitMeter className="trait-playfulness" label="Playfulness" value={dog.playfulness} />
                <TraitMeter className="trait-energy" label="Energy" value={dog.energy} />
                <TraitMeter className="trait-shedding" label="Shedding" value={dog.shedding} />
                <TraitMeter className="trait-grooming" label="Grooming" value={dog.grooming} />
                <TraitMeter className="trait-protectiveness" label="Protectiveness" value={dog.protectiveness} />
                <TraitMeter className="trait-children" label="Good with Children" value={dog.good_with_children} />
                <TraitMeter className="trait-otherdogs" label="Good with Other Dogs" value={dog.good_with_other_dogs} />
                <TraitMeter className="trait-strangers" label="Good with Strangers" value={dog.good_with_strangers} />

                <button className="traits-toggle-btn" onClick={() => setShowTraits(false)}>
                  Back to Info
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DogPopup