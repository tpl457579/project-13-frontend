import './FilterControls.css'
import { useCallback } from 'react'
import Button from '../components/Buttons/Button'

const FilterControls = ({
  size,
  setSize,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  clearFilters,
  mode = "default"
}) => {
  const handleSizeChange = useCallback(
    (e) => setSize(e.target.value),
    [setSize]
  )

  const handlePriceChange = useCallback(
    (e) => setMaxPrice(e.target.value),
    [setMaxPrice]
  )

  const handleRatingChange = useCallback(
    (e) => setMinRating(e.target.value),
    [setMinRating]
  )

  const handleClear = () => {
    clearFilters()
    sessionStorage.removeItem('admin_products_scroll')
    window.scrollTo(0, 0)
  }

  return (
    <div className='filter'>
      {setSize && (
        <select className='select' value={size} onChange={handleSizeChange}>
          <option value=''>Dog Size</option>
          <option value='small'>Small</option>
          <option value='medium'>Medium</option>
          <option value='large'>Large</option>
        </select>
      )}

      {setMaxPrice && (
        mode === "admin" ? (
          <select className='select' value={maxPrice} onChange={handlePriceChange}>
            <option value=''>Price</option>
            <option value='under10'>Under €10</option>
            <option value='10to25'>€10 – €25</option>
            <option value='25to50'>€25 – €50</option>
            <option value='50plus'>€50 and more</option>
          </select>
        ) : (
          <input
            className='input'
            type='number'
            placeholder='Max Price'
            value={maxPrice}
            onChange={handlePriceChange}
          />
        )
      )}

      {setMinRating && (
        <select className='select' value={minRating} onChange={handleRatingChange}>
          {mode === "admin" ? (
            <>
              <option value=''>Rating</option>
              <option value='1'>⭐ 1 and under</option>
              <option value='2'>⭐ 2 and under</option>
              <option value='3'>⭐ 3 and under</option>
              <option value='4'>⭐ 4 and under</option>
            </>
          ) : (
            <>
              <option value=''>Rating</option>
              <option value='1'>⭐ 1+</option>
              <option value='2'>⭐ 2+</option>
              <option value='3'>⭐ 3+</option>
              <option value='4'>⭐ 4+</option>
            </>
          )}
        </select>
      )}

      <Button
        variant='secondary'
        className='clear-filters-button'
        onClick={handleClear}
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default FilterControls
