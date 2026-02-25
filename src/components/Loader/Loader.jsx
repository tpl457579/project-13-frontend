import './Loader.css'
import React from 'react'
import { useContext } from 'react'
import { AnimalContext } from '../AnimalContext.jsx'

const dogIcon = '../../../dog1.png'
const catIcon = '../../../cat2.png' 

const Loader = () => {
  const { animalType } = useContext(AnimalContext) 
  
  const icon = animalType === 'dog' ? dogIcon : catIcon

  return (
    <div className='dog-loader-overlay'>
      <img
        src={icon}
        className='dog-loader-icon'
        alt='Loading..'
      />
    </div>
  )
}

export default Loader
