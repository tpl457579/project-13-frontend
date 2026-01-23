import './Hamburger.css'
import  {
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

const Hamburger = () => {
  const { user, logout } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.role === 'admin'

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

  const StaticLinks = ({ onClick }) => (
    <>
      <li>
        <NavLink to='/' onClick={onClick}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/guess-the-dog' onClick={onClick}>
          Dog Game
        </NavLink>
      </li>
      <li>
        <NavLink to='/fun-dog-facts' onClick={onClick}>
          Fun Dog Facts
        </NavLink>
      </li>
      <li>
        <NavLink to='/shop' onClick={onClick}>
          Shop
        </NavLink>
      </li>
    </>
  )

  const UserLinks = ({ isAdmin, onClick, onLogout }) => (
    <>
      <li>
        <NavLink to='/suitable-dog' onClick={onClick}>
          My Perfect Dog
        </NavLink>
      </li>
      <li>
        <NavLink to='/dog-search' onClick={onClick}>
          Dog Search
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

        <StaticLinks onClick={handleLinkClick} />

        {isLoggedIn ? (
          <UserLinks
            isAdmin={isAdmin}
            onClick={handleLinkClick}
            onLogout={handleLogout}
          />
        ) : (
          <AuthLinks onClick={handleLinkClick} />
        )}
      </ul>
    </>
  )
}

export default Hamburger
