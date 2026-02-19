import './Home.css'
import { useContext } from 'react'
import { AnimalContext } from '../../components/AnimalContext'

const Home = () => {
  const { animalType } = useContext(AnimalContext)

  return (
    <div className='home-container'>
      <h1 className='home-h1'>Welcome Pet Lovers!</h1>

      <div className='home'>
        <img
          className='home-img'
          src={
            animalType === 'cat'
              ? 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg'
              : animalType === 'dog'
              ? 'https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-beagle-1587053767.jpg?crop=0.651xw:1.00xh;0.114xw'
              : 'https://wallup.net/wp-content/uploads/2014/10/14/funny/Funny_Cat_And_Dog_Friend.jpg'
          }
          alt='Cute Pets'
        />
      </div>
    </div>
  )
}

export default Home