import type { FC } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';
import { useCart } from '../context/CartContext';

const Navbar: FC = () => {
  const { totalItems } = useCart();
  const isLoggedIn = !!localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <nav className="nav">
      <div className="nav__logo">
        <Link to="/home">AIMS Store</Link>
      </div>
      <div className="nav__links">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="nav__actions">
        {isLoggedIn ? (
          <button className="btn light" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link className="btn light" to="/login">
            Log in
          </Link>
        )}
        <Link className="nav__cart" to="/cart">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l1.68 10.06a2 2 0 0 0 2 1.69h7.72a2 2 0 0 0 2-1.69l.6-4.06H6" />
          </svg>
          <span>Cart ({totalItems})</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
