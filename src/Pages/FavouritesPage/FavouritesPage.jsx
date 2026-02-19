import './FavouritesPage.css'
import { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import { usePagination } from '../../Hooks/usePagination'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import ShopProductCard from '../../components/ShopProductCard/ShopProductCard'
import Loader from '../../components/Loader/Loader'

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
      const timer = setTimeout(() => setShowEmptyMessage(true), 5000)
      return () => clearTimeout(timer)
    } else {
      setShowEmptyMessage(false)
    }
  }, [isReady, favourites])

  useEffect(() => {
  console.log("Current User:", user);
  console.log("Favourites Array:", favourites);
  console.log("Loading Status:", { loading, isReady });
}, [user, favourites, loading, isReady]);

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

  if (loading || !isReady || (favourites.length === 0 && !showEmptyMessage)) {
    return (
      <main className='favourites-page'>
        <h2>My Favourites</h2>
        <Loader />
      </main>
    )
  }

  return (
    <main className='favourites-page'>
      <h1>My Favourites</h1>
      {favourites.length === 0 ? (
        <p className='fav-page-text'>You have no favourites yet.</p>
      ) : (
        <>
          <div className='favourites-products'>
            {currentFavourites.map(({ _id, ...rest }) => (
              <ShopProductCard
                className='favourites-card'
                key={_id}
                product={{ _id, ...rest }}
                isFavourite={true}
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