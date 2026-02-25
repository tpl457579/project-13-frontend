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
import ScrollButton from '../ScrollButton/ScrollButton'

const Hamburger = () => {
  const { user, logout } = useContext(AuthContext)
  const { animalType, toggleAnimalType } = useContext(AnimalContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const menuRef = useRef(null) // This will now point to the scrollable content container
  const buttonRef = useRef(null)
  
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.role === 'admin'
  const isDog = animalType === 'dog'

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logic adjusted to treat the whole hamburger-menu as the container
      if (
        menuRef.current && !menuRef.current.parentElement.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    const checkScrollNecessity = () => {
      if (menuRef.current && menuOpen) {
        const { scrollHeight, clientHeight } = menuRef.current
        setShowScrollBtn(scrollHeight > clientHeight)
      } else {
        setShowScrollBtn(false)
      }
    }

    checkScrollNecessity()
    // Small timeout ensures the DOM has updated before measuring height
    const timer = setTimeout(checkScrollNecessity, 100)
    window.addEventListener('resize', checkScrollNecessity)
    
    return () => {
      window.removeEventListener('resize', checkScrollNecessity)
      clearTimeout(timer)
    }
  }, [menuOpen])

  const handleLinkClick = useCallback(() => setMenuOpen(false), [])
  
  const handleLogout = useCallback(() => {
    logout()
    handleLinkClick()
  }, [logout, handleLinkClick])

  return (
    <div className='hamburger-container'>
      <div
        ref={buttonRef}
        className='hamburger-btn'
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <FaBars className='hamburger-bars' size={28} />
      </div>

      {/* The main sidebar overlay */}
      <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        
        {/* The internal scrollable area */}
        <ul ref={menuRef} className="hamburger-scroll-area">
          <li className='close-btn'>
            <button className='close-btn-hamburger' onClick={handleLinkClick}>✕</button>
          </li>

          <li className='hamburger-animal-toggle'>
            <AnimalToggle animalType={animalType} onToggle={toggleAnimalType} />
          </li>

          <li><NavLink to='/' onClick={handleLinkClick}>Home</NavLink></li>
          <li>
            <NavLink to={isDog ? '/guess-the-dog' : '/match-the-cats'} onClick={handleLinkClick}>
              {isDog ? 'Dog' : 'Cat'} Game
            </NavLink>
          </li>
          <li>
            <NavLink to={isDog ? '/fun-dog-facts' : '/fun-cat-facts'} onClick={handleLinkClick}>
              Fun {isDog ? 'Dog' : 'Cat'} Facts
            </NavLink>
          </li>
          <li><NavLink to='/shop' onClick={handleLinkClick}>Shop</NavLink></li>

          {isLoggedIn ? (
            <>
              <li>
                <NavLink to={isDog ? '/suitable-dog' : '/suitable-cat'} onClick={handleLinkClick}>
                  My Perfect {isDog ? 'Dog' : 'Cat'}
                </NavLink>
              </li>
              <li>
                <NavLink to={isDog ? '/dog-search' : '/cat-search'} onClick={handleLinkClick}>
                  {isDog ? 'Dog' : 'Cat'} Search
                </NavLink>
              </li>
              <li><NavLink to='/favourites' onClick={handleLinkClick}>Favourites</NavLink></li>
              <li><NavLink to='/profile' onClick={handleLinkClick}>Profile</NavLink></li>
              {isAdmin && <li><NavLink to='/admin' onClick={handleLinkClick}>Admin</NavLink></li>}
              <li>
                <Button variant='primary' className='hamburger-logout-btn' onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/login' onClick={handleLinkClick}>
                  <Button variant='primary' className='site-button-primary'>Login</Button>
                </NavLink>
              </li>
              <li>
                <NavLink to='/register' onClick={handleLinkClick}>
                  <Button variant='primary' className='site-button-primary'>Register</Button>
                </NavLink>
              </li>
            </>
          )}
        </ul>

       {showScrollBtn && menuOpen && (
        <div className="hamburger-scroll-container">
        <div className="hamburger-scroll-floating">
          <ScrollButton className="hamburger-scroll-button" scrollRef={menuRef} scrollAmount={150} />
        </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Hamburger