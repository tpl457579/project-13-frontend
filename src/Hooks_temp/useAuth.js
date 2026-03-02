import { useContext } from 'react'
import { AuthContext } from '../components/AuthContext'

export function useAuth() {
  const { user, setUser, favourites, updateFavourites } =
    useContext(AuthContext)
  return { user, setUser, favourites, updateFavourites }
}
