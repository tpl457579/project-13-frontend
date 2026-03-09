import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import Header from './components/Header/Header.jsx'
import Home from './Pages/Home/Home.jsx'
import GuessTheDog from './Pages/GuessTheDog/GuessTheDog.jsx'
import MatchTheCats from './Pages/MatchTheCats/MatchTheCats.jsx'
import ChatWidget from './components/ChatButton/ChatButton.jsx'
import Shop from './Pages/Shop/Shop.jsx'
import RegisterPage from './Pages/Register/Register.jsx'
import LoginPage from './Pages/Login/Login.jsx'
import FavouritesPage from './Pages/FavouritesPage/FavouritesPage.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import AdminProducts from './Pages/AdminProducts/AdminProducts.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx'
import { Footer } from './components/Footer/Footer.jsx'
import usePetType from './Hooks/usePetType'
import PetInsurancePopup from './components/PetInsurancePopup/PetInsurancePopup.jsx'
import SuitableAnimal from './Pages/SuitableAnimal/SuitableAnimal.jsx'
import FunAnimalFacts from './Pages/FunAnimalFacts/FunAnimalFacts.jsx'
import AnimalSearch from './Pages/AnimalSearch/AnimalSearch.jsx'
import AdminAnimals from './Pages/AdminAnimals/AdminAnimals.jsx';
import { useScreenToggle } from './Hooks/useScreenToggle.js'
import PetServices from './Pages/PetServices/PetServices.jsx'
import { AnimalContext } from './components/AnimalContext.jsx'

const App = () => {
  const location = useLocation()
  const { animalType } = useContext(AnimalContext)
  const { isFullscreen } = useScreenToggle()
  const navigate = useNavigate()

 useEffect(() => {
    if (location.pathname === '/shop-dogs' && animalType === 'cat') {
      navigate('/shop-cats', { replace: true })
    } else if (location.pathname === '/shop-cats' && animalType === 'dog') {
      navigate('/shop-dogs', { replace: true })
    }
  }, [animalType])

  useEffect(() => {
  if (document.fullscreenElement) {
    document.exitFullscreen?.()
  }
}, [location.pathname])

  return (
    <div>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />

       <Route path="/shop-dogs" element={<Shop animalType="dog" />} />
<Route path="/shop-cats" element={<Shop animalType="cat" />} />
<Route path="/shop" element={<Navigate to={animalType === 'cat' ? '/shop-cats' : '/shop-dogs'} replace />} />

        <Route path='/guess-the-dog' element={<GuessTheDog />} />
       <Route path="/match-the-cats" element={<MatchTheCats />} />

       <Route path='/pet-services' element={<PetServices />} />

        <Route path='/fun-dog-facts' element={<FunAnimalFacts type='dog' />} />
        <Route path='/fun-cat-facts' element={<FunAnimalFacts type='cat' />} />

        <Route path='/suitable-dog' element={<SuitableAnimal type='dog' />} />
        <Route path='/suitable-cat' element={<SuitableAnimal type='cat' />} />

        <Route path='/dog-search' element={<AnimalSearch type='dog' />} />
        <Route path='/cat-search' element={<AnimalSearch type='cat' />} />

        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

        <Route path='/favourites' element={<FavouritesPage />} />
        <Route path='/profile' element={<Profile />} />

        <Route
          path='/admin-products'
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route path='/admin-dogs' element={<ProtectedRoute requireAdmin={true}><AdminAnimals type='dog' /></ProtectedRoute>} />
        <Route path='/admin-cats' element={<ProtectedRoute requireAdmin={true}><AdminAnimals type='cat' /></ProtectedRoute>} />

        <Route path='/admin' element={<Navigate to='/admin-products' replace />} />
      </Routes>

      <ThemeToggle />
      <ChatWidget />
        <PetInsurancePopup />
       

    {!location.pathname.startsWith('/admin') && !isFullscreen && <Footer />}
    </div>
  )
}

export default App
