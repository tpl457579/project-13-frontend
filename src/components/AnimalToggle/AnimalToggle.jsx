import './AnimalToggle.css'

export const AnimalToggle = ({ animalType, onToggle }) => {
  const isDog = animalType === 'dog'
  
  return (
    <div className='animal-toggle-container'>
      <button 
        className='animal-toggle'
        onClick={onToggle}
        aria-label={`Switch to ${isDog ? 'cats' : 'dogs'}`}
      >
        <span className={`toggle-option ${isDog ? 'active' : ''}`}>
          <img src="../dog1.png" alt="Dog Icon" width="30" height="30" />
        </span>
        <span className={`toggle-option ${!isDog ? 'active' : ''}`}>
          <img src="../cat2.png" alt="Cat Icon" width="40" height="40" />
        </span>
      </button>
    </div>
  )
}