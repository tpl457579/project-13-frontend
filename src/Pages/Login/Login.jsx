import './Login.css'
import { useState, useContext, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/AuthContext'
import ShowPopup from '../../components/ShowPopup/ShowPopup'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { apiFetch } from '../../components/apiFetch'
import Button from '../../components/Buttons/Button'
import FormInput from '../../components/FormInput/FormInput'
import DogIntro from '../../components/DogIntro/DogIntro'

const LoginPage = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleUserNameChange = useCallback((e) => setUserName(e.target.value), [])
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), [])

  const payload = useMemo(() => ({ userName, password }), [userName, password])

  const handleLogin = useCallback(
    async (ev) => {
      ev.preventDefault()
      if (!userName || !password) {
        ShowPopup('Username and password are required', 'error')
        return
      }

      setLoading(true)

      try {
        const data = await apiFetch('/users/login', {
          method: 'POST',
          data: payload
        })

        if (!data.user || !data.token) {
          throw new Error('Incomplete response from server')
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
        setIsLoggingIn(true) 
        
      } catch (err) {
        ShowPopup(err.message || 'Login failed. Please try again.', 'error')
      } finally {
        setLoading(false)
      }
    },
    [payload, login] 
  )

  if (isLoggingIn) {
    return (
      <DogIntro 
        onFinished={() => {
          navigate('/')
          setTimeout(() => {
            ShowPopup('Logged in successfully', 'success')
          }, 500)
        }} 
      />
    )
  }

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
          disabled={loading}
        />

        <PasswordInput
          name='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Password'
          required
          disabled={loading}
        />

        <Button
          variant='primary'
          className='login-button'
          type='submit'
          disabled={loading} 
          loading={loading}
          loadingText='Logging in'
          showSpinner={true}
        >
          Login
        </Button>
      </form>
      
      <h4>
        If you don't have an account already{' '}
        <span
          className='login-register-link'
          onClick={() => navigate('/register')}
          style={{ cursor: 'pointer' }}
        >
          Register here
        </span>
      </h4>
    </div>
  )
}

export default LoginPage