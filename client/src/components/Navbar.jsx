import { Link } from "react-router-dom"; // Fix incorrect import
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status from local storage or authentication context
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user); // Convert to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user session
    setIsLoggedIn(false); // Update state
  };

  return (
    <nav className="nav-bar">
      <div className="logo">
        <h1>Furniture</h1>
      </div>
      <div className="center-nav">
        <ul className="short-links">
          <Link className="links" to="/">
            Home
          </Link>
          <Link className="links" to="/rooms">
            Rooms
          </Link>
          <Link className="links" to="/about">
            About
          </Link>
          <Link className="links" to="/contact">
            Contact
          </Link>
        </ul>
      </div>
      <div className="right-nav">
        <ul>
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <Link className="login-btn" to="/login">
              Log in
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
