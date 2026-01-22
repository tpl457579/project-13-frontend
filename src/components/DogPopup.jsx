import Modal from '../components/Modal/Modal'
import '../Pages/SuitableDog/SuitableDog.css'

const DogPopup = ({ isOpen, closePopup, dog }) => {
  if (!dog) return null

  return (
    <Modal isOpen={isOpen} onClose={closePopup}>
      <div
        className='suitable-dog-popup-content'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='modal-close' onClick={closePopup}>
          &times;
        </button>

        <h2 className='popup-heading'>{dog.name}</h2>

        <div className='popup-wrapper'>
          {dog.image_link && (
            <img src={dog.image_link} alt={dog.name} className='dogImgLarge' />
          )}

          <div className='popup-text'>
            {dog.weight && (
              <p>
                <strong>Weight:</strong> {dog.weight} 
              </p>
            )}
            {dog.height && (
              <p>
                <strong>Height:</strong> {dog.height} 
              </p>
            )}
            {dog.temperament && (
              <p>
                <strong>Temperament:</strong> {dog.temperament}
              </p>
            )}
            {dog.life_span && (
              <p>
                <strong>Life Span:</strong> {dog.life_span}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DogPopup
