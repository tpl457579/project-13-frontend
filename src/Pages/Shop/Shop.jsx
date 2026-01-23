import './Shop.css'
import { useContext, useCallback } from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import { useProducts } from '../../Hooks/useProducts.js'
import { useFilters } from '../../Hooks/useFilters.js'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFavourites } from '../../Hooks/useFavourites.js'
import { usePagination } from '../../Hooks/usePagination.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls.jsx'
import ShopProductCard from '../../components/ShopProductCard/ShopProductCard.jsx'
import SearchBar from '../../components/SearchBar/SearchBar'
import DogLoader from '../../components/DogLoader/DogLoader.jsx'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { products, loadingInitial, error } = useProducts()
  const { favourites, toggleFavourite, loadingIds } = useFavourites(user)

  const {
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredProducts,
    clearFilters
  } = useFilters(products)

  const {
    currentPage,
    totalPages,
    paginatedData: currentItems,
    setPage
  } = usePagination(filteredProducts, 8)

  const handleSearchChange = useCallback(
    (e) => setSearchTerm(e.target.value),
    [setSearchTerm]
  )

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setPage(1)
  }, [clearFilters, setPage])

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1))
  }, [setPage])

  const handleNextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }, [setPage, totalPages])

  return (
    <div className='shop'>
      <h1>Dog Lovers Shop</h1>

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder='Search products...'
      />

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
      {error && <p>Error: {error}</p>}

      <div className='shop-products'>
        {currentItems
          .filter((product) => product && product._id)
          .map((product) => {
            const isFavourite = favourites.some((f) => f._id === product._id)
            const isDisabled = loadingIds.includes(product._id)

            return (
              <ShopProductCard
                className='shop-product-card'
                key={product._id}
                product={product}
                isFavourite={isFavourite}
                onToggleFavourite={() => toggleFavourite(product)}
                disabled={isDisabled}
              />
            )
          })}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        goPrev={handlePrevPage}
        goNext={handleNextPage}
      />
    </div>
  )
}

export default Shop
