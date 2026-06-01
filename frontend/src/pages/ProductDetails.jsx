import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, getImageUrl, addToCart, wishlist, toggleWishlist } = useCart();

  // Safeguard ID
  const activeId = allProducts[id] ? id : 'prod-wild-forest';
  const currentProduct = allProducts[activeId];
  const isWishlisted = wishlist.includes(currentProduct.id);

  // States
  const [selectedWeight, setSelectedWeight] = useState(currentProduct.weight || '500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top on load or ID change
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedWeight(currentProduct.weight || '500g');
    setQuantity(1);
    setCurrentImageIndex(0);
    setActiveTab('description');
  }, [id, currentProduct]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(currentProduct.id);
  };

  const handleAddToCart = () => {
    addToCart(currentProduct.id, quantity, true);
  };

  const handleBuyNow = () => {
    localStorage.setItem('checkoutSource', 'buynow');
    localStorage.setItem('buyNowItem', JSON.stringify({ ...currentProduct, qty: quantity }));
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    const floor = Math.floor(rating);
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= floor ? '#FFCB00' : '#E2DCD3', fontSize: '18px' }}>★</span>
      );
    }
    return stars;
  };

  // Gallery Thumbnails (mock carousel using existing product image and honey variations)
  const galleryImages = [
    currentProduct.image,
    'honey spoon.png',
    'honey items .png',
    'honey dabba.png'
  ];

  // Related products ("You May Also Like" carousel)
  const relatedProducts = Object.values(allProducts)
    .filter((prod) => prod.id !== currentProduct.id)
    .slice(0, 5);

  return (
    <div className="details-body" style={{ minHeight: '100vh', background: '#FAF8F5', position: 'relative', overflowX: 'hidden', paddingBottom: '100px' }}>
      
      {/* Background blurs */}
      <div className="d-blur-1" aria-hidden="true" style={{ position: 'absolute', top: '5%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', filter: 'blur(120px)', zIndex: 1, pointerEvents: 'none', opacity: 0.15 }}></div>

      <main className="details-container" style={{ maxWidth: '1200px', margin: '120px auto 0', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        
        {/* Breadcrumbs (Mockup Style) */}
        <nav className="details-breadcrumbs" aria-label="Breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontFamily: "'Poppins', sans-serif", marginBottom: '24px' }}>
          <Link to="/" style={{ color: '#7E7870', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#C5BEB5' }}>&gt;</span>
          <Link to="/shop" style={{ color: '#7E7870', textDecoration: 'none' }}>Shop</Link>
          <span style={{ color: '#C5BEB5' }}>&gt;</span>
          <span style={{ color: '#D48C00', fontWeight: 600 }}>{currentProduct.name}</span>
        </nav>

        {/* 2-Column Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }} className="product-main-grid-new">
          
          {/* Column 1: Image & Thumbnail Gallery */}
          <section className="gallery-section">
            {/* Viewport Box */}
            <div className="details-gallery-frame" style={{ position: 'relative', background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '16px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', boxSizing: 'border-box', overflow: 'hidden' }}>
              
              {/* Bestseller Badge */}
              {currentProduct.isBestseller && (
                <span style={{ position: 'absolute', top: '20px', left: '20px', background: '#D48C00', color: '#FFFFFF', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", zIndex: 5, letterSpacing: '0.02em' }}>
                  Bestseller
                </span>
              )}

              {/* Wishlist floating heart */}
              <button
                type="button"
                onClick={handleWishlistClick}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ECE7E0',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                }}
              >
                <svg viewBox="0 0 24 24" fill={isWishlisted ? '#D48C00' : 'none'} stroke="#D48C00" strokeWidth="2.2" style={{ width: '20px', height: '20px' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
                </svg>
              </button>

              <img
                src={getImageUrl(galleryImages[currentImageIndex])}
                alt={currentProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Zoom magnifier button icon */}
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#7E7870" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="details-thumb-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E7870', fontSize: '18px', fontWeight: 'bold' }}>&lt;</button>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    background: '#FFFFFF',
                    border: currentImageIndex === idx ? '2px solid #D48C00' : '1px solid #ECE7E0',
                    borderRadius: '8px',
                    width: '74px',
                    height: '74px',
                    padding: '8px',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7E7870', fontSize: '18px', fontWeight: 'bold' }}>&gt;</button>
            </div>
          </section>

          {/* Column 2: Specs and Purchase Actions */}
          <section className="product-details-pane" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: "'Instrument Sans', 'Georgia', serif", fontSize: '38px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 4px', lineHeight: '1.2' }}>{currentProduct.name}</h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14.5px', color: '#7E7870', margin: '0 0 16px', fontWeight: 500 }}>100% Pure • Raw • Unfiltered</p>
            
            {/* Rating reviews metrics */}
            <div className="details-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #ECE7E0', paddingBottom: '18px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {renderStars(currentProduct.rating)}
                <span style={{ fontSize: '14px', color: '#7E7870', fontWeight: 600, fontFamily: "'Poppins', sans-serif", marginLeft: '4px' }}>({currentProduct.reviewsCount || 100} Reviews)</span>
              </div>
              <span style={{ color: '#C5BEB5' }}>|</span>
              <span style={{ fontSize: '14px', color: '#1E1E1E', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Sold {Math.round((currentProduct.reviewsCount || 100) * 8.2)}+</span>
            </div>

            {/* Price section */}
            <div style={{ margin: '0 0 16px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#1E1E1E', fontFamily: "'Instrument Sans', sans-serif" }}>₹{currentProduct.price}</span>
            </div>

            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14.5px', color: '#4E4840', lineHeight: '1.55', margin: '0 0 24px' }}>
              {currentProduct.desc}
            </p>

            {/* Icon benefits grid */}
            <div className="details-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', borderTop: '1px solid #ECE7E0', borderBottom: '1px solid #ECE7E0', padding: '16px 0', marginBottom: '24px', textAlign: 'center' }}>
              {[
                { label: '100% Pure', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: 'Raw & Unfiltered', icon: 'M12 3v18M3 12h18' },
                { label: 'No Added Sugar', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' },
                { label: 'Natural & Healthy', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' }
              ].map((benefit) => (
                <div key={benefit.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid rgba(158, 111, 6, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D48C00' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                      <path d={benefit.icon}></path>
                    </svg>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#4E4840', fontFamily: "'Poppins', sans-serif", lineHeight: '1.2' }}>{benefit.label}</span>
                </div>
              ))}
            </div>

            {/* Weight choices */}
            <div className="details-weight-section" style={{ marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1E1E1E', fontFamily: "'Poppins', sans-serif", marginBottom: '10px' }}>Weight</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['250g', '500g', '1kg', '1.5kg'].map((w) => {
                  const isSel = selectedWeight === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      style={{
                        background: '#FFFFFF',
                        border: isSel ? '2px solid #D48C00' : '1px solid #ECE7E0',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: isSel ? '#D48C00' : '#4E4840',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity choices */}
            <div className="details-quantity-section" style={{ marginBottom: '28px' }}>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1E1E1E', fontFamily: "'Poppins', sans-serif", marginBottom: '10px' }}>Quantity</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '6px', height: '42px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '42px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#4E4840' }}
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  style={{ width: '44px', height: '100%', border: 'none', background: 'none', outline: 'none', textAlign: 'center', fontSize: '14.5px', fontWeight: 700, color: '#1E1E1E', fontFamily: "'Poppins', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: '42px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#4E4840' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="details-action-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-buy-now"
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  height: '52px',
                  background: '#D48C00',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(212, 140, 0, 0.25)',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#B87A00'}
                onMouseOut={(e) => e.currentTarget.style.background = '#D48C00'}
              >
                <span>Buy Now</span>
                <span>⚡</span>
              </button>

              <button
                type="button"
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  height: '52px',
                  background: '#2F1F17',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1E140F'}
                onMouseOut={(e) => e.currentTarget.style.background = '#2F1F17'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
          </section>
        </div>

        {/* Highlights banner (exactly like mockup) */}
        <section className="details-highlights-strip" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '48px' }}>
          {[
            { label: 'Free Delivery', sub: 'On orders above ₹499', icon: '🚚' },
            { label: 'Secure Payment', sub: '100% secure payments', icon: '🔒' },
            { label: 'Easy Returns', sub: '7 days easy returns', icon: '🔄' },
            { label: 'Quality Guarantee', sub: '100% quality assured', icon: '★' }
          ].map((hl) => (
            <div key={hl.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
              <span style={{ fontSize: '28px' }}>{hl.icon}</span>
              <div>
                <h4 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '14.5px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 2px' }}>{hl.label}</h4>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#7E7870', margin: 0 }}>{hl.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Tabs block (Description, Benefits, etc. side panel layout) */}
        <section style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', marginTop: '48px' }} className="tabs-main-grid">
          {/* Left: Tab options */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'description', label: 'Description' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'howtouse', label: 'How to Use' },
              { id: 'storage', label: 'Storage' },
              { id: 'reviews', label: `Reviews (${currentProduct.reviewsCount || 100})` }
            ].map((tab) => {
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 20px',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '14.5px',
                    fontWeight: isAct ? 700 : 500,
                    color: isAct ? '#D48C00' : '#4E4840',
                    background: isAct ? '#FAF6F0' : 'transparent',
                    border: 'none',
                    borderLeft: isAct ? '4px solid #D48C00' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: '0 6px 6px 0'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Right: Tab content pane */}
          <div style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '36px', boxSizing: 'border-box' }}>
            {activeTab === 'description' && (
              <div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#4E4840', lineHeight: '1.65', margin: '0 0 24px' }}>
                  Our {currentProduct.name} is harvested by bees from the nectar of wild flowers in untouched forest areas. It is raw, unprocessed, and unfiltered to retain all its natural goodness.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="tab-details-subgrid">
                  <div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        'Rich in antioxidants and enzymes',
                        'Boosts immunity and energy',
                        'Supports digestion and heart health',
                        'Natural source of sweetness'
                      ].map((tick) => (
                        <li key={tick} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontFamily: "'Poppins', sans-serif", color: '#4E4840' }}>
                          <span style={{ color: '#D48C00', fontWeight: 'bold' }}>✓</span>
                          <span>{tick}</span>
                        </li>
                      ))}
                    </ul>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13.5px', color: '#7E7870', margin: '24px 0 0' }}>
                      Experience the true taste of nature with every spoon.
                    </p>
                  </div>

                  {/* Why choose card */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #ECE7E0', borderRadius: '10px', padding: '24px' }}>
                    <h4 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 16px' }}>Why Choose Hommed Honey?</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', fontFamily: "'Poppins', sans-serif", color: '#4E4840' }}>
                      <li style={{ display: 'flex', gap: '8px' }}>🐝 <span>Ethically sourced from natural bee farms</span></li>
                      <li style={{ display: 'flex', gap: '8px' }}>🛡️ <span>No chemicals or artificial additives</span></li>
                      <li style={{ display: 'flex', gap: '8px' }}>🔥 <span>Unheated & unprocessed</span></li>
                      <li style={{ display: 'flex', gap: '8px' }}>🌱 <span>Sustainable & eco-friendly beekeeping</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#4E4840', lineHeight: '1.65' }}>
                <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '18px', color: '#1E1E1E', margin: '0 0 14px' }}>Health Benefits</h3>
                <p>Pure raw forest honey has been celebrated for centuries as a natural healer and strength builder. Incorporating a daily spoonful brings several vital benefits:</p>
                <ol style={{ paddingLeft: '20px', margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><strong>Natural Cough Suppressant:</strong> Thick consistency coats and calms throat linings instantly.</li>
                  <li><strong>Antibacterial Protection:</strong> Raw enzymes contain mild natural hydrogen peroxide active shields.</li>
                  <li><strong>Energy Elevators:</strong> Healthy natural fructose sugars fuel active sports and daily tasks.</li>
                  <li><strong>Gastric Calmer:</strong> Alkalizes acid systems and restores digestive stomach linings.</li>
                </ol>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#4E4840' }}>
                <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '18px', color: '#1E1E1E', margin: '0 0 14px' }}>Ingredients</h3>
                <p style={{ margin: '0 0 16px' }}><strong>100% Pure, Unpasteurized Forest Wildflower Nectar.</strong></p>
                <p>Absolutely zero additives, artificial colors, chemical preservatives, or added sucrose syrups. Handled under stringent hygienic conditions to ensure that nature's complex biological properties are fully locked in.</p>
              </div>
            )}

            {activeTab === 'howtouse' && (
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#4E4840', lineHeight: '1.6' }}>
                <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '18px', color: '#1E1E1E', margin: '0 0 14px' }}>How to Use</h3>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><strong>Morning Warmers:</strong> Stir 1 tbsp into warm lemon water on an empty stomach to fire up metabolism.</li>
                  <li><strong>Smoothies & Teas:</strong> Drizzle over oatmeal, greek yogurt bowls, or stir into herbal tea as a sugar substitute.</li>
                  <li><strong>Quick Bites:</strong> Drizzle over hot sourdough toast, pancakes, or pair with dried figs (anjeer).</li>
                  <li><strong>Pre-Workout Fuel:</strong> Eat one spoonful directly 15 minutes before high intensity training.</li>
                </ul>
              </div>
            )}

            {activeTab === 'storage' && (
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#4E4840' }}>
                <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '18px', color: '#1E1E1E', margin: '0 0 14px' }}>Storage Instructions</h3>
                <p style={{ margin: '0 0 16px' }}>Store in a cool, dry place away from direct sunlight. Close the lid tightly after every use.</p>
                <div style={{ padding: '14px 18px', background: 'rgba(158, 111, 6, 0.04)', borderRadius: '8px', border: '1px solid rgba(158, 111, 6, 0.12)', fontSize: '13.5px', color: '#9E6F06', fontWeight: 600 }}>
                  ⚠️ Note: Pure honey never expires! However, natural crystallization may occur over time. If crystallized, simply submerge the jar in warm water for 5 minutes to restore its liquid golden state.
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ fontFamily: "'Poppins', sans-serif" }}>
                <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '18px', color: '#1E1E1E', margin: '0 0 20px' }}>Customer Reviews ({currentProduct.reviewsCount || 100})</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { author: 'Meera Sharma', rating: 5, date: 'May 28, 2026', title: 'Truly natural taste!', text: 'This wild forest honey is beautiful. It carries a genuine floral aroma and is not sickly sweet like regular syrups. Will order the 1kg next.' },
                    { author: 'Karan Malhotra', rating: 5, date: 'May 14, 2026', title: 'Exceptional purity', text: 'I checked for purity using the water test and it passed perfectly. Highly recommended for clean living.' }
                  ].map((rev, i) => (
                    <article key={i} style={{ borderBottom: '1px solid #ECE7E0', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }}>{rev.author}</span>
                        <span style={{ fontSize: '12px', color: '#7E7870' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        {renderStars(rev.rating)}
                        <strong style={{ fontSize: '13.5px', color: '#1E1E1E', marginLeft: '6px' }}>{rev.title}</strong>
                      </div>
                      <p style={{ fontSize: '14px', color: '#4E4840', margin: 0, lineHeight: '1.5' }}>{rev.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* You May Also Like Section (Golden Ribbon mockup slider) */}
        <section style={{ marginTop: '64px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 32px' }}>
            <span style={{ width: '80px', height: '1.5px', background: '#D48C00' }}></span>
            <h2 style={{ fontFamily: "'Instrument Sans', 'Georgia', serif", fontSize: '28px', fontWeight: 700, color: '#1E1E1E', margin: '0 20px', textAlign: 'center' }}>You May Also Like</h2>
            <span style={{ width: '80px', height: '1.5px', background: '#D48C00' }}></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }} className="carousel-grid-new">
            {relatedProducts.map((prod) => {
              const disc = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
              return (
                <article
                  key={prod.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #ECE7E0',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }}
                >
                  <Link to={`/product/${prod.id}`} style={{ display: 'block', height: '140px', background: '#F8F6F2', borderRadius: '6px', overflow: 'hidden', padding: '8px' }}>
                    <img src={getImageUrl(prod.image)} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Link>

                  <h4 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1E1E1E', margin: '12px 0 4px', textDecoration: 'none', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    <Link to={`/product/${prod.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{prod.name}</Link>
                  </h4>
                  
                  <span style={{ fontSize: '12px', color: '#7E7870', fontFamily: "'Poppins', sans-serif" }}>{prod.weight || '500g'}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px' }}>
                    {renderStars(prod.rating)}
                    <span style={{ color: '#7E7870', marginLeft: '2px' }}>({prod.reviewsCount || 100})</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E1E1E', fontFamily: "'Instrument Sans', sans-serif" }}>₹{prod.price}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(prod.id, 1, true)}
                      style={{
                        background: '#D48C00',
                        border: 'none',
                        borderRadius: '6px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '15px', height: '15px' }}>
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};
