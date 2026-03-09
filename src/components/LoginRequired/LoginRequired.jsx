import './LoginRequired.css'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext.jsx'

export default function LoginRequired({ children }) {
  const { user } = useContext(AuthContext)

  if (!user) {
    return (
      <div className='login-required'>
        <h2>You must be logged in to view this page</h2>
        <p>Please <a href="/login">log in</a> or <a href="/register">register</a> to continue.</p>
      </div>
    )
  }

  return children
}