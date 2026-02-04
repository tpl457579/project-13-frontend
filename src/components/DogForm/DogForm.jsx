import './DogForm.css'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'
import DropZone from '../DropZone/DropZone' 
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineClose } from 'react-icons/ai'

const PLACEHOLDER = '../placeholder.png'

function TemperamentSelector({ options, selected, onChange }) {
  const scrollRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const toggle = (t) => {
    if (selected.includes(t)) {
      onChange(selected.filter(x => x !== t))
    } else {
      onChange([...selected, t])
    }
  }

  const handleScrollLogic = () => {
    if (!scrollRef.current) return
    if (isAtBottom) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      scrollRef.current.scrollBy({ top: 120, behavior: 'smooth' })
    }
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5)
  }

  return (
    <div className="temperament-mode-container">
      <div 
        className="temperament-selector" 
        ref={scrollRef}
        onScroll={onScroll}
      >
        {options.map(t => (
          <button
            key={t}
            type="button"
            className={selected.includes(t) ? "selected" : ""}
            onClick={() => toggle(t)}
          >
            {t}
          </button>
        ))}
      </div>
      
      <div className="scroll-button-container">
        <button 
          type="button" 
          className="scroll-toggle-btn" 
          onClick={handleScrollLogic}
        >
          {isAtBottom ? <AiOutlineArrowUp size={20} /> : <AiOutlineArrowDown size={20} />}
        </button>
      </div>
    </div>
  )
}

export default function DogForm({ initialData = {}, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState(initialData.name || '')
  const [preview, setPreview] = useState(initialData.imageUrl || initialData.image_link || '')
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || initialData.image_link || '')
  const [publicId, setPublicId] = useState(initialData.imagePublicId || '')
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [showTemperaments, setShowTemperaments] = useState(false)
  
  const inputRef = useRef(null)
  const autoTimer = useRef(null)

  const temperamentOptions = useMemo(() => [
    'Stubborn','Curious','Playful','Adventurous','Active','Fun-loving','Aloof','Clownish',
    'Dignified','Independent','Happy','Outgoing','Friendly','Alert','Confident','Intelligent',
    'Courageous','Docile','Responsive','Composed','Receptive','Faithful','Affectionate',
    'Devoted','Loyal','Assertive','Energetic','Gentle','Dominant','Reserved','Protective',
    'Kind','Sweet-Tempered','Loving','Tenacious','Attentive','Obedient','Trainable','Steady',
    'Bold','Proud'
  ], [])

  const fields = useMemo(() => [
    { key: 'weight', label: '(e.g. 10 - 20 Kg)', type: 'text' },
    { key: 'height', label: '(e.g. 10 - 20 Cm)', type: 'text' },
    { key: 'life_span', label: '(e.g. 10 - 14 Years)', type: 'text' },
    { key: 'good_with_children', label: 'Good with children (1-5)', type: 'text' },
    { key: 'good_with_other_dogs', label: 'Good with other dogs (1-5)', type: 'text' },
    { key: 'shedding', label: 'Shedding (1-5)', type: 'text' },
    { key: 'grooming', label: 'Grooming (1-5)', type: 'text' },
    { key: 'good_with_strangers', label: 'Good with strangers (1-5)', type: 'text' },
    { key: 'playfulness', label: 'Playfulness (1-5)', type: 'text' },
    { key: 'protectiveness', label: 'Protectiveness (1-5)', type: 'text' },
    { key: 'energy', label: 'Energy (1-5)', type: 'text' }
  ], [])

  const [formData, setFormData] = useState({
    temperament: [], weight: '', height: '', life_span: '',
    good_with_children: '', good_with_other_dogs: '', shedding: '',
    grooming: '', good_with_strangers: '', playfulness: '',
    protectiveness: '', energy: ''
  })

  useEffect(() => {
    setName(initialData.name || '')
    const url = initialData.imageUrl || initialData.image_link || ''
    setPreview(url)
    setImageUrl(url)
    setPublicId(initialData.imagePublicId || '')
    
    setFormData({
      temperament: Array.isArray(initialData.temperament)
        ? initialData.temperament
        : typeof initialData.temperament === 'string'
          ? initialData.temperament.split(',').map(s => s.trim()).filter(Boolean)
          : [],
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
  }, [initialData])

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const isValidValue = useCallback((value, field) => {
    if (!value && value !== 0) return false
    const val = String(value).trim()
    if (field.key === 'weight') return /^\d+\s*-\s*\d+\s*Kg$/i.test(val)
    if (field.key === 'height') return /^\d+\s*-\s*\d+\s*Cm$/i.test(val)
    if (field.key === 'life_span') return /^\d+\s*-\s*\d+\s*Years$/i.test(val)
    const n = Number(val)
    return !isNaN(n) && n >= 1 && n <= 5
  }, [])

  const handleFieldChange = (value) => {
    const field = fields[step]
    let newValue = value
    const rangeRegex = /^\d+\s*-\s*\d+$/
    const hasTrailingSpace = value.endsWith(' ')

    if (hasTrailingSpace && rangeRegex.test(value.trim())) {
      if (field.key === 'weight') newValue = `${value.trim()} Kg`
      else if (field.key === 'height') newValue = `${value.trim()} Cm`
      else if (field.key === 'life_span') newValue = `${value.trim()} Years`
    }

    setFormData(prev => ({ ...prev, [field.key]: newValue }))

    if (isValidValue(newValue, field)) {
      setError('')
      if (step < fields.length - 1) {
        if (autoTimer.current) clearTimeout(autoTimer.current)
        autoTimer.current = setTimeout(() => setStep(s => s + 1), 800)
      }
    } else {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      let errorMsg = ''
      if (field.key === 'weight') errorMsg = 'Format: "10 - 20 Kg"'
      else if (field.key === 'height') errorMsg = 'Format: "20 - 30 Cm"'
      else if (field.key === 'life_span') errorMsg = 'Format: "10 - 15 Years"'
      else errorMsg = 'Use a number 1-5'
      setError(errorMsg)
    }
  }

  const handleManualStep = (index) => {
    setStep(index)
    setError('')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const localUrl = URL.createObjectURL(file)
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
    const currentField = fields[step]
    if (!isValidValue(formData[currentField.key], currentField)) return

    const payload = {
      ...initialData,
      name,
      image_link: imageUrl,
      imageUrl,
      publicId,
      ...formData,
      temperament: formData.temperament.join(', ')
    }

    Object.keys(payload).forEach((k) => {
      const field = fields.find(f => f.key === k)
      if (field && !['weight', 'height', 'life_span'].includes(field.key)) {
        payload[k] = payload[k] === '' ? 0 : Number(payload[k])
      }
    })

    await onSubmit(payload)
  }

  const currentField = fields[step]

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form className='dog-edit-form' onSubmit={handleSubmit}>
        <div className='modal-close' onClick={onCancel}>
          <AiOutlineClose size={24} />
        </div>
        <h2 className="form-title-vertical">{initialData._id ? 'Edit Dog' : 'Add Dog'}</h2>
        <div className='dog-layout-wrapper'>
          <div className="form-section-visuals">
            <div className="visual-toggle">
              <button type="button" className={!showTemperaments ? "active" : ""} onClick={() => setShowTemperaments(false)}>Image</button>
              <button type="button" className={showTemperaments ? "active" : ""} onClick={() => setShowTemperaments(true)}>Temperaments</button>
            </div>
            <div className="visual-content">
              {!showTemperaments ? (
                <div className="image-mode">
                  <div className="add-dog-image">
                    <img src={preview || PLACEHOLDER} alt="Dog" />
                  </div>
                  <DropZone 
                    handleFileChange={handleFileChange} 
                    height="120px"
                    fontSize="14px"
                  />
                  {uploading && <Spinner />}
                </div>
              ) : (
                <div className="temperament-mode">
                  <TemperamentSelector
                    options={temperamentOptions}
                    selected={formData.temperament}
                    onChange={(newTemps) => setFormData(prev => ({ ...prev, temperament: newTemps }))}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='form-section-inputs'>
            <h3 className="form-title">{initialData._id ? 'Edit Dog' : 'Add Dog'}</h3>
            <div className='identity-inputs'>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' required />
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }} placeholder='Image URL' />
            </div>
            
            <div className='characteristics-step'>
              <div className="input-wrapper">
                <input
                  className={`dog-info-input ${error ? 'input-error' : ''}`}
                  key={currentField.key}
                  ref={inputRef}
                  type="text"
                  value={formData[currentField.key] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
                <span className="floating-placeholder">{currentField.label}</span>
                {error && <div className="error-tooltip">{error}</div>}
              </div>
            </div>

            <div className="step-navigation">
              <button type="button" className="nav-arrow" disabled={step === 0} onClick={() => handleManualStep(step - 1)}>&larr;</button>
              <div className="step-dots">
                {fields.map((_, index) => (
                  <button key={index} type="button" className={`step-dot ${index === step ? 'active' : ''}`} onClick={() => handleManualStep(index)} />
                ))}
              </div>
              <button type="button" className="nav-arrow" disabled={step === fields.length - 1 || !!error} onClick={() => handleManualStep(step + 1)}>&rarr;</button>
            </div>

            <div className='admin-dog-form-buttons'>
              <Button 
                type='submit' 
                loading={isSubmitting || uploading} 
                loadingText="Saving..."
                showSpinner 
                disabled={!!error || !name}
              >
                Save Dog
              </Button>
              <button type='button' onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}