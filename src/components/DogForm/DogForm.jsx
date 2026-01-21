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
  const previewUrlRef = useRef(null)

  useEffect(() => {
    setName(initialData.name || '')
    setPreview(initialData.imageUrl || initialData.image_link || '')
    setImageUrl(initialData.imageUrl || initialData.image_link || '')
    setPublicId(initialData.imagePublicId || '')
  }, [initialData])

  const temperamentOptions = useMemo(() => [
    'Stubborn','Curious','Playful','Adventurous','Active','Fun-loving','Aloof','Clownish',
    'Dignified','Independent','Happy','Outgoing','Friendly','Alert','Confident','Intelligent',
    'Courageous','Docile','Responsive','Composed','Receptive','Faithful','Affectionate',
    'Devoted','Loyal','Assertive','Energetic','Gentle','Dominant','Reserved','Protective',
    'Kind','Sweet-Tempered','Loving','Tenacious','Attentive','Obedient','Trainable','Steady',
    'Bold','Proud'
  ], [])

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
    temperament: Array.isArray(initialData.temperament)
      ? initialData.temperament
      : initialData.temperament
        ? String(initialData.temperament).split(',').map(s => s.trim()).filter(Boolean)
        : [],
    weight: initialData.weight || '',
    height: initialData.height || '',
    life_span: initialData.life_span || '',
    good_with_children: initialData.good_with_children ?? 1,
    good_with_other_dogs: initialData.good_with_other_dogs ?? 1,
    shedding: initialData.shedding ?? 1,
    grooming: initialData.grooming ?? 1,
    good_with_strangers: initialData.good_with_strangers ?? 1,
    playfulness: initialData.playfulness ?? 1,
    protectiveness: initialData.protectiveness ?? 1,
    energy: initialData.energy ?? 1
  })

  useEffect(() => {
    setFormData({
      temperament: Array.isArray(initialData.temperament)
        ? initialData.temperament
        : initialData.temperament
          ? String(initialData.temperament).split(',').map(s => s.trim()).filter(Boolean)
          : [],
      weight: initialData.weight || '',
      height: initialData.height || '',
      life_span: initialData.life_span || '',
      good_with_children: initialData.good_with_children ?? 1,
      good_with_other_dogs: initialData.good_with_other_dogs ?? 1,
      shedding: initialData.shedding ?? 1,
      grooming: initialData.grooming ?? 1,
      good_with_strangers: initialData.good_with_strangers ?? 1,
      playfulness: initialData.playfulness ?? 1,
      protectiveness: initialData.protectiveness ?? 1,
      energy: initialData.energy ?? 1
    })
  }, [initialData])

  const [step, setStep] = useState(0)
  const inputRef = useRef(null)
  const autoTimer = useRef(null)
  const [error, setError] = useState('')
  const skipAutoRef = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const isValidValue = useCallback((value, field) => {
    if (field.type === 'number') {
      const n = Number(value)
      return Number.isFinite(n) && n >= 1 && n <= 10
    }
    if (field.key === 'weight') return /^\s*\d+\s*-\s*\d+\s*kg\s*$/i.test(String(value))
    if (field.key === 'height') return /^\s*\d+\s*-\s*\d+\s*cm\s*$/i.test(String(value))
    if (field.key === 'life_span') return /^\s*\d+\s*-\s*\d+\s*years\s*$/i.test(String(value))
    return String(value).trim().length > 0
  }, [])

  useEffect(() => {
    const field = fields[step]
    const value = formData[field.key]
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (!skipAutoRef.current && isValidValue(value, field) && step < fields.length - 1) {
      autoTimer.current = setTimeout(() => setStep(s => s + 1), 800)
    }
    return () => autoTimer.current && clearTimeout(autoTimer.current)
  }, [formData, step, fields, isValidValue])

  const handleFieldChange = (value) => {
    const key = fields[step].key
    setFormData(prev => ({ ...prev, [key]: value }))
    setError('')
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
      const cloudName = import.meta.env.VITE_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', uploadPreset)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        setImageUrl(data.secure_url)
        setPublicId(data.public_id)
        setPreview(data.secure_url)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name,
      image_link: imageUrl,
      imageUrl,
      publicId,
      ...formData
    }
    Object.keys(payload).forEach((k) => {
      if (fields.find(f => f.key === k && f.type === 'number')) {
        payload[k] = Number(payload[k])
      }
    })
    await onSubmit(payload)
  }

  const currentField = fields[step]

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='edit-form' onSubmit={handleSubmit}>
        <h3>{initialData._id ? 'Edit Dog' : 'Add Dog'}</h3>

        <div className='dog-layout'>
          <div className='add-dog-image'>
            <img src={preview || PLACEHOLDER} alt='Dog' />
          </div>

          <div className='dog-fields'>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' required />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder='Image URL' />
          </div>
        </div>

        <DropZone handleFileChange={handleFileChange} />

        {uploading && <Spinner />}

        <div className='theme-field'>
          <label className="field-label">{currentField.label}</label>
          <input
            ref={inputRef}
            type={currentField.type}
            value={formData[currentField.key]}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={currentField.label}
          />
          {error && <div className='field-error'>{error}</div>}
        </div>

        <div className="step-navigation">
          <button type="button" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Prev</button>
          <span>Step {step + 1} of {fields.length}</span>
          <button type="button" disabled={step === fields.length - 1} onClick={() => setStep(s => s + 1)}>Next</button>
        </div>

        <div className='modal-buttons'>
          <Button type='submit' loading={isSubmitting || uploading}>Save Dog</Button>
          <button type='button' className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}