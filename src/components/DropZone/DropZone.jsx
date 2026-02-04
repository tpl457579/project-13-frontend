import { useState, useRef } from 'react'
import './DropZone.css'

export default function DropZone({ 
  handleFileChange, 
  width = '210px', 
  height = '60px', 
  fontSize = '16px', 
  className = ''
}) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']

  const validateAndChange = (files) => {
    setError('')
    const file = files[0]
    if (!file) return

    const fileName = file.name.toLowerCase()
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isAllowed) {
      setError(`Invalid file. Use: ${allowedExtensions.join(', ')}`)
      return
    }

    handleFileChange({ target: { files } })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    validateAndChange(e.dataTransfer.files)
  }

  const onInputChange = (e) => {
    validateAndChange(e.target.files)
  }

  return (
    <div
      className={`drop-zone-container ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''} ${className}`}
      style={{ width, height, fontSize }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <div className="drop-zone-content">
        <p className="drop-zone-text">
          {error ? error : isDragging ? 'Drop now!' : (
            <>
              Drag & drop an image here, or{' '}
              <span className='browse-link'>browse</span>
            </>
          )}
        </p>
      </div>
      <input
        type='file'
        accept='.jpg,.jpeg,.png,.webp,.gif'
        ref={fileInputRef}
        onChange={onInputChange}
        hidden
      />
    </div>
  )
}