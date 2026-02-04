import './AlphabetFilter.css'

const AlphabetFilter = ({ 
  lettersOpen, 
  setLettersOpen, 
  letter, 
  setLetter, 
  setLoadedCount, 
  ITEMS_PER_PAGE 
}) => {
  return (
    <div className='alphabet-container'>
      <button
        className='alphabet-toggle-btn'
        onClick={() => setLettersOpen(!lettersOpen)}
      >
        <img
          className='az-img'
          src='https://cdn-icons-png.flaticon.com/128/11449/11449637.png'
          alt="A-Z"
        />
      </button>

      <div className={`alphabet-letters ${lettersOpen ? 'open' : ''}`}>
        {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l) => (
          <button
            key={l}
            className={`alphabet-btn ${letter === l ? 'active' : ''}`}
            onClick={() => {
              setLetter(l === letter ? '' : l)
              if (setLoadedCount) setLoadedCount(ITEMS_PER_PAGE)
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlphabetFilter