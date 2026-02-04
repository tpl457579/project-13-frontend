import React from 'react'
import './DogLoader.css'

const DogLoader = () => {
  return (
    <div className='dog-loader-overlay'>
      <img
        src='../dog1.png'
        className='dog-loader-icon'
        alt='Loading...'
      />
    </div>
  )
}

export default DogLoader
