import { useContext } from 'react'
import { AuthContext } from '/src/components/AuthContext'
import ShowPopup from '../ShowPopup/ShowPopup'
import ProductCard from '../ProductCard/ProductCard.jsx'

const ShopProductCard = ({ product, isFavourite, onToggleFavourite, disabled }) => {
  const { user } = useContext(AuthContext)

  const handleFavouriteClick = () => {
    if (disabled) return

    if (!user?._id || !user?.token) {
      ShowPopup('You must be logged in to add favourites', 'error')
      return
    }

    onToggleFavourite(product)
  }

  return (
    <ProductCard
      product={product}
      isFavourite={isFavourite}
      onToggleFavourite={handleFavouriteClick}
      showHeart={true}
      showAdminActions={false}
      className="shop-product-card"
      disabled={disabled}
    />
  )
}

export default ShopProductCard