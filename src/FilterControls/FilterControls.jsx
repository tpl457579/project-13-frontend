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
  clearFilters
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

  const handleClear = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  return (
    <div className='filter'>
      <select className='select' value={size} onChange={handleSizeChange}>
        <option value=''>Dog Size</option>
        <option value='small'>Small</option>
        <option value='medium'>Medium</option>
        <option value='large'>Large</option>
      </select>

      <input
        className='input'
        type='number'
        placeholder='Max Price'
        value={maxPrice}
        onChange={handlePriceChange}
      />

      <select
        className='select'
        value={minRating}
        onChange={handleRatingChange}
      >
        <option value=''>Rating</option>
        <option value='1'>⭐ 1+</option>
        <option value='2'>⭐ 2+</option>
        <option value='3'>⭐ 3+</option>
        <option value='4'>⭐ 4+</option>
      </select>

      <Button
        variant='secondary'
        className='filter-button'
        onClick={handleClear}
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default FilterControls
