import { useMemo, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import './PaginationControls.css'

const PaginationControls = ({ currentPage, totalPages, goPrev, goNext }) => {
  if (totalPages <= 1) return null

  const isFirstPage = useMemo(() => currentPage === 1, [currentPage])
  const isLastPage = useMemo(
    () => currentPage === totalPages,
    [currentPage, totalPages]
  )

  const handlePrev = useCallback(() => {
    if (!isFirstPage) goPrev()
  }, [isFirstPage, goPrev])

  const handleNext = useCallback(() => {
    if (!isLastPage) goNext()
  }, [isLastPage, goNext])

  return (
    <div className='pagination'>
      <Button variant='primary' onClick={handlePrev} disabled={isFirstPage}>
        Prev
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button variant='primary' onClick={handleNext} disabled={isLastPage}>
        Next
      </Button>
    </div>
  )
}

export default PaginationControls
