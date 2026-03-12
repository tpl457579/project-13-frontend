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
import LoginRequired from './components/LoginRequired/LoginRequired.jsx'
import CookieConsent, { Cookies } from "react-cookie-consent"
import { PiCookieThin } from "react-icons/pi"
import Privacy from './Pages/Privacy.jsx'




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

      <CookieConsent
  location="bottom"
  buttonText="Accept All"
  declineButtonText="Decline"
  enableDeclineButton
  cookieName="myAppCookieConsent"
  expires={150}
  onAccept={() => {
    Cookies.set('analytics', 'true')
    Cookies.set('marketing', 'true')
  }}
  onDecline={() => {
    Cookies.remove('analytics')
    Cookies.remove('marketing')
  }}
  style={{ background: '#1a1a1a' }}
  buttonStyle={{ background: '#8e44ad', color: '#fff', borderRadius: '6px' }}
  declineButtonStyle={{ background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '6px' }}
  customButtons={[
    {
      label: 'Essentials Only',
      onClick: () => {
        Cookies.set('myAppCookieConsent', 'essentials')
        Cookies.remove('analytics')
        Cookies.remove('marketing')
      },
      style: { background: 'transparent', border: '1px solid #8e44ad', color: '#a78bfa', borderRadius: '6px', cursor: 'pointer' }
    }
  ]}
>
  <PiCookieThin /> Cookies are yummy!!{' '}
  <a href="/privacy" style={{ color: '#a78bfa' }}>Learn more</a>
</CookieConsent>

      <Header />

      <Routes>
        <Route path='/' element={<Home />} />

<Route path='/privacy' element={<Privacy />} />
<Route path='/pet-services' element={<LoginRequired><PetServices /></LoginRequired>} />
<Route path='/favourites' element={<LoginRequired><FavouritesPage /></LoginRequired>} />
<Route path='/profile' element={<LoginRequired><Profile /></LoginRequired>} />
<Route path='/dog-search' element={<LoginRequired><AnimalSearch type='dog' /></LoginRequired>} />
<Route path='/cat-search' element={<LoginRequired><AnimalSearch type='cat' /></LoginRequired>} />
<Route path='/suitable-dog' element={<LoginRequired><SuitableAnimal type='dog' /></LoginRequired>} />
<Route path='/suitable-cat' element={<LoginRequired><SuitableAnimal type='cat' /></LoginRequired>} />

       <Route path="/shop-dogs" element={<Shop animalType="dog" />} />
<Route path="/shop-cats" element={<Shop animalType="cat" />} />
<Route path="/shop" element={<Navigate to={animalType === 'cat' ? '/shop-cats' : '/shop-dogs'} replace />} />

        <Route path='/guess-the-dog' element={<GuessTheDog />} />
       <Route path="/match-the-cats" element={<MatchTheCats />} />

        <Route path='/fun-dog-facts' element={<FunAnimalFacts type='dog' />} />
        <Route path='/fun-cat-facts' element={<FunAnimalFacts type='cat' />} />

        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

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
