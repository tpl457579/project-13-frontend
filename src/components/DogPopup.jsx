import React, { useState } from 'react'
import Modal from '../../src/components/Modal/Modal'
import '../../src/Pages/SuitableDog/SuitableDog.css'
import PawIcon from '../../src/components/PawIcon'

const TraitMeter = ({ label, value, className }) => {
  if (value == null) return null
  const filledCount = Math.max(0, Math.min(5, Math.round(value)))
  console.log(`[TraitMeter] ${label} value:`, value, 'filledCount:', filledCount)

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
                width={28}
                height={28}
                fillColor="#ff7f0e"
                strokeColor="#222"
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

function TraitByMatch({ id, label, dog }) {
  const entry = (dog.breakdown || []).find((b) => b.id === id)
  const rawMatch = entry ? entry.match : 0
  console.log(`[TraitByMatch] ${label} raw match:`, rawMatch, 'entry:', entry)

  const filledCount = Math.max(0, Math.min(5, Math.round((rawMatch / 100) * 5)))
  console.log(`[TraitByMatch] ${label} filledCount (0-5):`, filledCount)

  return (
    <div className={`trait-container trait-${id}`}>
      <div className="trait-meter">
        <span className="trait-label">{label}</span>
        <div className="trait-icons">
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = i <= filledCount
            return (
              <PawIcon
                key={i}
                id={`${dog.id}-${id}-${i}`}
                width={40}
                height={40}
                fillColor="#ca38f7"
                strokeColor="#ffffff"
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
  if (!dog) return null
  const [showTraits, setShowTraits] = useState(false)

  console.log('[DogPopup] dog:', dog)
  if (dog.breakdown) console.log('[DogPopup] breakdown:', dog.breakdown)
  console.log('[DogPopup] displayed score (computed from answers):', dog.score)

  return (
    <Modal isOpen={isOpen} onClose={closePopup}>
      <div className="suitable-dog-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closePopup}>
          &times;
        </button>

        <h2 className="popup-heading">{dog.name}</h2>

        <div className="popup-wrapper">
          {dog.image_link && <img src={dog.image_link} alt={dog.name} className="dogImgLarge" />}

          <div className="popup-text">
            {!showTraits ? (
              <>
                {dog.weight && <p><strong>Weight:</strong> {dog.weight}</p>}
                {dog.height && <p><strong>Height:</strong> {dog.height}</p>}
                {dog.temperament && <p><strong>Temperament:</strong> {dog.temperament}</p>}
                {dog.life_span && <p><strong>Life Span:</strong> {dog.life_span}</p>}

                <p><strong>Total Match:</strong> {typeof dog.score === 'number' ? dog.score : '—'}%</p>

                <button className="traits-toggle-btn" onClick={() => setShowTraits(true)}>
                  Show Traits
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DogPopup
