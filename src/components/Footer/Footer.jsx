import './Footer.css'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineHome
} from 'react-icons/hi2'

export const Footer = ({ openModal }) => {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.role === 'admin'
  const isOnAdminPage = location.pathname.startsWith('/admin')


  return (
    <footer className='footer-container'>
      <div className='footer-links'>
        <NavLink to='/' className='mobile-icon'>
          <HiOutlineHome size={32} />
        </NavLink>

        <NavLink to='/shop' className='mobile-icon'>
          <HiOutlineShoppingBag size={32} />
        </NavLink>

        {isLoggedIn &&
          isAdmin &&
          isOnAdminPage &&
          typeof openModal === 'function' && (
            <button
              className='footer-add-btn'
              onClick={() => openModal()}
              title='Add Product'
              aria-label='Add Product'
            >
              +
            </button>
          )}

        {isLoggedIn && (
          <>
            <NavLink to='/favourites' className='mobile-icon'>
              <HiOutlineHeart size={32} />
            </NavLink>
            <NavLink to='/profile' className='mobile-icon'>
              <HiOutlineUser size={32} />
            </NavLink>
          </>
        )}
      </div>
      
    </footer>
  )
}
