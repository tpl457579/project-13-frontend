import './Shop.css'
import { useContext, useCallback, useMemo } from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import { useProducts } from '../../Hooks/useProducts.js'
import { useFilters } from '../../Hooks/useFilters.js'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFavourites } from '../../Hooks/useFavourites.js'
import { usePagination } from '../../Hooks/usePagination.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import SearchBar from '../../components/SearchBar/SearchBar'
import DogLoader from '../../components/DogLoader/DogLoader.jsx'
import IdeaBulb from '../../components/IdeaBulb/IdeaBulb.jsx'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { products, loadingInitial, error } = useProducts()
  const { favourites, toggleFavourite, loadingIds } = useFavourites(user)

  const {
    searchTerm, setSearchTerm,
    size, setSize,
    maxPrice, setMaxPrice,
    minRating, setMinRating,
    filteredProducts, clearFilters
  } = useFilters(products)

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    setPage
  } = usePagination(filteredProducts, 12, 'shop_page');

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setPage(1)
  }, [clearFilters, setPage])

  const favouriteIds = useMemo(() => 
    new Set(favourites.map(f => f._id)), 
  [favourites])

  return (
    <div className='shop'>
      <h1>Dog Lovers Shop</h1>

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search products...'
      />
IdeaBulb()
      <FilterControls
        size={size}
        setSize={setSize}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        clearFilters={handleClearFilters}
      />

      {loadingInitial && <DogLoader />}
      {error && <p className="error-message">Error: {error}</p>}

      <div className='shop-products'>
        {visibleProducts.map((product) => (
          <ProductCard
            key={product?._id}
            product={product}
            isFavourite={favouriteIds.has(product?._id)}
            onToggleFavourite={() => toggleFavourite(product)}
            showHeart={true}
            showAdminActions={false}
            className='shop-product-card'
          />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          goPrev={() => setPage(p => Math.max(p - 1, 1))}
          goNext={() => setPage(p => Math.min(p + 1, totalPages))}
        />
      )}
    </div>
  )
}

export default Shop