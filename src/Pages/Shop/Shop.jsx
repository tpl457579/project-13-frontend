import './Shop.css'
import { useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import { AnimalContext } from '../../components/AnimalContext.jsx'
import { useProducts } from '../../Hooks/useProducts.js'
import { useFilters } from '../../Hooks/useFilters.js'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFavourites } from '../../Hooks/useFavourites.js'
import { usePagination } from '../../Hooks/usePagination.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls.jsx'
import ShopProductCard from '../../components/ShopProductCard/ShopProductCard.jsx'
import SearchBar from '../../components/SearchBar/SearchBar'
import Loader from '../../components/Loader/Loader.jsx'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { animalType } = useContext(AnimalContext)
  const petType = animalType
  
  const { products, loadingInitial, error } = useProducts()
  const { favourites, toggleFavourite } = useFavourites()
  
  const [activeCategory, setActiveCategory] = useState('All')

  const {
    searchTerm, setSearchTerm,
    size, setSize,
    maxPrice, setMaxPrice,
    minRating, setMinRating,
    filteredProducts, clearFilters
  } = useFilters(products)

  const finalProducts = useMemo(() => {
    if (!filteredProducts) return []
    
    let list = filteredProducts

    if (petType) {
      list = list.filter(p => {
        const pType = String(p.petType || '').toLowerCase()
        const aType = String(p.animalType || '').toLowerCase()
        return pType === petType.toLowerCase() || aType === petType.toLowerCase()
      })
    }

    if (activeCategory !== 'All') {
      list = list.filter(p => {
        const dbCategory = p.category ? String(p.category).trim().toLowerCase() : ''
        const uiCategory = activeCategory.trim().toLowerCase()
        return dbCategory === uiCategory
      })
    }
    
    return list
  }, [filteredProducts, activeCategory, petType])

  const {
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    setPage
  } = usePagination(finalProducts, 12, 'shop_page')

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setActiveCategory('All')
    setPage(1)
  }, [clearFilters, setPage])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const favouriteIds = useMemo(() => 
    new Set(favourites.map(f => f._id)), 
  [favourites])

  useEffect(() => {
    setPage(1)
  }, [petType, activeCategory, setPage])

  return (
    <div className='shop'>
      <h1>{petType ? `${petType.charAt(0).toUpperCase() + petType.slice(1)} Shop` : 'Pet Lovers Shop'}</h1>

      <div className="category-tabs">
        {['All', 'Toys', 'Food', 'Clothing'].map(cat => (
          <button 
            key={cat} 
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search ${activeCategory === 'All' ? 'products' : activeCategory.toLowerCase()}...`}
      />

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <FilterControls
          showSize={petType !== 'cat'}
          size={size}
          setSize={setSize}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          clearFilters={handleClearFilters}
        />
      </div>

      {loadingInitial && <Loader />}
      {error && <p className="error-message">Error: {error}</p>}

      {!loadingInitial && finalProducts.length === 0 && (
        <p className="no-results">No {petType} products found.</p>
      )}

      <div className='shop-products'>
        {visibleProducts.map((product) => (
          <ShopProductCard
            key={product?._id}
            product={product}
            isFavourite={favouriteIds.has(product?._id)}
            onToggleFavourite={toggleFavourite}
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