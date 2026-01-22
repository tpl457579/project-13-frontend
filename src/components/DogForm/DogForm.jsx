import './DogForm.css'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'

const PLACEHOLDER = './assets/images/placeholder.png'

function DropZone({ handleFileChange }) {
  const fileInputRef = useRef(null)
  return (
    <div
      className='drop-zone'
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFileChange({ target: { files: e.dataTransfer.files } })
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <p>Drag & drop an image here, or <span className='browse-link'>browse</span></p>
      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} hidden />
    </div>
  )
}

export default function DogForm({ initialData = {}, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState(initialData.name || '')
  const [preview, setPreview] = useState(initialData.imageUrl || initialData.image_link || '')
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || initialData.image_link || '')
  const [publicId, setPublicId] = useState(initialData.imagePublicId || '')
  const [uploading, setUploading] = useState(false)
  const [isAutoNavEnabled, setIsAutoNavEnabled] = useState(!initialData._id)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const previewUrlRef = useRef(null)
  const inputRef = useRef(null)
  const autoTimer = useRef(null)

  useEffect(() => {
    setName(initialData.name || '')
    const url = initialData.imageUrl || initialData.image_link || ''
    setPreview(url)
    setImageUrl(url)
    setPublicId(initialData.imagePublicId || '')
    setIsAutoNavEnabled(!initialData._id)
  }, [initialData])

  const fields = useMemo(() => [
    { key: 'weight', label: 'Weight (e.g. 10 - 20 kg)', type: 'text' },
    { key: 'height', label: 'Height (e.g. 10 - 20 cm)', type: 'text' },
    { key: 'life_span', label: 'Life Span (e.g. 10 - 14 years)', type: 'text' },
    { key: 'good_with_children', label: 'Good with children (1-10)', type: 'number' },
    { key: 'good_with_other_dogs', label: 'Good with other dogs (1-10)', type: 'number' },
    { key: 'shedding', label: 'Shedding (1-10)', type: 'number' },
    { key: 'grooming', label: 'Grooming (1-10)', type: 'number' },
    { key: 'good_with_strangers', label: 'Good with strangers (1-10)', type: 'number' },
    { key: 'playfulness', label: 'Playfulness (1-10)', type: 'number' },
    { key: 'protectiveness', label: 'Protectiveness (1-10)', type: 'number' },
    { key: 'energy', label: 'Energy (1-10)', type: 'number' }
  ], [])

  const [formData, setFormData] = useState({
    temperament: Array.isArray(initialData.temperament) ? initialData.temperament : [],
    weight: initialData.weight || '',
    height: initialData.height || '',
    life_span: initialData.life_span || '',
    good_with_children: initialData.good_with_children || '',
    good_with_other_dogs: initialData.good_with_other_dogs || '',
    shedding: initialData.shedding || '',
    grooming: initialData.grooming || '',
    good_with_strangers: initialData.good_with_strangers || '',
    playfulness: initialData.playfulness || '',
    protectiveness: initialData.protectiveness || '',
    energy: initialData.energy || ''
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const isValidValue = useCallback((value, field) => {
    if (!value && value !== 0) return false
    if (field.type === 'number') {
      const n = Number(value)
      return Number.isFinite(n) && n >= 1 && n <= 10
    }
    const val = String(value).trim()
    if (field.key === 'weight') return /^\d+\s*-\s*\d{2,}\s*kg$/i.test(val)
    if (field.key === 'height') return /^\d+\s*-\s*\d{2,}\s*cm$/i.test(val)
    if (field.key === 'life_span') return /^\d+\s*-\s*\d{2,}\s*years$/i.test(val)
    return val.length > 0
  }, [])

  useEffect(() => {
    if (!isAutoNavEnabled) return
    const field = fields[step]
    const value = formData[field.key]
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (isValidValue(value, field) && step < fields.length - 1) {
      autoTimer.current = setTimeout(() => setStep(s => s + 1), 800)
    }
    return () => autoTimer.current && clearTimeout(autoTimer.current)
  }, [formData, step, fields, isValidValue, isAutoNavEnabled])

  const handleFieldChange = (value) => {
    const field = fields[step]
    let newValue = value
    const rangeRegex = /^\d+\s*-\s*\d{2,}$/

    if (field.key === 'weight' && rangeRegex.test(value)) {
      newValue = `${value} kg`
    } else if (field.key === 'height' && rangeRegex.test(value)) {
      newValue = `${value} cm`
    } else if (field.key === 'life_span' && rangeRegex.test(value)) {
      newValue = `${value} years`
    }

    setFormData(prev => ({ ...prev, [field.key]: newValue }))
    setError('')
  }

  const handleManualStep = (index) => {
    setIsAutoNavEnabled(false)
    setStep(index)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const localUrl = URL.createObjectURL(file)
    previewUrlRef.current = localUrl
    setPreview(localUrl)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        setImageUrl(data.secure_url)
        setPublicId(data.public_id)
        setPreview(data.secure_url)
      }
    } catch (err) {
      setError("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      _id: initialData._id,
      name,
      image_link: imageUrl,
      imageUrl,
      publicId,
      ...formData
    }
    Object.keys(payload).forEach((k) => {
      if (fields.find(f => f.key === k && f.type === 'number')) {
        payload[k] = payload[k] === '' ? 0 : Number(payload[k])
      }
    })
    await onSubmit(payload)
  }

  const currentField = fields[step]

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='dog-edit-form' onSubmit={handleSubmit}>
        <h3>{initialData._id ? 'Edit Dog' : 'Add Dog'}</h3>
        <div className='dog-layout'>
          <div className='add-dog-image'>
            <img 
              src={preview || PLACEHOLDER} 
              alt='Dog' 
              onError={(e) => { e.target.src = PLACEHOLDER }}
            />
          </div>
        <div className='dog-fields'>
  <input 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
    placeholder='Name' 
    required 
  />
  <input 
    value={imageUrl} 
    onChange={(e) => {
      setImageUrl(e.target.value)
      setPreview(e.target.value)
    }} 
    placeholder='Image URL' 
  />
</div>
</div>

<DropZone handleFileChange={handleFileChange} />
{uploading && <Spinner />}

<input 
  className='dog-info-input'
  key={currentField.key}
  ref={inputRef}
  type={currentField.type}
  value={formData[currentField.key] || ''}
  onChange={(e) => handleFieldChange(e.target.value)}
  placeholder={currentField.label}
/>

{error && <div className='field-error'>{error}</div>}
        

        <div className="step-navigation">
          <button type="button" className="nav-arrow" disabled={step === 0} onClick={() => handleManualStep(step - 1)}>&larr;</button>
          <div className="step-dots">
            {fields.map((_, index) => (
              <button key={index} type="button" className={`step-dot ${index === step ? 'active' : ''}`} onClick={() => handleManualStep(index)} />
            ))}
          </div>
          <button type="button" className="nav-arrow" disabled={step === fields.length - 1} onClick={() => handleManualStep(step + 1)}>&rarr;</button>
        </div>

        <div className='modal-buttons'>
          <Button type='submit' loading={isSubmitting || uploading} showSpinner>Save Dog</Button>
          <button type='button' className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}