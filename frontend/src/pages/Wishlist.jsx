import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Wishlist = () => {
  const navigate = useNavigate();
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    allProducts,
    getImageUrl,
    showToast
  } = useCart();

  const [addedItems, setAddedItems] = useState({});
  const [animatingItems, setAnimatingItems] = useState({});

  const wishlistProducts = wishlist.map((id) => allProducts[id]).filter(Boolean);

  const handleRemove = (productId) => {
    setAnimatingItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      toggleWishlist(productId);
      setAnimatingItems((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }, 350);
  };

  const handleMoveToCart = (productId) => {
    const item = allProducts[productId];
    if (item) {
      addToCart(productId, 1, false);
      setAddedItems((prev) => ({ ...prev, [productId]: true }));
      // Optional: remove from wishlist automatically when moved to cart
      // handleRemove(productId);
      
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    }
  };

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((prod) => {
      addToCart(prod.id, 1, false);
      handleRemove(prod.id);
    });
    if (wishlistProducts.length > 0) {
      navigate('/cart');
    }
  };

  const renderStars = (rating) => {
    const floor = Math.floor(rating);
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= floor ? '#D48C00' : '#E2DCD3', fontSize: '13px' }}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="wishlist-page-container" style={{ minHeight: '100vh', background: '#FAF8F5', fontFamily: "'Poppins', sans-serif", paddingBottom: '60px' }}>
      
      <main className="wishlist-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 0' }}>
        
        {/* Header Section */}
        <div className="wishlist-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="wishlist-title-block">
            <div className="wishlist-title-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontFamily: "'Instrument Sans', serif", fontSize: '28px', fontWeight: '700', color: '#1E1E1E', margin: '0 0 4px' }}>My Wishlist</h1>
              <svg viewBox="0 0 24 24" fill="none" stroke="#D48C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', marginTop: '-4px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
              </svg>
            </div>
            <p style={{ fontSize: '14px', color: '#7E7870', margin: 0 }}>
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              className="wishlist-move-all-btn"
              onClick={handleMoveAllToCart}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAF6F0', border: '1px solid #ECE7E0', color: '#B87A00', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Move All to Cart
            </button>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', margin: '40px 0' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D48C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '64px', height: '64px', marginBottom: '16px', opacity: 0.8 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
            </svg>
            <h2 style={{ fontFamily: "'Instrument Sans', serif", fontSize: '22px', fontWeight: '700', color: '#1E1E1E', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ fontSize: '14px', color: '#7E7870', marginBottom: '24px' }}>Looks like you haven't saved any of our organic honeys yet.</p>
            <button onClick={() => navigate('/shop')} style={{ background: '#B87A00', color: '#FFF', padding: '12px 32px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Explore Shop
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="wishlist-grid">
            {wishlistProducts.map((prod) => {
              const isRemoving = animatingItems[prod.id] || false;
              const isAdded = addedItems[prod.id] || false;
              
              return (
                <article
                  key={prod.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #ECE7E0',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    opacity: isRemoving ? 0 : 1,
                    transform: isRemoving ? 'scale(0.85)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  {/* Remove cross button */}
                  <button
                    onClick={() => handleRemove(prod.id)}
                    style={{ position: 'absolute', top: '24px', right: '24px', width: '24px', height: '24px', borderRadius: '50%', background: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E9E9E', cursor: 'pointer', zIndex: 5, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                    title="Remove from wishlist"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  {/* Image container */}
                  <Link to={`/product/${prod.id}`} style={{ display: 'block', background: '#F9F7F3', borderRadius: '10px', height: '200px', overflow: 'hidden', marginBottom: '16px', padding: '16px', boxSizing: 'border-box' }}>
                    <img src={getImageUrl(prod.image)} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Link>

                  {/* Product Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: "'Instrument Sans', serif", fontSize: '16px', fontWeight: '700', color: '#1E1E1E', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link to={`/product/${prod.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{prod.name}</Link>
                    </h3>
                    
                    <span style={{ fontSize: '13px', color: '#7E7870', marginBottom: '6px' }}>{prod.weight || '500g'}</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex' }}>
                        {renderStars(prod.rating)}
                      </div>
                      <span style={{ fontSize: '12px', color: '#7E7870' }}>({prod.reviewsCount || 100})</span>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#1E1E1E', fontFamily: "'Instrument Sans', serif", marginBottom: '16px' }}>
                      ₹{prod.price}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                      <button 
                        style={{ width: '44px', height: '40px', borderRadius: '6px', border: '1px solid #E8DCC8', background: '#FAF6F0', color: '#B87A00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Already in wishlist"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => handleMoveToCart(prod.id)}
                        style={{ flex: 1, height: '40px', borderRadius: '6px', border: 'none', background: isAdded ? '#4CAF50' : '#B87A00', color: '#FFF', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        {isAdded ? (
                          'Added ✓'
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Move to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Love Banner */}
        <div style={{ marginTop: '48px', border: '1px solid #ECE7E0', borderRadius: '12px', background: '#FFFFFF', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', color: '#4E4840', fontSize: '15px', fontWeight: '500' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#D48C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
          </svg>
          Love something? Add it to your wishlist and shop it later.
        </div>
      </main>

      {/* Highlights Strip at bottom */}
      <div style={{ maxWidth: '1200px', margin: '60px auto 0', padding: '32px 20px 0', borderTop: '1px solid #ECE7E0', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="12" cy="10" r="3"></circle></>, title: '100% Pure Honey', sub: 'Natural & Unfiltered' },
          { icon: <><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></>, title: 'Fast & Free Delivery', sub: 'On orders above ₹499' },
          { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></>, title: 'Secure Payments', sub: '100% safe & secure' },
          { icon: <><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></>, title: 'Easy Returns', sub: '7 days easy returns' },
          { icon: <><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></>, title: 'Quality Guaranteed', sub: 'Premium quality honey' }
        ].map(hl => (
          <div key={hl.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#D48C00' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                {hl.icon}
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E1E1E' }}>{hl.title}</div>
              <div style={{ fontSize: '12px', color: '#7E7870' }}>{hl.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .wishlist-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wishlist-page-container main { padding-top: 100px !important; }
        }
        @media (max-width: 480px) {
          .wishlist-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
