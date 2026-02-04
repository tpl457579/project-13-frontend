import { useState, useCallback, useEffect, useContext } from 'react'
import ShowPopup from '../components/ShowPopup/ShowPopup'
import { AuthContext } from '../components/AuthContext'
import { apiFetch } from '../components/apiFetch'

export const useFavourites = () => {
  const { user, updateFavourites: updateUserFavourites } =
    useContext(AuthContext)
  const [favourites, setFavourites] = useState([])
  const [loadingIds, setLoadingIds] = useState([])

  const fetchFavourites = useCallback(async () => {
    if (!user || !user._id || !user.token) return
    try {
      const data = await apiFetch(`/users/${user._id}/favourites`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${user.token}` }
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
      if (!user || !user._id || !user.token) {
        ShowPopup('You must be logged in', 'error')
        return
      }

      if (!product || !product._id) return

      const exists = favourites.some((f) => f._id === product._id)

      const updatedFavourites = exists
        ? favourites.filter((f) => f._id !== product._id)
        : [...favourites, product]

      setFavourites(updatedFavourites)
      updateUserFavourites(updatedFavourites)
      setLoadingIds((prev) => [...prev, product._id])

      try {
        const data = await apiFetch(`/users/favourites/${product._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}` }
        })

        if (Array.isArray(data.favourites)) {
          setFavourites(data.favourites)
          updateUserFavourites(data.favourites)
        }

        ShowPopup(exists ? 'Removed from favourites' : 'Added to favourites')
      } catch (err) {
        console.error('toggleFavourite error:', err)
        ShowPopup('Something went wrong')
        fetchFavourites()
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== product._id))
      }
    },
    [user, favourites, updateUserFavourites, fetchFavourites]
  )

  useEffect(() => {
    if (!user || !user._id || !user.token) return
    fetchFavourites()
  }, [user, fetchFavourites])

  return { favourites, loadingIds, fetchFavourites, toggleFavourite }
}
