import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/About'
import ContactUsPage from './pages/Contact'
import AuthPage from './pages/Login'
import BookingPage from './pages/Booking'
import HotelManagementDashboard from './pages/dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' Component={HomePage}/>
          <Route path='/about' Component={AboutUsPage}/>
          <Route path='/contact' Component={ContactUsPage}/>
          <Route path='/login' Component={AuthPage} />
          <Route path='/booking' Component={BookingPage} />
          <Route path='/dashboard' Component={HotelManagementDashboard} />
        </Routes>
      </Router>
    </>
  )
}

export default App
