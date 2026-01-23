import { useContext } from 'react'
import { AuthContext } from '/src/components/AuthContext'
import { showPopup } from '../ShowPopup/ShowPopup.js'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import './FavouriteCard.css'

const FavouriteCard = ({ product, isFavourite, onToggleFavourite, disabled, className }) => {
  if (!product || !product._id) return null
  
  const { user } = useContext(AuthContext)

  const handleFavouriteClick = () => {
    if (!user?._id || !user?.token) {
      showPopup('You must be logged in to add favourites', 'error')
      return
    }
    onToggleFavourite(product)
  }

  return (
    <div className={`favourite-card ${className || ''}`}>
      <div className="favourite-card-image-wrapper">
        <img
          className='favourite-card-img'
          src={product.imageUrl}
          alt={product.name || 'Product'}
        />
        
        <button
          onClick={handleFavouriteClick}
          disabled={disabled}
          className={`heart-btn ${isFavourite ? 'active' : ''}`}
        >
          <span className='heart-icon'>
            {isFavourite ? (
              <AiFillHeart size={24} color="#ff4d4d" />
            ) : (
              <AiOutlineHeart size={24} />
            )}
          </span>
        </button>
      

      <div className='favourite-card-info'>
        <h3>{product.name || 'Unnamed'}</h3>
        <p className='price'>Price: €{product.price?.toFixed(2) || '0.00'}</p>
        {product.rating != null && (
          <p className='rating'>Rating: {product.rating} ⭐️</p>
        )}
        </div>
      </div>
    </div>
  )
}

export default FavouriteCard