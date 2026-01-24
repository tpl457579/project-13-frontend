import './ProductForm.css'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'
import { apiFetch } from '../apiFetch'

const PLACEHOLDER = './assets/images/placeholder.png'

const isValidProductUrl = (url) => {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

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
      <p>
        Drag & drop an image here, or{' '}
        <span className='browse-link'>browse</span>
      </p>
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

export default function ProductForm({
  initialData = {},
  onSubmit,
  isSubmitting,
  onCancel
}) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [preview, setPreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [publicId, setPublicId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [metadata, setMetadata] = useState({})
  const [rating, setRating] = useState('')
  const previewUrlRef = useRef(null)

  useEffect(() => {
    setName(initialData.name || '')
    setPrice(initialData.price || '')
    setPreview(initialData.imageUrl || '')
    setImageUrl(initialData.imageUrl || '')
    setRating(initialData.rating || '')
    setPublicId(initialData.imagePublicId || '')
    setProductUrl(initialData.url || '')
  }, [initialData])

  useEffect(() => {
    if (initialData?._id) return
    if (!isValidProductUrl(productUrl)) return

    const fetchMetadata = async () => {
      setFetchingMetadata(true)
      try {
        if (!productUrl || !productUrl.trim()) return
        
        const data = await apiFetch('/products/fetch-metadata', {
          method: 'POST',
          data: { url: productUrl.trim() }
        })
        setMetadata(data)
      } catch (err) {
        console.error('Failed to fetch metadata:', err)
      } finally {
        setFetchingMetadata(false)
      }
    }
    fetchMetadata()
  }, [productUrl, initialData?._id])

  useEffect(() => {
    if (metadata.name) setName(metadata.name)
    if (metadata.price != null) setPrice(String(metadata.price))
    if (metadata.imageUrl) {
      setPreview(metadata.imageUrl)
      setImageUrl(metadata.imageUrl)
    }
    if (metadata.rating) setRating(metadata.rating)
  }, [metadata])

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
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (data.secure_url) {
        setImageUrl(data.secure_url)
        setPublicId(data.public_id)
        setPreview(data.secure_url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      price: Number(price),
      imageUrl,
      publicId,
      url: productUrl,
      rating: Number(rating) || 0
    })
  }

  const previewSrc = useMemo(() => preview || PLACEHOLDER, [preview])

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='edit-form' onSubmit={handleSubmit}>
        <h3>{initialData._id ? 'Edit' : 'Add'} Product</h3>

        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='number'
          step='0.01'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <div className='url-container'>
          <input 
            className='url-input'
            type='url'
            placeholder='Product URL'
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            required
          />
          {productUrl && (
            <a
              href={productUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='test-link-btn'
            >
              Test Link
            </a>
          )}
        </div>

        {fetchingMetadata && (
          <div className='metadata-spinner'>
            <Spinner />
            <p>Fetching metadata</p>
          </div>
        )}

        <DropZone handleFileChange={handleFileChange} />

        <div className='preview-image'>
          <img
            src={previewSrc}
            alt='Preview'
            onError={(e) => { e.target.src = PLACEHOLDER }}
          />
        </div>

        <div className='modal-buttons'>
          <Button
            type='submit'
            variant='primary'
            loading={isSubmitting || uploading}
            showSpinner
            loadingText={uploading ? 'Uploading' : 'Saving'}
          >
            {initialData._id ? 'Save' : 'Add'}
          </Button>
          <button type='button' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}