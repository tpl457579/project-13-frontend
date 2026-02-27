import './ProductForm.css'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'
import { apiFetch } from '../apiFetch'
import DropZone from '../DropZone/DropZone'
import { AiOutlineClose } from 'react-icons/ai'
import IdeaBulb from '../IdeaBulb/IdeaBulb'
import { useFullscreen } from '../../Hooks/useFullScreen'
import { Maximize, Minimize } from 'lucide-react'

const PLACEHOLDER = '../placeholder.png'

const isValidProductUrl = (url) => {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
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
  const [rating, setRating] = useState('')
  const previewUrlRef = useRef(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

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
    if (initialData?._id || !isValidProductUrl(productUrl)) return

    const fetchMetadata = async () => {
      setFetchingMetadata(true)
      try {
        const data = await apiFetch('/products/fetch-metadata', {
          method: 'POST',
          data: { url: productUrl.trim() }
        })
        if (data) {
          if (data.name) setName(data.name)
          if (data.price != null) setPrice(String(data.price))
          if (data.imageUrl) {
            setPreview(data.imageUrl)
            setImageUrl(data.imageUrl)
          }
          if (data.rating) setRating(data.rating)
        }
      } catch (err) {
        console.error('Metadata fetch error:', err)
      } finally {
        setFetchingMetadata(false)
      }
    }

    const timeoutId = setTimeout(fetchMetadata, 1000)
    return () => clearTimeout(timeoutId)
  }, [productUrl, initialData?._id])

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
      console.error('Upload error:', err)
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
      imagePublicId: publicId,
      url: productUrl,
      rating: Number(rating) || 0
    })
  }

  const previewSrc = useMemo(() => preview || PLACEHOLDER, [preview])
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='product-edit-form' onSubmit={handleSubmit}>
        <button className="product-form-fullscreen-btn" onClick={toggleFullscreen}>
  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
</button>
        <div className='modal-close' onClick={onCancel}>
          <AiOutlineClose size={24} />
        </div>

        <h3 className='product-edit-title'>
          {initialData._id ? 'Edit' : 'Add'} Product
        </h3>

        {fetchingMetadata && (
          <div className='metadata-spinner'>
            <Spinner />
            <p>Fetching details...</p>
          </div>
        )}

        <div className='product-layout'>
          <div className='product-visual'>
            <DropZone
              handleFileChange={handleFileChange}
              width="210px"
              height="60px"
              fontSize="14px"
              marginTop="0px"
            />
            <div className='product-preview-image'>
              <img
                src={previewSrc}
                alt='Preview'
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
            </div>
          </div>

          <div className='add-product-inputs'>
            <textarea
              className='product-name'
              placeholder='Product Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type='text'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <div className='url-container'>
              <input
                type='url'
                placeholder='Product URL'
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                required
              />
              <IdeaBulb
                className='product-form-tip'
                tip="ProductForm"
                storageKey="has_seen_product_form_tip"
              />
              {productUrl && isValidProductUrl(productUrl) && (
                <a
                  href={productUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='product-test-link-btn'
                >
                  Test Link
                </a>
              )}
            </div>

            <div className='add-product-modal-buttons'>
              <button type='button' className='cancel-btn' onClick={onCancel}>
                Cancel
              </button>
              <Button
                type='submit'
                variant='primary'
                loading={isSubmitting || uploading}
                showSpinner
                loadingText={uploading ? 'Uploading...' : 'Saving...'}
              >
                {initialData._id ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}