import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { showPopup } from './ShowPopup/ShowPopup'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    showPopup('You must be logged in to access this page', 'error')
    return <Navigate to='/login' replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    showPopup('Access denied: Admins only', 'error')
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedRoute
