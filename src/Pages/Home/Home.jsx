import './Home.css'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import ShowPopup from '../../components/ShowPopup/ShowPopup'
import usePetType from '../../Hooks/usePetType'

const Home = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [showFunOptions, setShowFunOptions] = useState(false)

  // ⬇️ Use your new hook
  const { petType, choosePet, clearPet } = usePetType()

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const goTo = useCallback((path) => navigate(path), [navigate])

  const requireLogin = useCallback(
    (path) => {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (user || token) {
        navigate(path)
      } else {
        ShowPopup('You must register or log in to access this page!')
        navigate('/login')
      }
    },
    [navigate]
  )

  const petSelectionButtons = useMemo(() => (
    <>
      <Button 
        variant='secondary' 
        className='home-btn' 
        onClick={() => choosePet('dog')}
      >
        <img className='home-dog-btn' src='./dog1.png' />
      </Button>

      <Button 
        variant='secondary' 
        className='home-btn' 
        onClick={() => choosePet('cat')}
      >
        <img className='home-cat-btn' src='./cat.png' />
      </Button>
    </>
  ), [choosePet])

  const mainButtons = useMemo(() => (
    <>
      <Button
        variant='secondary'
        className='second-home-btn'
        onClick={() => goTo(petType === 'dog' ? '/shop-dogs' : '/shop-cats')}
      >
        Shop {petType === 'dog' ? 'Dogs' : 'Cats'}
      </Button>

      <Button
        variant='secondary'
        className='second-home-btn'
        onClick={() => setShowFunOptions(true)}
      >
        Fun Stuff
      </Button>

      <button className="back-link" onClick={clearPet}>
        ← Change Pet
      </button>
    </>
  ), [goTo, petType, clearPet])

  const funButtons = useMemo(() => {
    const isDog = petType === 'dog'

    return (
      <div className='fun-options fade-in'>
      <Button onClick={() => goTo(isDog ? '/guess-the-dog' : '/match-the-cats')}>
  {isDog ? 'Dog Game' : 'Cat Game'}
</Button>



        <Button onClick={() => requireLogin(isDog ? '/suitable-dog' : '/suitable-cat')}>
          My Perfect {isDog ? 'Dog' : 'Cat'}
        </Button>

        <Button onClick={() => goTo(isDog ? '/fun-dog-facts' : '/fun-cat-facts')}>
          Fun {isDog ? 'Dog' : 'Cat'} Facts
        </Button>

        <button className="back-link" onClick={() => setShowFunOptions(false)}>
          ← Back
        </button>
      </div>
    )
  }, [goTo, requireLogin, petType])

  return (
    <div className='home-container'>
      <h1 className='home-h1'>Welcome Pet Lovers!</h1>

      <div className='home'>
        <img
          className='home-img'
          src={
            petType === 'cat'
              ? 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg'
              : petType === 'dog'
              ? 'https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-beagle-1587053767.jpg?crop=0.651xw:1.00xh;0.114xw'
              : 'https://wallup.net/wp-content/uploads/2014/10/14/funny/Funny_Cat_And_Dog_Friend.jpg'
          }
          alt='Cute Pets'
        />

        {showButtons && (
          <div className='home-buttons fade-in'>
            {!petType 
              ? petSelectionButtons 
              : (!showFunOptions ? mainButtons : funButtons)
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
