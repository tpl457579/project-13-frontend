import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './Pages/Home/Home.jsx'
import GuessTheDog from './Pages/GuessTheDog/GuessTheDog.jsx'
import FunDogFacts from './Pages/FunDogFacts/FunDogFacts.jsx'
import ChatWidget from './components/ChatButton/ChatButton.jsx'
import SuitableDog from './Pages/SuitableDog/SuitableDog.jsx'
import Shop from './Pages/Shop/Shop.jsx'
import Hamburger from './components/Hamburger/Hamburger.jsx'
import RegisterPage from './Pages/Register/Register.jsx'
import LoginPage from './Pages/Login/Login.jsx'
import FavouritesPage from './Pages/FavouritesPage/FavouritesPage.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import AdminProducts from './Pages/AdminProducts/AdminProducts.jsx'
import DogSearch from './Pages/DogSearch/DogSearch.jsx'
import CatSearch from './Pages/CatSearch/CatSearch.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx'
import { Footer } from './components/Footer/Footer.jsx'
import AdminDogs from './Pages/AdminDogs/AdminDogs.jsx'

const App = () => {
  const location = useLocation()

  return (
    <div>
      <Header />
      <Hamburger />
      <Routes>
  <Route path='/' element={<Home />} />
  
  <Route path='/shop-dogs' element={<Shop petType="dog" />} />
  <Route path='/shop-cats' element={<Shop petType="cat" />} />
  
  <Route path='/guess-the-dog' element={<GuessTheDog />} />
  <Route path='/guess-the-cat' element={<GuessTheDog petType="cat" />} />
  
  <Route path='/fun-dog-facts' element={<FunDogFacts />} />
  <Route path='/fun-cat-facts' element={<FunDogFacts petType="cat" />} />
  
  <Route path='/suitable-dog' element={<SuitableDog />} />
  <Route path='/suitable-cat' element={<SuitableDog petType="cat" />} />

  <Route path='/shop' element={<Shop />} />
  <Route path='/register' element={<RegisterPage />} />
  <Route path='/login' element={<LoginPage />} />

  <Route path='/dog-search' element={<DogSearch />} />
  <Route path='/cat-search' element={<CatSearch />} />
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
  <Route
    path='/admin-dogs'
    element={
      <ProtectedRoute requireAdmin={true}>
        <AdminDogs />
      </ProtectedRoute>
    }
  />
  
  <Route path='/admin' element={<Navigate to='/admin-products' replace />} />
</Routes>

      <ThemeToggle />
      <ChatWidget />
      

      {!location.pathname.startsWith('/admin') && <Footer />}
    </div>
  )
}

export default App