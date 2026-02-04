import React, { useState } from 'react'
import Modal from '../../src/components/Modal/Modal'
import '../../src/Pages/SuitableDog/SuitableDog.css'
import PawIcon from '../../src/components/PawIcon'

const DogPopup = ({ isOpen, closePopup, dog }) => {
  if (!dog) return null
  const [showTraits, setShowTraits] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={closePopup}>
      <div className="suitable-dog-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closePopup}>
          &times;
        </button>

        <h2 className="popup-heading" style={{ fontSize: dog.name.length > 21 ? "20px" : "24px" }} >{dog.name}</h2>

        <div className="popup-wrapper">
          {dog.image_link && <img src={dog.image_link} alt={dog.name} className="dogImgLarge" />}

          <div className="popup-text">
            {!showTraits ? (
              <>
                {dog.weight && <p><strong>Weight:</strong> {dog.weight}</p>}
                {dog.height && <p><strong>Height:</strong> {dog.height}</p>}
                
                {dog.temperament && (
                  <p>
                    <strong>Temperament:</strong> {
                      Array.isArray(dog.temperament) 
                        ? dog.temperament.join(', ') 
                        : dog.temperament
                    }
                  </p>
                )}

                {dog.life_span && <p><strong>Life Span:</strong> {dog.life_span}</p>}

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