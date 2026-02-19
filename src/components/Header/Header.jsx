import React, { useContext, useCallback, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'
import { AuthContext } from '../../components/AuthContext.jsx'
import Button from '../Buttons/Button.jsx'
import Hamburger from '../Hamburger/Hamburger.jsx'
import { AnimalToggle } from '../AnimalToggle/AnimalToggle.jsx'
import { AnimalContext } from '../../components/AnimalContext.jsx'

const Header = React.memo(() => {
  const { user, logout } = useContext(AuthContext)
  const { animalType, toggleAnimalType } = useContext(AnimalContext)
  const navigate = useNavigate()
  
  /* // Add animal preference state - default to 'dog'
  const [animalType, setAnimalType] = useState(
    localStorage.getItem('animalPreference') || 'dog'
  ) */

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
  }, [logout, navigate])

 /*  // Toggle between cat and dog
  const toggleAnimalType = () => {
    const newType = animalType === 'dog' ? 'cat' : 'dog'
    setAnimalType(newType)
    localStorage.setItem('animalPreference', newType)
  } */

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = Boolean(user)
  const isDog = animalType === 'dog'

  return (
    <>
      <header className='desktop-header'>
        <nav className='navbar'>
          <ul className='nav-list'>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            
            <li className='animal-toggle-container'>
              <AnimalToggle 
                animalType={animalType} 
                onToggle={toggleAnimalType}
              />
            </li>
            
            <li>
              <NavLink to={isDog ? '/guess-the-dog' : '/match-the-cats'}>
                {isDog ? 'Dog' : 'Cat'} Game
              </NavLink>
            </li>
            <li>
              <NavLink to={isDog ? '/fun-dog-facts' : '/fun-cat-facts'}>
                Fun {isDog ? 'Dog' : 'Cat'} Facts
              </NavLink>
            </li>
            <li>
              <NavLink to='/shop'>Shop</NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <NavLink to={isDog ? '/dog-search' : '/cat-search'}>
                    {isDog ? 'Dog' : 'Cat'} Search
                  </NavLink>
                </li>
                <li>
                  <NavLink to={isDog ? '/suitable-dog' : '/suitable-cat'}>
                    My Perfect {isDog ? 'Dog' : 'Cat'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/favourites'>Favourites</NavLink>
                </li>
                <li>
                  <NavLink to='/profile'>Profile</NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to='/admin'>Admin</NavLink>
                  </li>
                )}
                <li>
                  <Button
                    variant='primary'
                    className='logout-btn'
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </>
            )}
          </ul>

          {!isLoggedIn && (
            <div className='auth-buttons'>
              <NavLink to='/login'>
                <Button
                  variant='primary'
                  className='header-button'
                  type='submit'
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to='/register'>
                <Button
                  variant='primary'
                  className='header-button'
                  type='submit'
                >
                  Register
                </Button>
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <Hamburger animalType={animalType} onToggleAnimal={toggleAnimalType} />
    </>
  )
})

export default Header