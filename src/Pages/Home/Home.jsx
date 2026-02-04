import './Home.css'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import ShowPopup from '../../components/ShowPopup/ShowPopup'

const Home = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [showFunOptions, setShowFunOptions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const goTo = useCallback((path) => navigate(path), [navigate])

  const requireLogin = useCallback(
  (path) => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user || token) {
      navigate(path);
    } else {
      ShowPopup('You must register or log in to access this page!');
      navigate('/login');
    }
  },
  [navigate]
);
  const mainButtons = useMemo(
    () => (
      <>
        <Button
          variant='secondary'
          className='home-btn'
          onClick={() => goTo('/shop')}
        >
          Shop
        </Button>
        <Button
          variant='secondary'
          className='home-btn'
          onClick={() => setShowFunOptions(true)}
        >
          Fun Stuff
        </Button>
      </>
    ),
    [goTo]
  )

  const funButtons = useMemo(
    () => (
      <div className='fun-options fade-in'>
        <Button onClick={() => goTo('/guess-the-dog')}>Dog Game</Button>
        
        <Button onClick={() => requireLogin('/suitable-dog')}>
          My Perfect Dog
        </Button>
        
        <Button onClick={() => goTo('/fun-dog-facts')}>Fun Dog Facts</Button>

        <button className="back-link" onClick={() => setShowFunOptions(false)}>
          &larr; Back
        </button>
      </div>
    ),
    [goTo, requireLogin] 
  )

  return (
    <div className='home-container'>
      <h1 className='home-h1'>Welcome Dog Lovers!</h1>
      <div className='home'>
        <img
          className='home-img'
          src='../home-dog-image.jpg' 
          alt='Cute Dog'
        />
        {showButtons && (
          <div className='home-buttons fade-in'>
            {!showFunOptions ? mainButtons : funButtons}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home