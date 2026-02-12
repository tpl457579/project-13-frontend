import './SmallAnimalCard.css'

const SmallAnimalCard = ({ dog, onClick, children }) => {
  if (!dog) return null;

  return (
    <div className='small-dog-card' onClick={onClick}>
      <div className='SmallDogCardInner'>
        {dog.image_link && (
          <img src={dog.image_link} alt={dog.name} className='small-dog-card-img' />
        )}
        <h3 style={{ fontSize: dog.name.length > 21 ? "15px" : "18px" }}>
          {dog.name}
        </h3>
        <div className="card-extra-info">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SmallAnimalCard;