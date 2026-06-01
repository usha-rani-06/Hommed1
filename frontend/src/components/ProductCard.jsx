import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, isFeatured = false }) => {
  const navigate = useNavigate();
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    getImageUrl
  } = useCart();

  const isWishlisted = wishlist.includes(product.id);
  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, true);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem('checkoutSource', 'buynow');
    localStorage.setItem('buyNowItem', JSON.stringify({ ...product, qty: 1 }));
    navigate('/checkout');
  };

  if (isFeatured) {
    return (
      <article className="product-card">
        <button
          className={`wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" style={isWishlisted ? { fill: '#F44336', stroke: '#F44336' } : {}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
          </svg>
        </button>
        <Link to={`/product/${product.id}`}>
          <img className="product-image" src={getImageUrl(product.image)} alt={product.name} />
        </Link>
        <div className="product-info">
          <div className="product-header-row">
            <h3>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {product.name}
              </Link>
            </h3>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <p className="product-desc">{product.desc}</p>
        </div>
        <div className="product-actions">
          <button className="cart-btn" onClick={handleAddToCart}>
            Add to cart
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2.1l2.55 11.34a2 2 0 0 0 1.95 1.56h7.5a2 2 0 0 0 1.9-1.37L21 9H7"></path>
              <circle cx="10" cy="20" r="1.35"></circle>
              <circle cx="17" cy="20" r="1.35"></circle>
            </svg>
          </button>
          <button className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </article>
    );
  }

  // Standalone Shop card
  const renderStars = (rating) => {
    const floor = Math.floor(rating);
    const remainder = rating - floor;
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i} style={{ color: '#FFCB00' }}>★</span>);
      } else if (i === floor + 1 && remainder >= 0.5) {
        stars.push(<span key={i} style={{ color: '#FFCB00' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#E2DCD3' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <article className="shop-product-card" style={{ position: 'relative', background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
      
      {/* Top badges & actions */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        {product.isBestseller ? (
          <span style={{ background: '#D48C00', color: '#FFFFFF', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em' }}>Bestseller</span>
        ) : <span />}
        
        <button
          className={`shop-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? '#D48C00' : '#D48C00'
          }}
        >
          <svg viewBox="0 0 24 24" fill={isWishlisted ? '#D48C00' : 'none'} stroke="#D48C00" strokeWidth="2" style={{ width: '20px', height: '20px', transition: 'all 0.2s ease' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
          </svg>
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="shop-card-img-link" style={{ display: 'block', width: '100%', height: '200px', background: '#F8F6F2', borderRadius: '8px', overflow: 'hidden', padding: '16px', boxSizing: 'border-box' }}>
        <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }} />
      </Link>
      
      <div className="shop-card-info" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link to={`/product/${product.id}`} className="shop-card-title-link" style={{ color: '#000000', fontFamily: "'Instrument Sans', 'Poppins', sans-serif", fontSize: '16px', fontWeight: 700, lineHeight: '1.25', textDecoration: 'none', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </Link>
        
        <span style={{ color: '#7E7870', fontSize: '13px', fontFamily: "'Poppins', sans-serif", marginTop: '4px' }}>
          {product.weight || '500g'}
        </span>

        {/* Ratings row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}>
          {renderStars(product.rating)}
          <span style={{ color: '#7E7870', marginLeft: '2px' }}>({product.reviewsCount || 100})</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#000000', fontFamily: "'Instrument Sans', sans-serif" }}>₹{product.price}</span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          style={{
            marginTop: '16px',
            width: '100%',
            height: '42px',
            background: '#D48C00',
            border: 'none',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B87A00'}
          onMouseOut={(e) => e.currentTarget.style.background = '#D48C00'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
};
