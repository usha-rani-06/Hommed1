import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const {
    cart,
    updateQty,
    removeFromCart,
    getTotals,
    allProducts,
    getImageUrl,
    addToCart,
    currentUser
  } = useCart();
  const navigate = useNavigate();

  const totals = getTotals();

  const recCandidates = Object.values(allProducts).filter(
    (p) => !cart.some((item) => item.id === p.id)
  );

  const handleCheckoutClick = () => {
    localStorage.removeItem('checkoutSource');
    if (!currentUser?.isLoggedIn) {
      navigate('/login?next=/checkout');
      return;
    }
    navigate('/checkout');
  };

  const shippingNeed = Math.max(0, totals.freeShippingLimit - totals.finalSubtotal);
  const percentFill = Math.min(100, (totals.finalSubtotal / totals.freeShippingLimit) * 100);

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#FAF8F5',
      fontFamily: "'Poppins', sans-serif",
      paddingBottom: '80px',
    },
    canvas: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '100px 40px 0',
    },
    breadcrumbs: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '32px',
      fontSize: '13px',
      color: '#7E7870',
    },
    breadLink: {
      color: '#7E7870',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
    breadActive: {
      color: '#1E1E1E',
      fontWeight: 600,
    },
    title: {
      fontFamily: "'Instrument Sans', serif",
      fontSize: '36px',
      fontWeight: 700,
      color: '#1E1E1E',
      margin: '0 0 32px',
      letterSpacing: '-0.02em',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '32px',
      alignItems: 'start',
    },
    // Items Pane
    itemsPane: {
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #ECE7E0',
      overflow: 'hidden',
    },
    itemsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 28px',
      borderBottom: '1px solid #F0EBE1',
    },
    itemsHeaderText: {
      fontSize: '15px',
      fontWeight: 700,
      color: '#1E1E1E',
    },
    itemCount: {
      fontSize: '13px',
      color: '#7E7870',
      fontWeight: 500,
    },
    // Single Item Row
    itemRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 28px',
      gap: '20px',
      borderBottom: '1px solid #F5F0E8',
      transition: 'background 0.15s',
    },
    itemImg: {
      width: '90px',
      height: '90px',
      borderRadius: '12px',
      objectFit: 'contain',
      background: '#FFFDF8',
      border: '1px solid #F0EBE1',
      padding: '6px',
      flexShrink: 0,
    },
    itemMeta: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontFamily: "'Instrument Sans', sans-serif",
      fontSize: '15px',
      fontWeight: 700,
      color: '#1E1E1E',
      textDecoration: 'none',
      display: 'block',
      marginBottom: '4px',
      lineHeight: 1.35,
    },
    itemCategory: {
      fontSize: '12px',
      color: '#A09890',
      display: 'block',
      marginBottom: '8px',
      textTransform: 'capitalize',
    },
    itemPriceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    itemPrice: {
      fontSize: '16px',
      fontWeight: 800,
      color: '#B87A00',
    },
    itemOrigPrice: {
      fontSize: '12px',
      color: '#B0A8A0',
      textDecoration: 'line-through',
    },
    discountTag: {
      fontSize: '10px',
      color: '#388E3C',
      fontWeight: 700,
      background: '#E8F5E9',
      padding: '2px 6px',
      borderRadius: '4px',
    },
    // Controls column
    controlsCol: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '12px',
      flexShrink: 0,
    },
    qtyBox: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #E8DCC8',
      borderRadius: '10px',
      overflow: 'hidden',
      background: '#FAFAFA',
    },
    qtyBtn: {
      width: '34px',
      height: '34px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 700,
      color: '#7E7870',
      display: 'grid',
      placeItems: 'center',
      transition: 'background 0.15s, color 0.15s',
    },
    qtyVal: {
      width: '32px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 700,
      color: '#1E1E1E',
      borderLeft: '1px solid #E8DCC8',
      borderRight: '1px solid #E8DCC8',
      lineHeight: '34px',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#C0B8B0',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
    itemSubtotal: {
      fontSize: '15px',
      fontWeight: 700,
      color: '#1E1E1E',
    },
    // Summary Card
    summaryCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #ECE7E0',
      padding: '28px',
    },
    summaryTitle: {
      fontFamily: "'Instrument Sans', sans-serif",
      fontSize: '18px',
      fontWeight: 700,
      color: '#1E1E1E',
      margin: '0 0 24px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '14px',
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#7E7870',
      fontWeight: 500,
    },
    summaryValue: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#1E1E1E',
    },
    summaryDivider: {
      height: '1px',
      background: '#F0EBE1',
      margin: '16px 0',
    },
    totalLabel: {
      fontSize: '17px',
      fontWeight: 800,
      color: '#1E1E1E',
    },
    totalValue: {
      fontSize: '20px',
      fontWeight: 800,
      color: '#B87A00',
    },
    checkoutBtn: {
      width: '100%',
      height: '52px',
      background: '#B87A00',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '24px',
      boxShadow: '0 6px 20px rgba(184, 122, 0, 0.18)',
      transition: 'transform 0.2s, filter 0.2s',
    },
    // Shipping Progress
    shippingCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #ECE7E0',
      padding: '24px 28px',
      marginBottom: '16px',
    },
    shippingLabel: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#B87A00',
      letterSpacing: '0.06em',
      margin: '0 0 10px',
      textTransform: 'uppercase',
    },
    shippingText: {
      fontSize: '13px',
      color: '#7E7870',
      margin: '0 0 12px',
      lineHeight: 1.5,
    },
    shippingBar: {
      height: '6px',
      background: '#F0EBE1',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    shippingFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #D4A030, #B87A00)',
      borderRadius: '3px',
      transition: 'width 0.4s ease',
    },
    // Recommendations
    recsCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #ECE7E0',
      padding: '24px 28px',
      marginTop: '16px',
    },
    recsTitle: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#B87A00',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      margin: '0 0 18px',
      paddingBottom: '12px',
      borderBottom: '1px solid #F0EBE1',
    },
    recItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #F8F4EE',
    },
    recImg: {
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      background: '#FFFDF8',
      border: '1px solid #F0EBE1',
      borderRadius: '8px',
      padding: '3px',
    },
    recMeta: {
      maxWidth: '140px',
    },
    recName: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#1E1E1E',
      textDecoration: 'none',
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: 1.3,
      marginBottom: '2px',
    },
    recPrice: {
      fontSize: '12px',
      color: '#B87A00',
      fontWeight: 700,
    },
    recAddBtn: {
      background: 'rgba(184, 122, 0, 0.06)',
      color: '#B87A00',
      border: '1px solid rgba(184, 122, 0, 0.15)',
      padding: '7px 14px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Empty state
    emptyWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 24px',
    },
    emptyTitle: {
      fontFamily: "'Instrument Sans', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: '#1E1E1E',
      margin: '0 0 8px',
    },
    emptyText: {
      color: '#7E7870',
      fontSize: '14px',
      margin: '0 0 28px',
      maxWidth: '340px',
    },
    emptyBtn: {
      padding: '13px 32px',
      background: '#B87A00',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: 700,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'filter 0.2s',
    },
  };

  return (
    <div className="cart-page-container" style={styles.page}>
      <div className="cart-page-canvas" style={styles.canvas}>

        {/* Breadcrumbs */}
        <nav className="cart-page-breadcrumbs" style={styles.breadcrumbs}>
          <Link to="/" style={styles.breadLink}
            onMouseOver={(e) => e.currentTarget.style.color = '#B87A00'}
            onMouseOut={(e) => e.currentTarget.style.color = '#7E7870'}
          >Home</Link>
          <span style={{ color: '#C0B8B0' }}>/</span>
          <span style={styles.breadActive}>Shopping Bag</span>
        </nav>

        <h1 style={styles.title}>Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="cart-empty-panel" style={{ ...styles.itemsPane, maxWidth: '640px', margin: '0 auto' }}>
            <div className="cart-empty-wrap" style={styles.emptyWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '72px', height: '72px', color: '#D4A030', marginBottom: '20px' }}>
                <path d="M7 8h10l-.72 11.28A1.85 1.85 0 0 1 14.43 21H9.57a1.85 1.85 0 0 1-1.85-1.72L7 8Z"></path>
                <path d="M9.5 8V6.6a2.5 2.5 0 0 1 5 0V8"></path>
              </svg>
              <h3 style={styles.emptyTitle}>Your shopping bag is empty</h3>
              <p style={styles.emptyText}>Explore our organic honeys and superfood products. Add items to your bag to check out.</p>
              <Link to="/shop" style={styles.emptyBtn}>Browse Products</Link>
            </div>
          </div>
        ) : (
          <div className="cart-page-grid" style={styles.grid}>

            {/* Left: Items List */}
            <section className="cart-items-pane" style={styles.itemsPane}>
              <div style={styles.itemsHeader}>
                <span style={styles.itemsHeaderText}>Your Items</span>
                <span style={styles.itemCount}>{cart.length} item{cart.length > 1 ? 's' : ''}</span>
              </div>

              {cart.map((item, idx) => {
                const discountPct = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.itemRow,
                      borderBottom: idx === cart.length - 1 ? 'none' : '1px solid #F5F0E8',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#FDFBF8'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={getImageUrl(item.image)} alt={item.name} style={styles.itemImg} />

                    <div style={styles.itemMeta}>
                      <Link to={`/product/${item.id}`} style={styles.itemName}>{item.name}</Link>
                      <span style={styles.itemCategory}>{item.category}</span>
                      <div style={styles.itemPriceRow}>
                        <span style={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
                        {discountPct > 0 && (
                          <>
                            <span style={styles.itemOrigPrice}>₹{item.originalPrice.toFixed(2)}</span>
                            <span style={styles.discountTag}>{discountPct}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={styles.controlsCol}>
                      <div style={styles.qtyBox}>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          style={styles.qtyBtn}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#F0EBE1'; e.currentTarget.style.color = '#B87A00'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7E7870'; }}
                        >−</button>
                        <span style={styles.qtyVal}>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          style={styles.qtyBtn}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#F0EBE1'; e.currentTarget.style.color = '#B87A00'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7E7870'; }}
                        >+</button>
                      </div>
                      <span style={styles.itemSubtotal}>₹{(item.price * item.qty).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        style={styles.removeBtn}
                        onMouseOver={(e) => e.currentTarget.style.color = '#E53935'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#C0B8B0'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Right: Summary Sidebar */}
            <aside className="cart-summary-column">
              {/* Free Shipping Progress */}
              <div className="cart-shipping-card" style={styles.shippingCard}>
                <p style={styles.shippingLabel}>Free Shipping Progress</p>
                {shippingNeed > 0 ? (
                  <p style={styles.shippingText}>Spend <strong style={{ color: '#B87A00' }}>₹{shippingNeed.toFixed(2)}</strong> more for free shipping!</p>
                ) : (
                  <p style={{ ...styles.shippingText, color: '#388E3C', fontWeight: 600 }}>🎉 You qualify for FREE shipping!</p>
                )}
                <div style={styles.shippingBar}>
                  <div style={{ ...styles.shippingFill, width: `${percentFill}%` }}></div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary-card" style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal</span>
                  <span style={styles.summaryValue}>₹{totals.rawSubtotal.toFixed(2)}</span>
                </div>

                {totals.bulkDiscount > 0 && (
                  <div style={styles.summaryRow}>
                    <span style={{ ...styles.summaryLabel, color: '#388E3C' }}>Bulk Savings</span>
                    <span style={{ ...styles.summaryValue, color: '#388E3C' }}>-₹{totals.bulkDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Shipping</span>
                  <span style={{ ...styles.summaryValue, color: totals.shipping === 0 ? '#388E3C' : '#1E1E1E' }}>
                    {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div style={styles.summaryDivider}></div>

                <div style={{ ...styles.summaryRow, marginBottom: 0 }}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalValue}>₹{totals.total.toFixed(2)}</span>
                </div>

                <button
                  className="cart-checkout-btn"
                  style={styles.checkoutBtn}
                  onClick={handleCheckoutClick}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}
                >
                  <span>Proceed to Checkout</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              {/* Recommendations */}
              {recCandidates.length > 0 && (
                <div className="cart-recs-card" style={styles.recsCard}>
                  <p style={styles.recsTitle}>You May Also Like</p>
                  {recCandidates.slice(0, 3).map((prod, idx) => (
                    <div key={prod.id} style={{ ...styles.recItem, borderBottom: idx === 2 ? 'none' : '1px solid #F8F4EE' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={getImageUrl(prod.image)} alt={prod.name} style={styles.recImg} />
                        <div style={styles.recMeta}>
                          <Link to={`/product/${prod.id}`} style={styles.recName}>{prod.name}</Link>
                          <span style={styles.recPrice}>₹{prod.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(prod.id, 1, false)}
                        style={styles.recAddBtn}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#B87A00'; e.currentTarget.style.color = '#FFFFFF'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(184, 122, 0, 0.06)'; e.currentTarget.style.color = '#B87A00'; }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </aside>

          </div>
        )}

      </div>
    </div>
  );
};
