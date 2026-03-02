import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

export function useAnimalForm({ type, initialData, onSubmit, onCancel }) {
  const isCat = type === 'cat'
  
  const [name, setName] = useState('')
  const [preview, setPreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [publicId, setPublicId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [showTemperaments, setShowTemperaments] = useState(false)
  const [formData, setFormData] = useState({})
  
  const inputRef = useRef(null)
  const autoTimer = useRef(null)

  const temperamentOptions = useMemo(() => isCat ? [
    "Affectionate", "Active", "Energetic", "Intelligent", "Playful", "Curious",
    "Gentle", "Independent", "Loyal", "Social", "Friendly", "Calm", "Quiet",
    "Sweet", "Bold", "Easy Going", "Lively", "Interactive", "Agile", "Confident",
    "Courageous", "Docile", "Reserved", "Protective", "Loving", "Trainable",
    "Mischievous", "Shy", "Talkative", "Adaptable"
  ] : [
    'Stubborn', 'Curious', 'Playful', 'Adventurous', 'Active', 'Fun-loving', 'Aloof', 'Clownish',
    'Dignified', 'Independent', 'Happy', 'Outgoing', 'Friendly', 'Alert', 'Confident', 'Intelligent',
    'Courageous', 'Docile', 'Responsive', 'Composed', 'Receptive', 'Faithful', 'Affectionate',
    'Devoted', 'Loyal', 'Assertive', 'Energetic', 'Gentle', 'Dominant', 'Reserved', 'Protective',
    'Kind', 'Sweet-Tempered', 'Loving', 'Tenacious', 'Attentive', 'Obedient', 'Trainable', 'Steady',
    'Bold', 'Proud'
  ], [isCat])

  const fields = useMemo(() => isCat ? [
    { key: 'lifeSpan', label: 'Life Span (e.g., 12-15 years)', type: 'text', isLifeSpan: true },
    { key: 'childFriendly', label: 'Child Friendly (1-5)', type: 'text' },
    { key: 'dogFriendly', label: 'Dog Friendly (1-5)', type: 'text' },
    { key: 'grooming', label: 'Grooming (1-5)', type: 'text' },
    { key: 'energyLevel', label: 'Energy Level (1-5)', type: 'text' },
    { key: 'strangerFriendly', label: 'Stranger Friendly (1-5)', type: 'text' },
    { key: 'affectionLevel', label: 'Affection Level (1-5)', type: 'text' },
    { key: 'sheddingLevel', label: 'Shedding Level (1-5)', type: 'text' }
  ] : [
    { key: 'weight', label: '(e.g. 10 - 20 kg)', type: 'text', isRange: true },
    { key: 'height', label: '(e.g. 10 - 20 cm)', type: 'text', isRange: true },
    { key: 'life_span', label: '(e.g. 10 - 14 years)', type: 'text', isRange: true },
    { key: 'good_with_children', label: 'Good with children (1-5)', type: 'text' },
    { key: 'good_with_other_dogs', label: 'Good with other dogs (1-5)', type: 'text' },
    { key: 'shedding', label: 'Shedding (1-5)', type: 'text' },
    { key: 'grooming', label: 'Grooming (1-5)', type: 'text' },
    { key: 'good_with_strangers', label: 'Good with strangers (1-5)', type: 'text' },
    { key: 'playfulness', label: 'Playfulness (1-5)', type: 'text' },
    { key: 'protectiveness', label: 'Protectiveness (1-5)', type: 'text' },
    { key: 'energy', label: 'Energy (1-5)', type: 'text' }
  ], [isCat])

  useEffect(() => {
    setName(initialData.name || '')
    const url = isCat ? initialData.imageUrl : (initialData.imageUrl || initialData.image_link || '')
    setPreview(url)
    setImageUrl(url)
    setPublicId(initialData.imagePublicId || initialData.publicId || '')
    
    let tempData = []
    if (Array.isArray(initialData.temperament)) {
      if (initialData.temperament.length === 1 && typeof initialData.temperament[0] === 'string') {
        tempData = initialData.temperament[0].split(',').map(s => s.trim()).filter(Boolean)
      } else {
        tempData = initialData.temperament
      }
    } else if (typeof initialData.temperament === 'string') {
      tempData = initialData.temperament.split(',').map(s => s.trim()).filter(Boolean)
    }

    const newFormData = { temperament: tempData }
    fields.forEach(field => {
      newFormData[field.key] = initialData[field.key] || ''
    })
    
    setFormData(newFormData)
  }, [initialData, fields, isCat])

  const isValidValue = useCallback((value, field) => {
    if (!value && value !== 0) return false
    const val = String(value).trim()
    
    if (field.isRange) {
      if (field.key === 'weight') return /^\d+\s*-\s*\d+\s*Kg$/i.test(val)
      if (field.key === 'height') return /^\d+\s*-\s*\d+\s*Cm$/i.test(val)
      if (field.key === 'life_span') return /^\d+\s*-\s*\d+\s*Years$/i.test(val)
    }
    
    if (field.isLifeSpan) {
      return /^\d+\s*-\s*\d+\s*years$/i.test(val)
    }
    
    const n = Number(val)
    return !isNaN(n) && n >= 1 && n <= 5
  }, [])

  const handleFieldChange = (value) => {
    const field = fields[step]
    let newValue = value
    const rangeRegex = /^\d+\s*-\s*\d+$/
    const hasTrailingSpace = value.endsWith(' ')
    const previousValue = formData[field.key] || ''
    const isDeleting = value.length < previousValue.length

    if (hasTrailingSpace && rangeRegex.test(value.trim())) {
      if (field.key === 'weight') newValue = `${value.trim()} kg`
      else if (field.key === 'height') newValue = `${value.trim()} cm`
      else if (field.key === 'life_span') newValue = `${value.trim()} years`
      else if (field.key === 'lifeSpan') newValue = `${value.trim()} years`
    }

    setFormData(prev => ({ ...prev, [field.key]: newValue }))

    if (isValidValue(newValue, field) || (newValue.trim() && (field.isLifeSpan || field.isRange))) {
      setError('')
      if (!isDeleting && step < fields.length - 1) {
        if (autoTimer.current) clearTimeout(autoTimer.current)
        autoTimer.current = setTimeout(() => setStep(s => s + 1), 800)
      }
    } else {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      let errorMsg = ''
      if (field.key === 'weight') errorMsg = 'Format: "10 - 20 kg"'
      else if (field.key === 'height') errorMsg = 'Format: "20 - 30 cm"'
      else if (field.key === 'life_span') errorMsg = 'Format: "10 - 15 years"'
      else if (field.key === 'lifeSpan') errorMsg = 'Format: "10 - 15 years"'
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

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const currentField = fields[step]
    
    if (!isValidValue(formData[currentField.key], currentField)) {
      if (!formData[currentField.key]?.trim()) {
        setError(`${currentField.label} is required`)
      }
      return
    }

    if (formData.temperament?.length === 0) {
      setError("Select at least one temperament")
      return
    }

    const payload = {
      ...initialData,
      name,
      imageUrl,
      imagePublicId: publicId,
      temperament: formData.temperament.join(', ')
    }

    if (!isCat) {
      payload.image_link = imageUrl
      payload.publicId = publicId
    }

    fields.forEach(field => {
      if (field.isRange || field.isLifeSpan) {
        payload[field.key] = formData[field.key]
      } else {
        payload[field.key] = formData[field.key] === '' ? 0 : Number(formData[field.key])
      }
    })

    await onSubmit(payload)
  }

  return {
    state: { name, preview, imageUrl, uploading, step, error, showTemperaments, formData, temperamentOptions, fields, isCat },
    handlers: { setName, setImageUrl, setPreview, setShowTemperaments, setFormData, handleFieldChange, handleManualStep, handleFileChange, handleFormSubmit },
    refs: { inputRef }
  }
}