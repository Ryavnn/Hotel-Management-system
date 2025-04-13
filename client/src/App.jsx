import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // ✅ Fix import
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/About";
import ContactUsPage from "./pages/Contact";
import AuthPage from "./pages/Login";
import BookingPage from "./pages/Booking";
import Dashboard from "./pages/dashboard";
import HotelRooms from "./pages/Rooms";
import PropTypes from "prop-types";// Import the Rooms component

function App() {
  const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/login" />;
  };

  ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/rooms" element={<HotelRooms />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
