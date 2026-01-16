import './Profile.css'
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx'
import FormInput from '../../components/FormInput/FormInput.jsx'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../components/apiFetch'

const Profile = () => {
  const { user, setUser } = useContext(AuthContext)
  const usernameRef = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!user?._id) return
    setFormData({
      userName: user.userName || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    })
    usernameRef.current?.focus()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'email') setEmailError('')
  }

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setEmailError('Invalid email format')
      return false
    }
    return true
  }, [formData.email])

  const handleUpdate = async () => {
    if (!validateEmail()) return
    if (formData.password && formData.password !== formData.confirmPassword) {
      showPopup('Passwords do not match', 'error')
      return
    }

    try {
      setLoading(true)
      const updateData = { userName: formData.userName, email: formData.email }
      if (formData.password) updateData.password = formData.password

      await apiFetch(`/users/${user._id}`, {
        method: 'PUT',
        data: updateData,
        headers: { Authorization: `Bearer ${user.token}` }
      })

      const newUser = { ...user, ...updateData }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))

      setFormData({
        userName: newUser.userName,
        email: newUser.email,
        password: '',
        confirmPassword: ''
      })

      showPopup('Profile updated successfully!', 'success')
    } catch (err) {
      console.error(err)
      showPopup('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiFetch(`/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setUser(null)
      localStorage.removeItem('user')
      sessionStorage.clear()
      showPopup('Account deleted successfully', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      console.error(err)
      showPopup('Failed to delete account', 'error')
    } finally {
      setConfirmDelete(false)
    }
  }

  return (
    <div className='profile-container'>
      <h1>My Profile</h1>
      <div className='profile-form'>
        <label>
          Username
          <FormInput
            name='userName'
            onChange={handleChange}
            placeholder='Name'
            ref={usernameRef}
          />
        </label>

        <label>
          Email
          <FormInput
            name='email'
            onChange={handleChange}
            type='email'
            placeholder='Email'
          />
        </label>

        <label>
          New Password
          <PasswordInput
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='New Password'
          />
        </label>

        <label>
          Confirm New Password
          <PasswordInput
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password'
          />
        </label>

        <div className='profile-buttons'>
          <Button
            variant='secondary'
            className='profile-update-button'
            onClick={handleUpdate}
            loading={loading}
            loadingText='Updating'
          >
            Update Account
          </Button>
          <Button
            variant='primary'
            className='profile-delete-button'
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
            loading={loading}
            loadingText='Deleting...'
          >
            Delete Account
          </Button>
        </div>
      </div>

      {confirmDelete && (
        <div className='modal-overlay' onClick={() => setConfirmDelete(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <p className='delete-modal-text'>
              Are you sure you want to delete your account?
            </p>
            <div className='modal-buttons'>
              <button onClick={() => setConfirmDelete(false)}>No</button>
              <button onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
