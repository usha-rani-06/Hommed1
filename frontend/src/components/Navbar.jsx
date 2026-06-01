import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const {
    cart,
    wishlist,
    currentUser,
    logoutUser,
    getImageUrl,
    isMenuOpen,
    setIsMenuOpen
  } = useCart();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown and menu on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location, setIsMenuOpen]);

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalWishlistQty = wishlist.length;

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (currentUser && currentUser.isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const isHome = location.pathname === '/';
  const headerClass = isHome ? 'site-header' : 'profile-site-header';

  return (
    <header className={`${headerClass} ${isMenuOpen ? 'menu-active' : ''}`} aria-label="HOMMED Site Header">
      {isHome && (
        <button 
          className="menu-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      <Link className="brand" to="/" aria-label="HOMMED home">
        <img src={getImageUrl('logo.png')} alt="HOMMED" />
        {isHome && <span className="brand-leaf"></span>}
      </Link>

      <nav className="header-actions" aria-label="Shop and account">
        {!isHome && (
          <Link
            to="/"
            className="shop-link"
            style={{
              color: 'var(--ink)',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Home
          </Link>
        )}
        <Link to="/shop" className="shop-link" style={!isHome ? { color: location.pathname === '/shop' ? 'var(--gold)' : 'var(--ink)', fontWeight: location.pathname === '/shop' ? 700 : 500 } : {}}>
          Shop
        </Link>
        
        {/* Cart Link */}
        <Link to="/cart" className="round-icon" id="cart-bag-btn" aria-label="Shopping cart" style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" aria-hidden="true" style={!isHome ? { width: '24px', height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '1.9' } : {}}>
            <path d="M3.2 4.2h2.25l2.32 10.95a2.15 2.15 0 0 0 2.1 1.7h7.55a2.15 2.15 0 0 0 2.03-1.45l1.45-4.35H7.05"></path>
            <path d="M8.1 8.05h12.15"></path>
            <circle cx="10.05" cy="20" r="1.45"></circle>
            <circle cx="17.45" cy="20" r="1.45"></circle>
          </svg>
          {totalCartQty > 0 && (
            <span className="cart-badge" id="cart-badge" style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#D48C00', color: '#FFFFFF', borderRadius: '50%', minWidth: '20px', height: '20px', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {totalCartQty}
            </span>
          )}
        </Link>

        {/* Wishlist Link */}
        <Link
          to="/wishlist"
          className={`round-icon ${location.pathname === '/wishlist' ? 'active' : ''}`}
          id="wishlist-bag-btn"
          aria-label="Wishlist bag"
          style={{ position: 'relative', ...(location.pathname === '/wishlist' ? { borderColor: 'var(--gold)', background: 'var(--white)', color: 'var(--gold)' } : {}) }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" style={!isHome ? { width: '23px', height: '23px', fill: 'none', stroke: 'currentColor', strokeWidth: '1.9' } : { fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
          </svg>
          {totalWishlistQty > 0 && (
            <span className="wishlist-badge" id="wishlist-badge" style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#D48C00', color: '#FFFFFF', borderRadius: '50%', minWidth: '20px', height: '20px', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {totalWishlistQty}
            </span>
          )}
        </Link>

        {/* Profile Dropdown Container */}
        <div className="profile-container" id="profile-container" ref={dropdownRef}>
          <a href="#" className="round-icon" id="profile-btn" aria-label="User profile" onClick={handleProfileClick}>
            {currentUser && currentUser.isLoggedIn ? (
              <span
                id="profile-initials"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--white)',
                  background: 'var(--gold)',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'uppercase'
                }}
              >
                {getInitials(currentUser.name)}
              </span>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" id="profile-svg" style={!isHome ? { width: '24px', height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '1.9' } : {}}>
                <path d="M20 21a8 8 0 0 0-16 0"></path>
                <circle cx="12" cy="7.6" r="4.1"></circle>
              </svg>
            )}
          </a>

          {/* Floating Dropdown Card */}
          {currentUser && currentUser.isLoggedIn && (
            <div className={`profile-dropdown ${isDropdownOpen ? 'dropdown-active' : ''}`} id="profile-dropdown" aria-hidden={!isDropdownOpen}>
              <div className="dropdown-header">
                <div className="user-avatar-circle" id="dropdown-avatar-initials">
                  {getInitials(currentUser.name)}
                </div>
                <div className="user-meta">
                  <span className="user-name" id="dropdown-user-name">{currentUser.name}</span>
                  <span className="user-email" id="dropdown-user-email">{currentUser.email}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <nav className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile Management</span>
                </Link>
                <Link to="/profile" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Order History</span>
                </Link>
                <Link to="/profile" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Saved Addresses</span>
                </Link>
                <Link to="/wishlist" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
                  </svg>
                  <span>Wishlist</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button type="button" className="dropdown-item dropdown-logout-btn" id="dropdown-logout-btn" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
