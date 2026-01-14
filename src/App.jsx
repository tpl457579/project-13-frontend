import { Route, Routes } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx'
import {Footer} from './components/Footer/Footer.jsx'

const App = () => {
  return (
    <div>
      <Header />
      <Hamburger />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/guess-the-dog' element={<GuessTheDog />} />
        <Route path='/fun-dog-facts' element={<FunDogFacts />} />
        <Route path='/suitable-dog' element={<SuitableDog />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dog-search' element={<DogSearch />} />
        <Route path='/favourites' element={<FavouritesPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ThemeToggle />
      <ChatWidget />
     {!location.pathname.startsWith('/admin') && <Footer />}

    </div>
  )
}

export default App
