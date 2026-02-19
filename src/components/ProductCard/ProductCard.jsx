import { useContext, useRef } from 'react'
import mojs from '@mojs/core'
import { AuthContext } from '/src/components/AuthContext'
import ShowPopup from '../ShowPopup/ShowPopup.js'
import { AiFillHeart, AiOutlineHeart, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { GiRoundStar } from "react-icons/gi"
import './ProductCard.css'

const ProductCard = ({ 
  product, 
  isFavourite, 
  onToggleFavourite, 
  showHeart = false,
  showAdminActions = true,
  showPrice = true,
  showRating = true,
  onEdit,
  onDelete,
  className = '',
  disabled = false
}) => {
  if (!product || !product._id) return null
  
  const { user } = useContext(AuthContext)
  const buttonRef = useRef(null)

const handleFavouriteClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  console.log('❤️ Heart clicked!')
  console.log('🎁 Full product object:', product) // Add this
  console.log('🆔 Product ID:', product._id) // Add this
  console.log('📞 Calling onToggleFavourite with:', product) // Add this
  
  if (disabled) {
    console.log('❌ Button disabled')
    return
  }
  
  if (!user?._id) {
    ShowPopup('You must be logged in to add favourites', 'error')
    return
  }
  
  if (!onToggleFavourite) {
    console.error('❌ onToggleFavourite is not defined!')
    return
  }
  
  if (!isFavourite) animateHeart()
  
  console.log('🚀 RIGHT BEFORE calling onToggleFavourite') // Add this
  onToggleFavourite(product)
  console.log('✅ AFTER calling onToggleFavourite') // Add this
}

  const animateHeart = () => {
    if (!buttonRef.current) return
    const scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0')
    const burst1 = new mojs.Burst({
      parent: buttonRef.current,
      radius: { 0: 55 },
      angle: { 0: 45 },
      count: 15,
      children: { shape: 'circle', radius: 5, fill: ['#ff0000', 'var(--accent-color)'], duration: 500 }
    })
    const scaleTween = new mojs.Tween({
      duration: 1200,
      onUpdate: (p) => {
        const s = scaleCurve(p)
        if (buttonRef.current) buttonRef.current.style.transform = `scale3d(${s}, ${s}, 1)`
      }
    })
    new mojs.Timeline().add(burst1, scaleTween).play()
  }

  return (
    <div className={`product-card ${className} ${disabled ? 'product-card-disabled' : ''}`}>
      <div className="product-card-img">
        <a href={product.url || '#'} target='_blank' rel='noopener noreferrer'>
          <img src={product.imageUrl || product.image_link} alt={product.name} />
        </a>
      </div>

      <div className='product-card-info'>
        <a href={product.url || '#'} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>
          <h4>{product.name || 'Unnamed'}</h4>
        </a>

        {product.temperament && (
          <p className="product-temperaments">
            {Array.isArray(product.temperament) 
              ? product.temperament.join(', ') 
              : product.temperament}
          </p>
        )}

        {showPrice && product.price && <p>Price: €{Number(product.price).toFixed(2)}</p>}
        {showRating && product.rating != null && (
          <p className="rating-line">
            Rating: {product.rating}
            <span className="star">
              <GiRoundStar />
            </span>
          </p>
        )}

        {showHeart && (
          <button
            ref={buttonRef}
            type="button"
            onClick={handleFavouriteClick}
            disabled={disabled}
            className={`heart-btn ${isFavourite ? 'active' : ''}`}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {isFavourite ? <AiFillHeart size={28} color="red" /> : <AiOutlineHeart size={28} />}
          </button>
        )}

        {!showHeart && showAdminActions && (
          <div className="product-buttons">
            <button type="button" disabled={disabled} onClick={() => onEdit(product)}>
              <AiOutlineEdit size={18}/> Edit
            </button>
            <button type="button" disabled={disabled} onClick={() => onDelete(product)}>
              <AiOutlineDelete size={18}/> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard