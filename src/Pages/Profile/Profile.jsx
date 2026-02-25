import './Profile.css'
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import ShowPopup from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx'
import FormInput from '../../components/FormInput/FormInput.jsx'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../components/apiFetch'
import Spinner from '../../components/Spinner/Spinner.jsx'
import DeleteModal from '../../components/DeleteModal/DeleteModal.jsx'

const Profile = () => {
  const { user, setUser } = useContext(AuthContext)
  const usernameRef = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
      ShowPopup('Passwords do not match', 'error')
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

      ShowPopup('Profile updated successfully!', 'success')
    } catch (err) {
      console.error(err)
      ShowPopup('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await apiFetch(`/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setUser(null)
      localStorage.removeItem('user')
      sessionStorage.clear()
      ShowPopup('Account deleted successfully', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      console.error(err)
      ShowPopup('Failed to delete account', 'error')
    } finally {
      setIsDeleting(false)
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
            value={formData.userName}
            onChange={handleChange}
            placeholder='Name'
            ref={usernameRef}
          />
        </label>

        <label>
          Email
          <FormInput
            name='email'
            value={formData.email}
            onChange={handleChange}
            type='email'
            placeholder='Email'
          />
          {emailError && <span className="error-text">{emailError}</span>}
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
            showSpinner={loading}
            loadingText='Updating..'
          >
            Update Account
          </Button>
          <Button
            variant='primary'
            className='profile-delete-button'
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <DeleteModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName="your account"
      />
    </div>
  )
}

export default Profile