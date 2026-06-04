import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const { allProducts, getImageUrl } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sidebar State Managers
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // UI states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  
  const autocompleteRef = useRef(null);

  // Sync category filter from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Map legacy categories if needed
      if (categoryParam === 'honey') {
        setSelectedCategories(['organic-honey']);
      } else if (categoryParam === 'combos') {
        setSelectedCategories(['gift-packs']);
      } else {
        setSelectedCategories([categoryParam]);
      }
    }
  }, [searchParams]);

  // Click outside autocomplete dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, maxPrice, selectedWeights, selectedBenefits, searchQuery, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleWeightChange = (weight) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight]
    );
  };

  const handleBenefitChange = (benefit) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(2000);
    setSelectedWeights([]);
    setSelectedBenefits([]);
    setSearchQuery('');
    setSortBy('popularity');
    setIsAutocompleteOpen(false);
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter Catalog
  let filteredProducts = Object.values(allProducts).filter((prod) => {
    // Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(prod.category)) {
      return false;
    }
    // Price Filter
    if (prod.price > maxPrice) {
      return false;
    }
    // Weight Filter
    if (selectedWeights.length > 0) {
      let matched = false;
      const weightNum = parseFloat(prod.weight);
      const isKg = prod.weight.toLowerCase().includes('kg');
      const actualWeightGrams = isKg ? weightNum * 1000 : weightNum;

      selectedWeights.forEach(w => {
        if (w === 'Under 100g' && actualWeightGrams < 100) matched = true;
        else if (w === '100g-200g' && actualWeightGrams >= 100 && actualWeightGrams <= 200) matched = true;
        else if (w === prod.weight) matched = true;
        else if (w === '1kg' && actualWeightGrams === 1000) matched = true;
      });
      if (!matched) return false;
    }
    // Benefits Filter
    if (selectedBenefits.length > 0) {
      const benefitMapping = {
        'Immunity Booster': ['prod-honey-15g', 'prod-honey-30g', 'prod-honey-50g', 'prod-honey-100g', 'prod-honey-200g', 'prod-honey-450g', 'prod-honey-1kg', 'prod-chia-seeds'],
        'Energy Booster': ['prod-honey-100g', 'prod-honey-200g', 'prod-honey-450g', 'prod-honey-1kg', 'prod-pumpkin-seeds', 'prod-sunflower-seeds'],
        'For Skin': ['prod-honey-200g', 'prod-honey-450g', 'prod-honey-1kg', 'prod-chia-seeds', 'prod-anjeer'],
        'For Weight Management': ['prod-honey-15g', 'prod-honey-30g', 'prod-honey-50g', 'prod-chia-seeds', 'prod-pumpkin-seeds'],
        'General Wellness': ['prod-honey-15g', 'prod-honey-30g', 'prod-honey-50g', 'prod-honey-100g', 'prod-honey-200g', 'prod-honey-450g', 'prod-honey-1kg', 'prod-pumpkin-seeds', 'prod-sunflower-seeds', 'prod-chia-seeds', 'prod-watermelon-seeds', 'prod-anjeer', 'prod-duet-combo', 'prod-gift-pack']
      };
      const isEligible = selectedBenefits.some(b => benefitMapping[b]?.includes(prod.id));
      if (!isEligible) return false;
    }
    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.trim().toLowerCase();
      if (!prod.name.toLowerCase().includes(q) && !prod.desc.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort Catalog
  if (sortBy === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Autocomplete Suggestions
  const autocompleteSuggestions = searchQuery
    ? Object.values(allProducts).filter((prod) =>
        prod.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  // Paginate Products
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="shop-body" style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: '100px', background: '#FAF8F5' }}>
      
      {/* Background Canvas Blurs */}
      <div className="shop-blur s-blur-1" aria-hidden="true" style={{ position: 'absolute', top: '5%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', filter: 'blur(120px)', zIndex: 1, pointerEvents: 'none', opacity: 0.15 }}></div>
      <div className="shop-blur s-blur-2" aria-hidden="true" style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '45vw', height: '45vw', borderRadius: '50%', filter: 'blur(120px)', zIndex: 1, pointerEvents: 'none', opacity: 0.15 }}></div>

      {/* Decorative Honeycomb Bgs */}
      <img className="profile-honeycomb-bg profile-honeycomb-left" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" style={{ opacity: 0.05, width: '320px', height: 'auto', position: 'absolute', top: '10%', left: '-50px', zIndex: 1, pointerEvents: 'none' }} />
      <img className="profile-honeycomb-bg profile-honeycomb-right" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" style={{ opacity: 0.05, width: '320px', height: 'auto', position: 'absolute', top: '40%', right: '-50px', zIndex: 1, pointerEvents: 'none' }} />

      {/* Unified Header section (exactly like mockup) */}
      <header className="shop-header-container" style={{ maxWidth: '1440px', margin: '120px auto 0', padding: '0 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxSizing: 'border-box', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Sans', 'Georgia', serif", fontSize: '46px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 10px' }}>Shop</h1>
          <nav className="breadcrumbs" aria-label="Breadcrumb navigation" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
            <Link to="/" style={{ color: '#7E7870', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#C5BEB5' }}>&gt;</span>
            <span className="current-page" style={{ color: '#D48C00', fontWeight: 600 }}>Shop</span>
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#7E7870', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
            Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </span>
          
          <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#7E7870', fontFamily: "'Poppins', sans-serif" }}>Sort by:</span>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '8px', color: '#1E1E1E', fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, padding: '8px 36px 8px 16px', cursor: 'pointer', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234E4840\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
              <option value="popularity">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main catalog view */}
      <div className="shop-layout" style={{ marginTop: '30px' }}>
        
        {/* Sidebar filters (perfect mockup representation) */}
        <aside className={`filter-sidebar ${isMobileSidebarOpen ? 'sidebar-open' : ''}`} id="filter-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'transparent', border: 'none', padding: 0, boxShadow: 'none', backdropFilter: 'none' }}>
          
          {/* Categories card */}
          <div className="filter-block" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' }}>
            <h4 className="filter-block-title" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 18px', borderBottom: '1px solid #F5F2EC', paddingBottom: '10px' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(() => {
                const getCount = (catVal) => {
                  if (!catVal) return Object.keys(allProducts).length;
                  return Object.values(allProducts).filter(p => p.category === catVal).length;
                };
                return [
                  { name: 'All Products', count: String(getCount('')).padStart(2, '0'), value: '' },
                  { name: 'Raw Honey', count: String(getCount('raw-honey')).padStart(2, '0'), value: 'raw-honey' },
                  { name: 'Healthy Seeds', count: String(getCount('seeds')).padStart(2, '0'), value: 'seeds' },
                  { name: 'Premium Collection', count: String(getCount('premium-collection')).padStart(2, '0'), value: 'premium-collection' },
                  { name: 'Gift Packs', count: String(getCount('gift-packs')).padStart(2, '0'), value: 'gift-packs' }
                ].map((cat) => {
                  const isActive = cat.value === '' 
                    ? selectedCategories.length === 0 
                    : selectedCategories.includes(cat.value);
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => {
                        if (cat.value === '') {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories([cat.value]);
                        }
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px 12px',
                        background: isActive ? '#FAF6F0' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '14.5px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#D48C00' : '#4E4840',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: isActive ? 700 : 500 }}>{cat.count}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Filter by Price card */}
          <div className="filter-block" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' }}>
            <h4 className="filter-block-title" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 18px', borderBottom: '1px solid #F5F2EC', paddingBottom: '10px' }}>Filter by Price</h4>
            <div className="price-slider-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <input
                type="range"
                className="price-range-slider"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#D48C00',
                  height: '4px',
                  background: '#ECE7E0',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#7E7870', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                <span>₹0</span>
                <span>₹{maxPrice === 2000 ? '2000+' : maxPrice}</span>
              </div>
            </div>
          </div>

          {/* By Weight card */}
          <div className="filter-block" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' }}>
            <h4 className="filter-block-title" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 18px', borderBottom: '1px solid #F5F2EC', paddingBottom: '10px' }}>By Weight</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['200g', '250g', '500g', '750g', '1kg', '1.5kg+'].map((w) => (
                <label key={w} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontFamily: "'Poppins', sans-serif", color: '#4E4840', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={selectedWeights.includes(w)}
                    onChange={() => handleWeightChange(w)}
                    style={{ accentColor: '#D48C00', width: '18px', height: '18px', border: '1px solid #ECE7E0', borderRadius: '4px' }}
                  />
                  <span style={{ fontWeight: selectedWeights.includes(w) ? 600 : 500 }}>{w}</span>
                </label>
              ))}
            </div>
          </div>

          {/* By Benefits card */}
          <div className="filter-block" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '24px', boxSizing: 'border-box' }}>
            <h4 className="filter-block-title" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 18px', borderBottom: '1px solid #F5F2EC', paddingBottom: '10px' }}>By Benefits</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Immunity Booster', 'Energy Booster', 'For Skin', 'For Weight Management', 'General Wellness'].map((b) => (
                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontFamily: "'Poppins', sans-serif", color: '#4E4840', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(b)}
                    onChange={() => handleBenefitChange(b)}
                    style={{ accentColor: '#D48C00', width: '18px', height: '18px', border: '1px solid #ECE7E0', borderRadius: '4px' }}
                  />
                  <span style={{ fontWeight: selectedBenefits.includes(b) ? 600 : 500 }}>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Promo offer banner card */}
          <div className="promo-sidebar-card" style={{ background: '#FAF0DB', border: '1px solid #EAD8B1', borderRadius: '12px', padding: '28px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
            <h3 style={{ fontFamily: "'Instrument Sans', 'Georgia', serif", fontSize: '22px', fontWeight: 700, color: '#3A2703', margin: '0 0 10px', maxWidth: '190px', lineHeight: '1.25' }}>Organic & 100% Pure Honey</h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#6A5323', margin: '0 0 20px', maxWidth: '160px', fontWeight: 500 }}>Straight from natural bee farms.</p>
            <button
              type="button"
              onClick={() => setSelectedCategories(['organic-honey'])}
              style={{
                background: '#3A2703',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                position: 'relative',
                zIndex: 5
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#251902'}
              onMouseOut={(e) => e.currentTarget.style.background = '#3A2703'}
            >
              Shop Now
            </button>
            <img
              src={getImageUrl('homepage honey.png')}
              alt=""
              style={{
                position: 'absolute',
                right: '-24px',
                bottom: '-28px',
                width: '130px',
                height: 'auto',
                objectFit: 'contain',
                opacity: 0.95,
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Reset Filters card */}
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              background: '#FFFFFF',
              border: '1px solid #ECE7E0',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              color: '#D48C00',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#FAF6F0'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
          >
            Clear Active Filters
          </button>
        </aside>

        {/* Right Product Grid pane */}
        <main className="shop-catalog-pane" style={{ position: 'relative', zIndex: 5 }}>
          
          {/* Quick search input */}
          <div className="shop-search-section" style={{ marginBottom: '32px' }}>
            <div className="search-bar-wrapper" ref={autocompleteRef} style={{ background: '#FFFFFF', border: '1px solid #ECE7E0', borderRadius: '12px', height: '54px', padding: '0 18px' }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="#7E7870" strokeWidth="2.5" style={{ width: '18px', height: '18px', marginRight: '12px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="shop-search-input"
                placeholder="Search raw mountain nectar, organic wildflower jars, premium collection gift hampers..."
                value={searchQuery}
                onFocus={() => setIsAutocompleteOpen(searchQuery.trim() !== '')}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsAutocompleteOpen(e.target.value.trim() !== '');
                }}
                style={{ color: '#000000', fontSize: '14.5px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setIsAutocompleteOpen(false);
                  }}
                  aria-label="Clear search"
                  style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#7E7870' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}

              {/* Autocomplete suggestion popups */}
              {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
                <div className="search-autocomplete-dropdown" style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid #ECE7E0', top: 'calc(100% + 6px)' }}>
                  {autocompleteSuggestions.slice(0, 5).map((prod) => (
                    <a
                      key={prod.id}
                      href="#"
                      className="autocomplete-row"
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchQuery(prod.name);
                        setIsAutocompleteOpen(false);
                      }}
                      style={{ borderBottom: '1px solid #F5F2EC' }}
                    >
                      <img src={getImageUrl(prod.image)} alt={prod.name} style={{ border: '1px solid #ECE7E0' }} />
                      <div className="autocomplete-info">
                        <span className="autocomplete-name" style={{ color: '#000000' }}>{prod.name}</span>
                        <span className="autocomplete-desc" style={{ color: '#7E7870' }}>{prod.desc}</span>
                      </div>
                      <span className="autocomplete-price" style={{ color: '#D48C00' }}>₹{prod.price}</span>
                    </a>
                  ))}
                </div>
              )}
              {isAutocompleteOpen && searchQuery && autocompleteSuggestions.length === 0 && (
                <div className="search-autocomplete-dropdown" style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #ECE7E0', top: 'calc(100% + 6px)' }}>
                  <div style={{ padding: '12px 20px', fontSize: '13.5px', color: '#7E7870', fontWeight: 500 }}>No quick matches found</div>
                </div>
              )}
            </div>

            <div className="search-stats" style={{ color: '#7E7870', fontSize: '13.5px' }}>
              {searchQuery ? (
                <>Found <strong>{filteredProducts.length}</strong> matching results for "<strong>{searchQuery}</strong>"</>
              ) : (
                <>Showing all {filteredProducts.length} premium products</>
              )}
            </div>
          </div>

          {/* Grid catalog layout (4-column fluid layout matching mockup) */}
          <div className="shop-products-grid" id="shop-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '24px' }}>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} isFeatured={false} />
              ))
            ) : (
              <div className="shop-no-results" style={{ background: '#FFFFFF', border: '1px solid #ECE7E0' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#D48C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px', opacity: 0.6 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3 style={{ color: '#1E1E1E' }}>No Honey Varieties Found</h3>
                <p style={{ color: '#7E7870' }}>Try clearing active category tabs, lowering prices slider, or selecting other weight filters.</p>
              </div>
            )}
          </div>

          {/* Pagination (centered circles matching mockup) */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: isActive ? 'none' : '1px solid #ECE7E0',
                      background: isActive ? '#D48C00' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#7E7870',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid #ECE7E0',
                    background: '#FFFFFF',
                    color: '#7E7870',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  &gt;
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating mobile filter triggers */}
      <button className={`mobile-filter-trigger ${isMobileSidebarOpen ? 'trigger-active' : ''}`} onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Filter Products</span>
      </button>
    </div>
  );
};
