import { useState } from 'react'
import './Button.css'
import Spinner from '../Spinner/Spinner'

const Button = ({
  children,
  onClick,
  width,
  height,
  radius,
  bgColor,
  borderColor,
  textColor,
  fontSize,
  hoverBgColor,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  showSpinner = false,
  loadingText = 'Loading..',
  className = '',
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const customStyles = {
    width,
    height,
    borderRadius: radius,
    backgroundColor: isHovered && hoverBgColor ? hoverBgColor : bgColor,
    borderColor: borderColor,
    color: textColor,
    fontSize,
    ...style
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
      className={`site-button site-button-${variant} ${className}`}
      style={customStyles}
      {...props}
    >
      {loading ? (
        <span className='button-loading'>
          {showSpinner && <Spinner />}
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button