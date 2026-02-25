import './AnimalPopup.css'
import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import PawIcon from '../PawIcon'
import ScrollButton from '../ScrollButton/ScrollButton'

const TraitMeter = ({ label, value, matchPercent, className }) => {
  if (value == null) return null
  const filledCount = Math.max(0, Math.min(5, Math.round(value)))

  return (
    <div className={`trait-container ${className}`}>
      <div className="trait-meter">
        <span className="trait-label">
          {label}
          {matchPercent != null && <span className="match-percent"> ({matchPercent}% match)</span>}
        </span>
        <div className="trait-icons">
          {[1, 2, 3, 4, 5].map((i) => (
           <PawIcon
              key={i}
              id={`${label}-${i}`}
              width={35}
              height={35}
              fillColor="#8e4aed"
              strokeColor="#8e4aed"
              strokeWidth={10}
              percent={i <= filledCount ? 100 : 0} 
              className={`trait-icon ${i <= filledCount ? 'filled animate' : ''}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const AnimalPopup = ({ isOpen, closePopup, dog, cat, breakdown }) => {
  const [showTraits, setShowTraits] = useState(false)
  const scrollRef = useRef(null)

  const animal = dog || cat
  const isCat = !!cat

  useEffect(() => {
    if (!isOpen) setShowTraits(false)
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [showTraits])

  if (!animal) return null

  const displayData = {
    name: animal.name,
    image: isCat ? animal.imageUrl : animal.image_link,
    weight: animal.weight,
    height: animal.height,
    temperament: animal.temperament,
    lifeSpan: isCat ? `${animal.lifeSpan}` : `${animal.life_span}`,
    playfulness: isCat ? animal.energyLevel : animal.playfulness,
    energy: isCat ? animal.energyLevel : animal.energy,
    shedding: isCat ? animal.sheddingLevel : animal.shedding,
    grooming: animal.grooming,
    protectiveness: animal.protectiveness,
    good_with_children: isCat ? animal.childFriendly : animal.good_with_children,
    good_with_other_dogs: isCat ? animal.dogFriendly : animal.good_with_other_dogs,
    good_with_strangers: isCat ? animal.strangerFriendly : animal.good_with_strangers,
    affection: isCat ? animal.affectionLevel : null
  }

  const formattedTemperament = Array.isArray(displayData.temperament)
    ? displayData.temperament.join(', ')
    : displayData.temperament

  const getMatchPercent = (traitId) => {
    if (!breakdown) return null
    const match = breakdown.find(b => b.id === traitId)
    return match ? match.match : null
  }

  return (
    <Modal isOpen={isOpen} onClose={closePopup}>
      <div className="animal-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closePopup}>&times;</button>

        <h2 style={{ fontSize: displayData.name.length > 21 ? "20px" : "24px" }}>
          {displayData.name}
        </h2>

        {breakdown && animal.score != null && (
          <div className="total-match-badge">
            <strong>Total Match:</strong> {animal.score}%
          </div>
        )}

        <div className="popup-wrapper">
          {displayData.image && (
            <img src={displayData.image} alt={displayData.name} className="dogImgLarge" />
          )}

          <div className="popup-text" ref={scrollRef}>
            {!showTraits ? (
             <div className={`info-section ${isCat ? 'info-section-cat' : 'info-section-dog'}`}>
              {displayData.weight && <p><strong>Weight:</strong> {displayData.weight}</p>}
              {displayData.height && <p><strong>Height:</strong> {displayData.height}</p>}
              {formattedTemperament && <p><strong>Temperament:</strong> {formattedTemperament}</p>}
              {displayData.lifeSpan && <p><strong>Life Span:</strong> {displayData.lifeSpan}</p>}

                <button className="traits-toggle-btn" onClick={() => setShowTraits(true)}>
                  Show Traits
                </button>
              </div>
            ) : (
              <div className="traits-section">
                {isCat && <TraitMeter label="Affection Level" value={displayData.affection} matchPercent={getMatchPercent('affectionLevel')} />}
                <TraitMeter label={isCat ? "Energy Level" : "Playfulness"} value={displayData.playfulness} matchPercent={getMatchPercent('playfulness')} />
                {!isCat && <TraitMeter label="Energy" value={displayData.energy} matchPercent={getMatchPercent('energy')} />}
                <TraitMeter label="Shedding" value={displayData.shedding} matchPercent={getMatchPercent('shedding')} />
                <TraitMeter label="Grooming" value={displayData.grooming} matchPercent={getMatchPercent('grooming')} />
                {!isCat && <TraitMeter label="Protectiveness" value={displayData.protectiveness} matchPercent={getMatchPercent('protectiveness')} />}
                <TraitMeter label="Good with Children" value={displayData.good_with_children} matchPercent={getMatchPercent('good_with_children')} />
                <TraitMeter label={isCat ? "Dog Friendly" : "Good with Other Dogs"} value={displayData.good_with_other_dogs} matchPercent={getMatchPercent('good_with_other_dogs')} />
                <TraitMeter label={isCat ? "Stranger Friendly" : "Good with Strangers"} value={displayData.good_with_strangers} matchPercent={getMatchPercent('good_with_strangers')} />

                <button className="traits-toggle-btn" onClick={() => setShowTraits(false)}>
                  Back to Info
                </button>
              </div>
            )}
          </div>
<div className="animal-scroll-container">
          <div className="animal-popup-scroll-button">
            <ScrollButton className='animal-scroll-button' scrollRef={scrollRef} scrollAmount={85} />
          </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AnimalPopup