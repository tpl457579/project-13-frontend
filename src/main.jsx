import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext.jsx'
import { AnimalProvider } from './components/AnimalContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <AnimalProvider>
    <AuthProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
  </AnimalProvider>
)