import { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import ShowPopup from '../ShowPopup/ShowPopup'
import ProductCard from '../ProductCard/ProductCard.jsx'

const ShopProductCard = ({ product, isFavourite, onToggleFavourite, disabled, className }) => {
  const { user } = useContext(AuthContext)

  const handleFavouriteClick = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (disabled) return

    if (!user?._id) {
      ShowPopup('You must be logged in to add favourites', 'error')
      return
    }

    onToggleFavourite(product._id)
  }

  return (
    <ProductCard
      product={product}
      isFavourite={isFavourite}
      onToggleFavourite={handleFavouriteClick}
      showHeart={true}
      showAdminActions={false}
      className={className || "shop-product-card"}
      disabled={disabled}
    />
  )
}

export default ShopProductCard