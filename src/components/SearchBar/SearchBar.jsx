import { useMemo, useCallback } from 'react'
import './SearchBar.css'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const handleClear = useCallback(() => {
    onChange({ target: { value: '' } })
  }, [onChange])

  const ClearButton = useMemo(() => {
    if (!value) return null
    return (
      <span className='clear-search' onClick={handleClear}>
        &times;
      </span>
    )
  }, [value, handleClear])

  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {ClearButton}
    </div>
  )
}

export default SearchBar
