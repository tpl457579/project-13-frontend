import './Login.css'
import { useState, useContext, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/AuthContext'
import { showPopup } from '../../components/ShowPopup/ShowPopup'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { apiFetch } from '../../components/apiFetch'
import Button from '../../components/Buttons/Button'
import FormInput from '../../components/FormInput/FormInput'

const LoginPage = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleUserNameChange = useCallback(
    (e) => setUserName(e.target.value),
    []
  )
  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    []
  )

  const payload = useMemo(() => ({ userName, password }), [userName, password])

  const handleLogin = useCallback(
    async (ev) => {
      ev.preventDefault()
      if (!userName || !password) {
        showPopup('Username and password are required', 'error')
        return
      }

      setLoading(true)

      try {
        const data = await apiFetch('/users/login', {
          method: 'POST',
          data: payload
        })

        if (!data.user || !data.token) {
          showPopup('Login failed: incomplete response from server', 'error')
          return
        }

        localStorage.setItem('token', data.token)

        const loggedInUser = {
          _id: data.user._id,
          userName: data.user.userName,
          email: data.user.email,
          role: data.user.role || 'user',
          favourites: data.user.favourites || [],
          token: data.token
        }

        login(loggedInUser)
        showPopup('Logged in successfully', 'success')
        navigate('/')
      } catch (err) {
        showPopup(err.message || 'Login failed. Please try again.', 'error')
      } finally {
        setLoading(false)
      }
    },
    [userName, password, payload, login, navigate]
  )

  return (
    <div className='login-container'>
      <h1>Login</h1>
      <form className='loginForm' onSubmit={handleLogin}>
        <FormInput
          name='userName'
          value={userName}
          onChange={handleUserNameChange}
          placeholder='Username'
          required
        />

        <PasswordInput
          name='password'
          value={password}
          onChange={handlePasswordChange}
          type='password'
          placeholder='Password'
          required
        />

        <Button
          variant='primary'
          className='login-button'
          type='submit'
          loading={loading}
          loadingText='Logging in'
          showSpinner={true}
        >
          Login
        </Button>
      </form>
      <h4>
        If you dont have an account already{' '}
        <span
          className='login-register-link'
          onClick={() => navigate('/register')}
        >
          Register here
        </span>
      </h4>
    </div>
  )
}

export default LoginPage
