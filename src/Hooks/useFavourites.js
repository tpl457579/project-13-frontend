import { useState, useCallback, useEffect, useContext, useRef } from 'react'
import ShowPopup from '../components/ShowPopup/ShowPopup'
import { AuthContext } from '../components/AuthContext'
import { apiFetch } from '../components/apiFetch'

export const useFavourites = () => {
  const { user, updateFavourites: updateUserFavourites } = useContext(AuthContext)
  const [favourites, setFavourites] = useState([])
  const [loadingIds, setLoadingIds] = useState([])
  const hasFetched = useRef(false)

  const fetchFavourites = useCallback(async () => {
    if (!user || !user._id) return
    try {
      const data = await apiFetch(`/users/${user._id}/favourites`, {
        method: 'GET'
      })
      const favProducts = Array.isArray(data.favourites) ? data.favourites : []
      setFavourites(favProducts)
      updateUserFavourites(favProducts)
    } catch (err) {
      console.error('fetchFavourites error:', err)
    }
  }, [user, updateUserFavourites])

  const toggleFavourite = useCallback(
  async (product) => {
    if (!user || !user._id) {
      ShowPopup('You must be logged in', 'error')
      return
    }

    if (!product || !product._id) {
      return
    }

    const exists = favourites.some((f) => f._id === product._id)

    const updatedFavourites = exists
      ? favourites.filter((f) => f._id !== product._id)
      : [...favourites, product]

    setFavourites(updatedFavourites)
    updateUserFavourites(updatedFavourites)
    setLoadingIds((prev) => [...prev, product._id])

    try {
      const data = await apiFetch(`/users/favourites/${product._id}`, {
        method: 'PUT'
      })

      if (Array.isArray(data.favourites)) {
        setFavourites(data.favourites)
        updateUserFavourites(data.favourites)
      }

      ShowPopup(exists ? 'Removed from favourites' : 'Added to favourites')
    } catch (err) {
      console.error('toggleFavourite error:', err)
      ShowPopup('Something went wrong')
      setFavourites(favourites)
      updateUserFavourites(favourites)
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product._id))
    }
  },
  [user, favourites, updateUserFavourites]
)

  useEffect(() => {
    if (!user || !user._id) {
      hasFetched.current = false
      setFavourites([])
      return
    }
    
    if (!hasFetched.current) {
      fetchFavourites()
      hasFetched.current = true
    }
  }, [user?._id, fetchFavourites])

  return { favourites, loadingIds, fetchFavourites, toggleFavourite }
}