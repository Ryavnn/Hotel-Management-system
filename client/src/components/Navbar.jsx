import { Link } from "react-router";
function Navbar() {
  return (
    <>
    <nav className="nav-bar">
        <div className="logo">
            <h1>furniture</h1>
        </div>
        <div className="center-nav">
            <ul className="short-links">
                <Link className="links" to="/">Home</Link>
                <Link className="links">Rooms</Link>
                <Link className="links" to="/about">About</Link>
                <Link className="links" to="/contact">Contact</Link>
            </ul>
        </div>
        <div className="right-nav">
            <ul>
                <li className="cart-btn">Liked <span id="counter">0</span></li>
                <Link to="/login">Log in</Link>
            </ul>
        </div>
    </nav>
    </>
  );
}
export default Navbar;
