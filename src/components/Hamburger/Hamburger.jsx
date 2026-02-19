import './Hamburger.css'
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../AuthContext.jsx'
import { FaBars } from 'react-icons/fa'
import Button from '../Buttons/Button.jsx'
import { AnimalToggle } from '../AnimalToggle/AnimalToggle.jsx'
import { AnimalContext } from '../AnimalContext.jsx'

const Hamburger = () => {
  const { user, logout } = useContext(AuthContext)
  const { animalType, toggleAnimalType } = useContext(AnimalContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.role === 'admin'
  const isDog = animalType === 'dog'

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLinkClick = useCallback(() => setMenuOpen(false), [])
  const handleLogout = useCallback(() => {
    logout()
    handleLinkClick()
  }, [logout, handleLinkClick])

  const StaticLinks = ({ onClick, isDog }) => (
    <>
      <li>
        <NavLink to='/' onClick={onClick}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to={isDog ? '/guess-the-dog' : '/match-the-cats'} onClick={onClick}>
          {isDog ? 'Dog' : 'Cat'} Game
        </NavLink>
      </li>
      <li>
        <NavLink to={isDog ? '/fun-dog-facts' : '/fun-cat-facts'} onClick={onClick}>
          Fun {isDog ? 'Dog' : 'Cat'} Facts
        </NavLink>
      </li>
      <li>
        <NavLink to='/shop' onClick={onClick}>
          Shop
        </NavLink>
      </li>
    </>
  )

  const UserLinks = ({ isAdmin, onClick, onLogout, isDog }) => (
    <>
      <li>
        <NavLink to={isDog ? '/suitable-dog' : '/suitable-cat'} onClick={onClick}>
          My Perfect {isDog ? 'Dog' : 'Cat'}
        </NavLink>
      </li>
      <li>
        <NavLink to={isDog ? '/dog-search' : '/cat-search'} onClick={onClick}>
          {isDog ? 'Dog' : 'Cat'} Search
        </NavLink>
      </li>
      <li>
        <NavLink to='/favourites' onClick={onClick}>
          Favourites
        </NavLink>
      </li>
      <li>
        <NavLink to='/profile' onClick={onClick}>
          Profile
        </NavLink>
      </li>
      {isAdmin && (
        <li>
          <NavLink to='/admin' onClick={onClick}>
            Admin
          </NavLink>
        </li>
      )}
      <li>
        <Button variant='primary' className='logout-btn' onClick={onLogout}>
          Logout
        </Button>
      </li>
    </>
  )

  const AuthLinks = ({ onClick }) => (
    <>
      <li>
        <NavLink to='/login' onClick={onClick}>
          <Button
            variant='primary'
            className='site-button-site-button-primary'
            type='submit'
          >
            Login
          </Button>
        </NavLink>
      </li>
      <li>
        <NavLink to='/register' onClick={onClick}>
          <Button
            variant='primary'
            className='site-button-site-button-primary'
            type='submit'
          >
            Register
          </Button>
        </NavLink>
      </li>
    </>
  )

  return (
    <>
      <div
        ref={buttonRef}
        className='hamburger-btn'
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <FaBars className='hamburger-bars' size={28} />
      </div>

      <ul ref={menuRef} className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <li className='close-btn'>
          <button className='close-btn-hamburger' onClick={handleLinkClick}>
            ✕
          </button>
        </li>

        {/* Animal Toggle in Menu */}
        <li className='hamburger-animal-toggle'>
          <AnimalToggle 
            animalType={animalType} 
            onToggle={toggleAnimalType}
          />
        </li>

        <StaticLinks onClick={handleLinkClick} isDog={isDog} />

        {isLoggedIn ? (
          <UserLinks
            isAdmin={isAdmin}
            onClick={handleLinkClick}
            onLogout={handleLogout}
            isDog={isDog}
          />
        ) : (
          <AuthLinks onClick={handleLinkClick} />
        )}
      </ul>
    </>
  )
}

export default Hamburger