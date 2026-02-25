import './PasswordInput.css'
import { useState, useMemo, useCallback } from 'react'

const PasswordInput = ({ value, onChange, placeholder = 'Password', name }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const toggleIconSrc = useMemo(() => {
    return showPassword
      ? '../hide.png'
      : '../visible.png'
  }, [showPassword])

  const toggleAltText = useMemo(() => {
    return showPassword ? 'Hide password' : 'Show password'
  }, [showPassword])

  return (
    <div className='password-input-wrapper'>
      <input
        className='password-input'
        type={showPassword ? 'text' : 'password'}
        name={name}
        defaultValue={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />

      <button
        className='toggle-password-icon'
        type='button'
        onClick={handleTogglePassword}
      >
        <img src={toggleIconSrc} alt={toggleAltText} className='toggle-icon' />
      </button>
    </div>
  )
}

export default PasswordInput
