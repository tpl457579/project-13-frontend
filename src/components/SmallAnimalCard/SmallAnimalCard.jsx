import './SmallAnimalCard.css'

const SmallAnimalCard = ({ dog, cat, onClick, children }) => {
  const animal = dog || cat;
  if (!animal) return null;

  return (
    <div className='small-dog-card' onClick={onClick}>
      <div className='SmallDogCardInner'>
        {(animal.image_link || animal.imageUrl) && (
          <img 
            src={animal.image_link || animal.imageUrl} 
            alt={animal.name} 
            className='small-dog-card-img' 
          />
        )}
        <h3 style={{ fontSize: animal.name.length > 21 ? "15px" : "18px" }}>
          {animal.name}
        </h3>
        <div className="card-extra-info">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SmallAnimalCard;
