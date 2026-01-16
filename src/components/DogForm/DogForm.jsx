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
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
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
    { key: 'weight', label: 'Weight 10 - 20 kg', type: 'text' },
    { key: 'height', label: 'Height 10 - 20 cm', type: 'text' },
    { key: 'life_span', label: 'Life Span 10 - 14 years', type: 'text' },
    { key: 'good_with_children', label: 'Good with children (1-10)', type: 'number' },
    { key: 'good_with_other_dogs', label: 'Good with other dogs (1-10)', type: 'number' },
    { key: 'shedding', label: 'Shedding (1-10)', type: 'number' },
    { key: 'grooming', label: 'Grooming (1-10)', type: 'number' },
    { key: 'good_with_strangers', label: 'Good with strangers (1-10)', type: 'number' },
    { key: 'playfulness', label: 'Playfulness (1-10)', type: 'number' },
    { key: 'protectiveness', label: 'Protectiveness (1-10)', type: 'number' },
    { key: 'energy', label: 'Energy (1-10)', type: 'number' }
  ], [])

  const [formData, setFormData] = useState(() => ({
    temperament: Array.isArray(initialData.temperament)
      ? initialData.temperament
      : (initialData.temperament ? String(initialData.temperament).split(',').map(s => s.trim()).filter(Boolean) : []),
    weight: initialData.weight || '',
    height: initialData.height || '',
    life_span: initialData.life_span || '',
    good_with_children: initialData.good_with_children ?? '',
    good_with_other_dogs: initialData.good_with_other_dogs ?? '',
    shedding: initialData.shedding ?? '',
    grooming: initialData.grooming ?? '',
    good_with_strangers: initialData.good_with_strangers ?? '',
    playfulness: initialData.playfulness ?? '',
    protectiveness: initialData.protectiveness ?? '',
    energy: initialData.energy ?? ''
  }))

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      temperament: Array.isArray(initialData.temperament)
        ? initialData.temperament
        : (initialData.temperament ? String(initialData.temperament).split(',').map(s => s.trim()).filter(Boolean) : prev.temperament),
      weight: initialData.weight || prev.weight,
      height: initialData.height || prev.height,
      life_span: initialData.life_span || prev.life_span,
      good_with_children: initialData.good_with_children ?? prev.good_with_children,
      good_with_other_dogs: initialData.good_with_other_dogs ?? prev.good_with_other_dogs,
      shedding: initialData.shedding ?? prev.shedding,
      grooming: initialData.grooming ?? prev.grooming,
      good_with_strangers: initialData.good_with_strangers ?? prev.good_with_strangers,
      playfulness: initialData.playfulness ?? prev.playfulness,
      protectiveness: initialData.protectiveness ?? prev.protectiveness,
      energy: initialData.energy ?? prev.energy
    }))
  }, [initialData])

  const [step, setStep] = useState(0)
  const inputRef = useRef(null)
  const autoTimer = useRef(null)
  const [error, setError] = useState('')
  const skipAutoRef = useRef(false)
  const skipResetTimer = useRef(null)

  const [openTemperament, setOpenTemperament] = useState(false)
  const temperamentRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  useEffect(() => {
    function handleClickOutside(e) {
      if (temperamentRef.current && !temperamentRef.current.contains(e.target)) {
        setOpenTemperament(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearSkipAuto = () => {
    if (skipResetTimer.current) clearTimeout(skipResetTimer.current)
    skipResetTimer.current = setTimeout(() => {
      skipAutoRef.current = false
    }, 600)
  }
  const markManualNavigation = () => {
    skipAutoRef.current = true
    clearSkipAuto()
  }

  const isValidValue = useCallback((value, field) => {
    if (!field) return false
    if (field.key === 'weight') {
      return /^\s*\d+\s*-\s*\d+\s*kg\s*$/i.test(String(value || '').trim())
    }
    if (field.key === 'height') {
      return /^\s*\d+\s*-\s*\d+\s*cm\s*$/i.test(String(value || '').trim())
    }
    if (field.key === 'life_span') {
      return /^\s*\d+\s*-\s*\d+\s*years\s*$/i.test(String(value || '').trim())
    }
    if (field.type === 'number') {
      if (value === '' || value === null || value === undefined) return false
      const n = Number(value)
      return Number.isFinite(n) && n >= 1 && n <= 10
    }
    return String(value).trim().length > 0
  }, [])

  useEffect(() => {
    const key = fields[step].key
    const value = formData[key]
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (!skipAutoRef.current && isValidValue(value, fields[step]) && step < fields.length - 1) {
      autoTimer.current = setTimeout(() => {
        setError('')
        setStep((s) => Math.min(s + 1, fields.length - 1))
      }, 450)
    }
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
    }
  }, [formData, step, fields, isValidValue])

  const handleFieldChange = useCallback((value) => {
    const key = fields[step].key
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (error) {
      const field = fields[step]
      if (field.type === 'number') {
        const n = Number(value)
        if (Number.isFinite(n) && n >= 1 && n <= 10) setError('')
      } else {
        if (isValidValue(value, field)) setError('')
      }
    }
  }, [step, fields, error, isValidValue])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const key = fields[step].key
      const value = formData[key]
      if (isValidValue(value, fields[step])) {
        setError('')
        markManualNavigation()
        if (step < fields.length - 1) setStep((s) => s + 1)
        else e.target.form.requestSubmit()
      } else {
        if (fields[step].type === 'number') setError('You must insert a number between 1 and 10')
        else if (fields[step].key === 'weight') setError('Use format 10 - 20 kg')
        else if (fields[step].key === 'height') setError('Use format 10 - 20 cm')
        else if (fields[step].key === 'life_span') setError('Use format 10 - 14 years')
        else setError('This field cannot be empty')
        inputRef.current?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && step > 0) {
      markManualNavigation()
      setStep((s) => s - 1)
    }
    if (e.key === 'ArrowRight' && step < fields.length - 1) {
      const key = fields[step].key
      const value = formData[key]
      if (isValidValue(value, fields[step])) {
        markManualNavigation()
        setError('')
        setStep((s) => s + 1)
      } else {
        if (fields[step].type === 'number') setError('You must insert a number between 1 and 10')
        else if (fields[step].key === 'weight') setError('Use format 10 - 20 kg')
        else if (fields[step].key === 'height') setError('Use format 10 - 20 cm')
        else if (fields[step].key === 'life_span') setError('Use format 10 - 14 years')
        else setError('This field cannot be empty')
        inputRef.current?.focus()
      }
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setError('')
      markManualNavigation()
      setStep((s) => s - 1)
    }
  }

  const handleFileChange = useCallback(async (e) => {
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
  }, [])

  const toggleTemperament = (value) => {
    setFormData(prev => {
      const set = new Set(prev.temperament || [])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      return { ...prev, temperament: Array.from(set) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const numericKeys = ['good_with_children','good_with_other_dogs','shedding','grooming','good_with_strangers','playfulness','protectiveness','energy']
    const payload = { name, image_link: imageUrl, imageUrl, publicId, ...formData }
    numericKeys.forEach((k) => {
      const v = payload[k]
      payload[k] = v === '' || v === null || v === undefined ? 0 : Number(v)
    })
    payload.temperament = Array.isArray(payload.temperament) ? Array.from(new Set(payload.temperament)) : []
    await onSubmit(payload)
  }

  const previewSrc = useMemo(() => preview || PLACEHOLDER, [preview])
  const currentField = fields[step]
  const currentValue = formData[currentField.key]

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='edit-form' onSubmit={handleSubmit}>
        <h3>{initialData._id ? 'Edit Dog' : 'Add Dog'}</h3>

        <div className='dog-layout'>
          <div className='add-dog-image'>
            <img src={previewSrc} alt='Dog' onError={(e) => (e.target.src = PLACEHOLDER)} />
          </div>

          <div className='dog-fields'>
            <input
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type='url'
              placeholder='Image URL'
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value) }}
            />

            <div className='temperament-select' ref={temperamentRef}>
             
              <button
                type='button'
                className='temperament-toggle'
                aria-haspopup='listbox'
                aria-expanded={openTemperament}
                onClick={() => setOpenTemperament((v) => !v)}
              >
                {formData.temperament && formData.temperament.length > 0
                  ? formData.temperament.join(', ')
                  : 'Select temperaments'}
              </button>

              {openTemperament && (
                <div className='temperament-options' role='listbox' aria-multiselectable='true'>
                  {temperamentOptions.map((t) => {
                    const checked = (formData.temperament || []).includes(t)
                    return (
                      <label key={t} className='temperament-option'>
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleTemperament(t)}
                        />
                        <span>{t}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <DropZone handleFileChange={handleFileChange} />

        {uploading && (
          <div className='metadata-spinner'>
            <Spinner />
            <p>Uploading image</p>
          </div>
        )}

        <div className='theme-field'>
          <label className='progress-indicator'><span className='progress-text'>{step + 1} / {fields.length}</span></label>
          <input
            ref={inputRef}
            type={currentField.type}
            value={currentValue}
            onChange={(e) => handleFieldChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentField.label}
          />
          {error && <div className='field-error' role='alert'>{error}</div>}
        </div>

        <div className='modal-buttons'>
          <Button type='button' variant='secondary' onClick={handleBack} disabled={step === 0}>Back</Button>
          <Button type='submit' variant='primary' loading={isSubmitting || uploading} showSpinner>{initialData._id ? 'Save' : 'Add'}</Button>
          <button type='button' onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
