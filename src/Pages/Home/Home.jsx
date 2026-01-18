import './Home.css'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import { showPopup } from '../../components/ShowPopup/ShowPopup'

const Home = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [showFunOptions, setShowFunOptions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const goTo = useCallback((path) => navigate(path), [navigate])
  const toggleFunOptions = useCallback(() => setShowFunOptions(true), [])

  const requireLogin = useCallback(
    (path) => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (isLoggedIn) {
        navigate(path)
      } else {
        showPopup('You must register or log in to access this page!')
        navigate('/login')
      }
    },
    [navigate]
  )

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
          onClick={toggleFunOptions}
        >
          Fun Stuff
        </Button>
      </>
    ),
    [goTo, toggleFunOptions]
  )

  const funButtons = useMemo(
    () => (
      <div className='fun-options fade-in'>
        <Button onClick={() => goTo('/guess-the-dog')}>Dog Game</Button>
        <Button onClick={() => requireLogin('/suitable-dog')}>
          My Perfect Dog
        </Button>
        <Button onClick={() => goTo('/fun-dog-facts')}>Fun Dog Facts</Button>
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
          src='./assets/images/home-dog-image.jpg'
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
