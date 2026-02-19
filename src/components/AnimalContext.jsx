import React, { createContext, useState, useEffect } from 'react'

export const AnimalContext = createContext()

export const AnimalProvider = ({ children }) => {
  const [animalType, setAnimalType] = useState(
    localStorage.getItem('animalPreference') || 'dog'
  )

  const toggleAnimalType = () => {
    const newType = animalType === 'dog' ? 'cat' : 'dog'
    setAnimalType(newType)
    localStorage.setItem('animalPreference', newType)
  }

  return (
    <AnimalContext.Provider value={{ animalType, toggleAnimalType }}>
      {children}
    </AnimalContext.Provider>
  )
}