import './CatForm.css'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'
import DropZone from '../DropZone/DropZone'
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineClose } from 'react-icons/ai'
import IdeaBulb from '../IdeaBulb/IdeaBulb'

const PLACEHOLDER = '../placeholder.png'

function TemperamentSelector({ options, selected, onChange }) {
  const scrollRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const toggle = (t) => {
    if (selected.includes(t)) onChange(selected.filter(x => x !== t))
    else onChange([...selected, t])
  }

  const handleScrollLogic = () => {
    if (!scrollRef.current) return
    if (isAtBottom) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    else scrollRef.current.scrollBy({ top: 120, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5)
  }

  return (
    <div className="temperament-mode-container">
      <div className="temperament-selector" ref={scrollRef} onScroll={onScroll}>
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
        <button type="button" className="scroll-toggle-btn" onClick={handleScrollLogic}>
          {isAtBottom ? <AiOutlineArrowUp size={20} /> : <AiOutlineArrowDown size={20} />}
        </button>
      </div>
    </div>
  )
}

export default function CatForm({ initialData = {}, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState(initialData.name || '')
  const [preview, setPreview] = useState(initialData.imageUrl || '')
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '')
  const [publicId, setPublicId] = useState(initialData.imagePublicId || '')
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [showTemperaments, setShowTemperaments] = useState(false)

  const inputRef = useRef(null)
  const autoTimer = useRef(null)

/*   const isValidImageUrl = (url) => {
  if (!url) return true
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
  } catch {
    return false
  }
} */


  const temperamentOptions = useMemo(() => [
  "Affectionate",
  "Active",
  "Energetic",
  "Intelligent",
  "Playful",
  "Curious",
  "Gentle",
  "Independent",
  "Loyal",
  "Social",
  "Friendly",
  "Calm",
  "Quiet",
  "Sweet",
  "Bold",
  "Easy Going",
  "Lively",
  "Interactive",
  "Agile",
  "Confident",
  "Courageous",
  "Docile",
  "Reserved",
  "Protective",
  "Loving",
  "Trainable",
  "Mischievous",
  "Shy",
  "Talkative",
  "Adaptable"
]
, [])

  const fields = useMemo(() => [
    { key: 'childFriendly', label: 'Child Friendly (1-5)', type: 'text' },
    { key: 'dogFriendly', label: 'Dog Friendly (1-5)', type: 'text' },
    { key: 'grooming', label: 'Grooming (1-5)', type: 'text' },
    { key: 'energyLevel', label: 'Energy Level (1-5)', type: 'text' },
    { key: 'strangerFriendly', label: 'Stranger Friendly (1-5)', type: 'text' },
    { key: 'affectionLevel', label: 'Affection Level (1-5)', type: 'text' },
    { key: 'sheddingLevel', label: 'Shedding Level (1-5)', type: 'text' }
  ], [])

  const [formData, setFormData] = useState({
    temperament: [],
    childFriendly: '',
    dogFriendly: '',
    grooming: '',
    energyLevel: '',
    strangerFriendly: '',
    affectionLevel: '',
    sheddingLevel: ''
  })

  useEffect(() => {
    setName(initialData.name || '')
    const url = initialData.imageUrl || ''
    setPreview(url)
    setImageUrl(url)
    setPublicId(initialData.publicId || '')

    setFormData({
      temperament: Array.isArray(initialData.temperament)
        ? initialData.temperament
        : typeof initialData.temperament === 'string'
          ? initialData.temperament.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      childFriendly: initialData.childFriendly || '',
      dogFriendly: initialData.dogFriendly || '',
      grooming: initialData.grooming || '',
      energyLevel: initialData.energyLevel || '',
      strangerFriendly: initialData.strangerFriendly || '',
      affectionLevel: initialData.affectionLevel || '',
      sheddingLevel: initialData.sheddingLevel || ''
    })
  }, [initialData])

  const isValidValue = useCallback((value) => {
    if (!value && value !== 0) return false
    const n = Number(String(value).trim())
    return !isNaN(n) && n >= 1 && n <= 5
  }, [])

  const handleFieldChange = (value) => {
    const field = fields[step]
    setFormData(prev => ({ ...prev, [field.key]: value }))

    if (isValidValue(value)) {
      setError('')
      if (step < fields.length - 1) {
        if (autoTimer.current) clearTimeout(autoTimer.current)
        autoTimer.current = setTimeout(() => setStep(s => s + 1), 800)
      }
    } else {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      setError('Use a number 1-5')
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
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  const currentField = fields[step]
  if (!isValidValue(formData[currentField.key])) {
    return
  }

 /*  if (!isValidImageUrl(imageUrl)) {
    setError("Invalid image URL")
    return
  } */

  if (formData.temperament.length === 0) {
    setError("Select at least one temperament")
    return
  }

  if (initialData._id && !initialData._id.trim()) {
    setError("Invalid cat ID")
    return
  }

  const payload = {
    _id: initialData._id || '',
    id: initialData.id || '',
    name,
    imageUrl,
    imagePublicId: publicId,
    temperament: formData.temperament.join(', '),
    childFriendly: Number(formData.childFriendly),
    dogFriendly: Number(formData.dogFriendly),
    grooming: Number(formData.grooming),
    energyLevel: Number(formData.energyLevel),
    strangerFriendly: Number(formData.strangerFriendly),
    affectionLevel: Number(formData.affectionLevel),
    sheddingLevel: Number(formData.sheddingLevel)
  }

  await onSubmit(payload)
}

  const currentField = fields[step]

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form className='cat-edit-form' onSubmit={handleSubmit}>
        <div className='modal-close' onClick={onCancel}>
          <AiOutlineClose size={24} />
        </div>

        <h2 className="form-title-vertical">{initialData._id ? 'Edit Cat' : 'Add Cat'}</h2>

        <div className='cat-layout-wrapper'>
          <div className="form-section-visuals">
            <div className="visual-toggle">
              <button type="button" className={!showTemperaments ? "active" : ""} onClick={() => setShowTemperaments(false)}>Image</button>
              <button type="button" className={showTemperaments ? "active" : ""} onClick={() => setShowTemperaments(true)}>Temperaments</button>
            </div>

            <div className="visual-content">
              {!showTemperaments ? (
                <div className="image-mode">
                  <div className="add-cat-image">
                    <img src={preview || PLACEHOLDER} alt="Cat" />
                  </div>
                  <DropZone handleFileChange={handleFileChange} height="120px" fontSize="14px" />
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
            <h3 className="form-title">{initialData._id ? 'Edit Cat' : 'Add Cat'}</h3>

            <div className='identity-inputs'>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' required />
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }} placeholder='Image URL' />
            </div>

            <div className='characteristics-step'>
              <div className="input-wrapper">
                <input
                  className={`cat-info-input ${error ? 'input-error' : ''}`}
                  key={currentField.key}
                  ref={inputRef}
                  type="text"
                  value={formData[currentField.key] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                />
                <span className="floating-placeholder">{currentField.label}</span>
                {error && <div className="error-tooltip">{error}</div>}
                <IdeaBulb className='cat-form-tip' tip="CatForm" storageKey="has_seen_cat_form_tip" />
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

            <div className='admin-cat-form-buttons'>
              <Button
                type='submit'
                loading={isSubmitting || uploading}
                loadingText="Saving..."
                showSpinner
                disabled={!!error || !name}
              >
                Save Cat
              </Button>
              <button type='button' onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
