import { createContext, useState, useEffect } from 'react'
import ShowPopup from './ShowPopup/ShowPopup'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [favourites, setFavourites] = useState(() => {
    const storedFavs = localStorage.getItem('favourites')
    return storedFavs ? JSON.parse(storedFavs) : []
  })

  const updateFavourites = (newFavourites) => {
    setFavourites(newFavourites)
    localStorage.setItem('favourites', JSON.stringify(newFavourites))
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setFavourites([])
    localStorage.removeItem('user')
    localStorage.removeItem('favourites')
    ShowPopup('Logged out successfully')
  }

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, setUser, favourites, updateFavourites, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
