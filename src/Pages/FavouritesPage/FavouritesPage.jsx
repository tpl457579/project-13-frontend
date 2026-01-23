import { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import { usePagination } from '../../Hooks/usePagination'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import FavouriteCard from '../../components/FavouriteCard/FavouriteCard'
import DogLoader from '../../components/DogLoader/DogLoader'
import './FavouritesPage.css'

const FavouritesPage = () => {
  const { user } = useContext(AuthContext)
  const { favourites, loading, loadingIds, toggleFavourite } = useFavourites()
  const [showEmptyMessage, setShowEmptyMessage] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const isLoggedIn = Boolean(user?._id)

  const {
    currentPage,
    totalPages,
    paginatedData: currentFavourites,
    setPage
  } = usePagination(favourites, 8)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsReady(true), 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    if (isReady && favourites.length === 0) {
      const timer = setTimeout(() => setShowEmptyMessage(true), 10000)
      return () => clearTimeout(timer)
    } else {
      setShowEmptyMessage(false)
    }
  }, [isReady, favourites])

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1))
  }, [setPage])

  const handleNextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }, [setPage, totalPages])

  if (!isLoggedIn) {
    return (
      <p className='fav-page-text'>Please log in to see your favourites.</p>
    )
  }

  if (loading || !isReady) {
    return (
      <main className='favourites-page'>
        <h2>My Favourites</h2>
        <DogLoader />
      </main>
    )
  }

  return (
    <main className='favourites-page'>
      <h1>My Favourites</h1>
      {favourites.length === 0 && showEmptyMessage ? (
        <p className='fav-page-text'>You have no favourites yet.</p>
      ) : (
        <>
          <div className='favourites-products'>
            {currentFavourites.map(({ _id, ...rest }) => (
              <FavouriteCard className='favourite-card'
                key={_id}
                product={{ _id, ...rest }}
                isFavourite
                onToggleFavourite={toggleFavourite}
                disabled={loadingIds.includes(_id)}
              />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            goPrev={handlePrevPage}
            goNext={handleNextPage}
          />
        </>
      )}
    </main>
  )
}

export default FavouritesPage
