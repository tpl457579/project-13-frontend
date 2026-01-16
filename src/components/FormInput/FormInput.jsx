import './FormInput.css'

export default function FormInput({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete = 'off',
  className = ''
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className={`form-input ${className}`}
    />
  )
}
