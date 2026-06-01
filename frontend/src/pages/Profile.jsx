import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../services/api';

export const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, loginUser, logoutUser, cart, wishlist, allProducts, getImageUrl } = useCart();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notice, setNotice] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const [addrForm, setAddrForm] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    isDefault: true
  });

  const isLoggedIn = Boolean(currentUser?.isLoggedIn);

  const navIcon = (id) => {
    if (id === 'profile' || id === 'login') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 20c1.8-3.4 4.5-5 8-5s6.2 1.6 8 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (id === 'orders') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 9h8M8 13h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (id === 'addresses') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    }
    if (id === 'cart') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 5h3l2 10h10l2-7H7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (id === 'wishlist') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7-4.6-9-8.8C1.7 8.4 3.5 5 7 5c2 0 3.4 1 5 2.8C13.6 6 15 5 17 5c3.5 0 5.3 3.4 4 6.2C19 15.4 12 20 12 20z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    }
    if (id === 'logout') {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 16l4-4-4-4M18 12H9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  };

  const menuItems = useMemo(() => {
    if (isLoggedIn) {
      return [
        { id: 'profile', label: 'Profile Management' },
        { id: 'orders', label: 'Order History' },
        { id: 'addresses', label: 'Saved Addresses' },
        { id: 'cart', label: 'Cart' },
        { id: 'wishlist', label: 'Wishlist' }
      ];
    }

    return [
      { id: 'login', label: 'Login / Signup' }
    ];
  }, [isLoggedIn]);

  const defaultAddress = useMemo(() => {
    if (!addresses.length) return null;
    return addresses.find((a) => a.isDefault) || addresses[0];
  }, [addresses]);

  const wishlistProducts = useMemo(
    () => (wishlist || []).map((id) => allProducts[id]).filter(Boolean),
    [wishlist, allProducts]
  );

  const totalCartQty = useMemo(
    () => (cart || []).reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [cart]
  );

  const formatAddressLine = useCallback((address) => {
    if (!address) return '';
    return [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.pincode,
      address.country
    ]
      .filter(Boolean)
      .join(', ');
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const [meRes, orderRes, addressRes] = await Promise.all([
        apiRequest('/users/me'),
        apiRequest('/orders/my-orders'),
        apiRequest('/users/addresses')
      ]);

      setProfile(meRes.user);
      setOrders(orderRes.orders || []);
      setAddresses(addressRes.addresses || []);
      if (!isEditingProfile) {
        setName(meRes.user?.name || '');
        setPhone(meRes.user?.phone || '');
      }
      setLastSyncedAt(new Date());
    } catch (error) {
      if (String(error.message).toLowerCase().includes('unauthorized')) {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, logoutUser, isEditingProfile]);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadDashboard();

    // Refresh from API periodically so dashboard feels live.
    const intervalId = window.setInterval(loadDashboard, 15000);
    return () => window.clearInterval(intervalId);
  }, [isLoggedIn, loadDashboard]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'login') {
      setActiveTab('profile');
    }
  }, [isLoggedIn, activeTab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/users/me', {
        method: 'PATCH',
        body: { name, phone }
      });

      setProfile(res.user);
      loginUser(res.user);
      setNotice({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditingProfile(false);
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Failed to update profile.' });
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/users/addresses', {
        method: 'POST',
        body: addrForm
      });

      const nextAddresses = res.addresses || [];
      setAddresses(nextAddresses);
      setAddrForm({
        fullName: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phone: '',
        isDefault: false
      });
      setNotice({ type: 'success', text: 'Address saved and visible at top now.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Failed to save address.' });
    }
  };

  const renderPanel = () => {
    if (!isLoggedIn || activeTab === 'login') {
      return (
        <div className="profile-panel">
          <h2>Login / Signup</h2>
          <p>Please login first to manage profile, orders, addresses, and wishlist.</p>
          <button className="gold-btn" onClick={() => navigate('/login?next=/profile')}>Go to Login</button>
        </div>
      );
    }

    if (activeTab === 'wishlist') {
      return (
        <div className="profile-panel">
          <div className="panel-head">
            <h2>Wishlist</h2>
            <span className="mini-pill">{wishlistProducts.length} Liked</span>
          </div>
          {!wishlistProducts.length ? (
            <>
              <p>No liked products yet.</p>
              <Link className="text-link" to="/shop">Browse Products</Link>
            </>
          ) : (
            <div className="saved-product-grid">
              {wishlistProducts.map((product) => (
                <article key={product.id} className="saved-product-card">
                  <img src={getImageUrl(product.image)} alt={product.name} />
                  <div>
                    <h4>{product.name}</h4>
                    <p>Rs. {Number(product.price || 0).toFixed(2)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Link className="text-link" to="/wishlist">Open Wishlist</Link>
        </div>
      );
    }

    if (activeTab === 'cart') {
      return (
        <div className="profile-panel">
          <div className="panel-head">
            <h2>Cart</h2>
            <span className="mini-pill">{totalCartQty} Items</span>
          </div>
          {!cart.length ? (
            <>
              <p>Your cart is empty.</p>
              <Link className="text-link" to="/shop">Start Shopping</Link>
            </>
          ) : (
            <div className="saved-product-grid">
              {cart.map((item) => (
                <article key={item.id} className="saved-product-card">
                  <img src={getImageUrl(item.image)} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty} | Rs. {Number(item.price || 0).toFixed(2)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Link className="text-link" to="/cart">Open Cart</Link>
        </div>
      );
    }

    if (activeTab === 'orders') {
      return (
        <div className="profile-panel">
          <div className="panel-head">
            <h2>Order History</h2>
            <span className="mini-pill">{orders.length} Orders</span>
          </div>
          {!orders.length ? (
            <p>No orders yet.</p>
          ) : (
            <div className="order-grid">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-top">
                    <strong>{order.orderNumber}</strong>
                    <span className="status">{order.status}</span>
                  </div>
                  <small>{new Date(order.createdAt).toLocaleString()}</small>
                  <div className="order-total">Rs. {Number(order.totals?.total || 0).toFixed(2)}</div>
                </article>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'addresses') {
      return (
        <div className="profile-panel">
          <div className="panel-head">
            <h2>Saved Addresses</h2>
            <span className="mini-pill">{addresses.length} Saved</span>
          </div>

          {defaultAddress && (
            <div className="default-address-bar">
              <span>Default:</span>
              <strong>{defaultAddress.fullName}</strong>
              <p>{formatAddressLine(defaultAddress)}</p>
            </div>
          )}

          {addresses.length > 0 && (
            <div className="address-list">
              {addresses.map((a, i) => (
                <div key={`${a.line1}-${i}`} className={`address-item ${a.isDefault ? 'address-default' : ''}`}>
                  <h4>{a.fullName} {a.isDefault ? '(Default)' : ''}</h4>
                  <p>{formatAddressLine(a)}</p>
                  <small>{a.phone || 'No phone added'}</small>
                </div>
              ))}
            </div>
          )}

          <form className="address-form" onSubmit={addAddress}>
            <h3>Add New Address</h3>
            <div className="field-grid two">
              <input value={addrForm.fullName} onChange={(e) => setAddrForm((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full Name" required />
              <input value={addrForm.phone} onChange={(e) => setAddrForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" />
            </div>
            <input value={addrForm.line1} onChange={(e) => setAddrForm((s) => ({ ...s, line1: e.target.value }))} placeholder="Address Line 1" required />
            <input value={addrForm.line2} onChange={(e) => setAddrForm((s) => ({ ...s, line2: e.target.value }))} placeholder="Address Line 2 (optional)" />
            <div className="field-grid three">
              <input value={addrForm.city} onChange={(e) => setAddrForm((s) => ({ ...s, city: e.target.value }))} placeholder="City" required />
              <input value={addrForm.state} onChange={(e) => setAddrForm((s) => ({ ...s, state: e.target.value }))} placeholder="State" required />
              <input value={addrForm.pincode} onChange={(e) => setAddrForm((s) => ({ ...s, pincode: e.target.value }))} placeholder="Pincode" required />
            </div>
            <label className="check-label">
              <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm((s) => ({ ...s, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            <div className="address-actions">
              <button className="gold-btn" type="submit">Save Address</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="profile-panel">
        <div className="panel-head">
          <h2>Profile Management</h2>
          <span className="mini-pill">
            {lastSyncedAt ? `Live ${lastSyncedAt.toLocaleTimeString()}` : 'Live Sync'}
          </span>
        </div>
        {loading ? (
          <p>Loading profile...</p>
        ) : !isEditingProfile ? (
          <>
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label>Full Name</label>
                <p>{profile?.name || 'Not set'}</p>
              </div>
              <div className="profile-view-item">
                <label>Phone</label>
                <p>{profile?.phone || 'Not set'}</p>
              </div>
              <div className="profile-view-item profile-view-full">
                <label>Email</label>
                <p>{profile?.email || 'Not set'}</p>
              </div>
            </div>

            <div className="profile-action-row">
              <button
                className="gold-btn"
                type="button"
                onClick={() => {
                  setName(profile?.name || '');
                  setPhone(profile?.phone || '');
                  setIsEditingProfile(true);
                }}
              >
                Edit Details
              </button>
            </div>
          </>
        ) : (
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="field-grid two">
              <div>
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              </div>
            </div>
            <div>
              <label>Email</label>
              <input value={profile?.email || ''} readOnly />
            </div>
            <div className="profile-action-row">
              <button className="gold-btn" type="submit">Save Profile</button>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setName(profile?.name || '');
                  setPhone(profile?.phone || '');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="profile-v2-page">
      <main className="profile-v2-main">
        <div className="profile-crumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Profile</span>
        </div>

        <header className="profile-hero">
          <div>
            <p className="kicker">USER DASHBOARD</p>
            <h1>{isLoggedIn ? `Welcome back, ${profile?.name || currentUser?.name || 'User'}` : 'Account Dashboard'}</h1>
            <p>Manage profile, track orders, and keep addresses ready for one-tap checkout.</p>
          </div>
          <div className="hero-stats">
            <div><strong>{orders.length}</strong><span>Orders</span></div>
            <div><strong>{addresses.length}</strong><span>Addresses</span></div>
            <div><strong>{totalCartQty}</strong><span>Cart</span></div>
            <div><strong>{wishlistProducts.length}</strong><span>Wishlist</span></div>
          </div>
        </header>

        {notice && (
          <div className={`notice ${notice.type}`}>
            {notice.text}
          </div>
        )}

        {isLoggedIn && (
          <section className="saved-top-card">
            <div>
              <p className="saved-label">Saved Address At Top</p>
              {defaultAddress ? (
                <>
                  <h3>{defaultAddress.fullName}</h3>
                  <p>{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}, {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}, {defaultAddress.country}</p>
                </>
              ) : (
                <>
                  <h3>No Address Saved</h3>
                  <p>Add an address below. It will appear here instantly.</p>
                </>
              )}
            </div>
            <button className="ghost-btn" onClick={() => setActiveTab('addresses')}>Manage Addresses</button>
          </section>
        )}

        <div className="profile-layout-v2">
          <aside className="profile-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`profile-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <span>{navIcon(item.id)}</span>
                {item.label}
              </button>
            ))}

            {isLoggedIn && (
              <button
                className="profile-nav-item logout"
                onClick={() => {
                  logoutUser();
                  navigate('/');
                }}
              >
                <span>{navIcon('logout')}</span>
                Logout
              </button>
            )}
          </aside>

          <section className="profile-content-v2">{renderPanel()}</section>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

        .profile-v2-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(255, 223, 146, 0.24), transparent 30%),
            radial-gradient(circle at 90% 100%, rgba(193, 136, 3, 0.09), transparent 30%),
            #fbf8f2;
          font-family: 'Manrope', 'Poppins', sans-serif;
          padding: 34px 20px 46px;
        }

        .profile-v2-main {
          max-width: 1160px;
          margin: 0 auto;
        }

        .profile-crumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a8277;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .profile-crumbs a {
          text-decoration: none;
          color: #8a8277;
        }

        .profile-hero {
          background: linear-gradient(130deg, #1d1303 0%, #352102 44%, #6d4609 100%);
          border-radius: 20px;
          padding: 24px 26px;
          color: #fef6df;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 22px;
          margin-bottom: 16px;
        }

        .profile-hero .kicker {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: #efc36c;
        }

        .profile-hero h1 {
          font-family: 'Sora', sans-serif;
          margin: 0;
          font-size: 31px;
          line-height: 1.16;
        }

        .profile-hero p {
          margin: 8px 0 0;
          color: #f1e8d2;
          font-size: 13px;
          max-width: 560px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          align-self: end;
        }

        .hero-stats div {
          background: rgba(255, 241, 207, 0.1);
          border: 1px solid rgba(255, 214, 132, 0.3);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          display: grid;
          gap: 2px;
        }

        .hero-stats strong {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          color: #ffd07d;
        }

        .hero-stats span {
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #f8eccc;
        }

        .notice {
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .notice.success {
          background: #eaf8ef;
          border: 1px solid #9ad0a8;
          color: #226237;
        }

        .notice.error {
          background: #fdeceb;
          border: 1px solid #f3b5b2;
          color: #9e2f2b;
        }

        .saved-top-card {
          background: #fff;
          border: 1px solid #eadfce;
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .saved-top-card .saved-label {
          margin: 0 0 6px;
          font-size: 11px;
          letter-spacing: 0.08em;
          font-weight: 800;
          color: #b17102;
          text-transform: uppercase;
        }

        .saved-top-card h3 {
          margin: 0;
          font-family: 'Sora', sans-serif;
          color: #1f1a14;
          font-size: 20px;
        }

        .saved-top-card p {
          margin: 6px 0 0;
          color: #6c6358;
          font-size: 13px;
        }

        .profile-layout-v2 {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 18px;
          align-items: start;
        }

        .profile-nav {
          background: #fff;
          border: 1px solid #eadfce;
          border-radius: 16px;
          padding: 8px;
        }

        .profile-nav-item {
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 10px;
          padding: 11px 12px;
          margin: 2px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #4a4339;
          cursor: pointer;
          text-align: left;
        }

        .profile-nav-item span {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f2ece0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #8a5f0c;
        }

        .profile-nav-item span svg {
          width: 17px;
          height: 17px;
          stroke: currentColor;
          flex: 0 0 auto;
        }

        .profile-nav-item.active {
          background: #f8f1e0;
          color: #ad7100;
        }

        .profile-nav-item.active span {
          background: #e5bf73;
          color: #2c2008;
        }

        .profile-nav-item.logout {
          color: #bb2d2d;
        }

        .profile-panel {
          background: #fff;
          border: 1px solid #eadfce;
          border-radius: 16px;
          padding: 22px;
        }

        .profile-panel h2 {
          margin: 0 0 8px;
          font-family: 'Sora', sans-serif;
          font-size: 30px;
          color: #1d1a14;
        }

        .profile-panel p {
          color: #665d50;
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
        }

        .mini-pill {
          background: #f4ebd8;
          color: #9e6f05;
          border: 1px solid #e4cf9f;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .order-grid,
        .address-list,
        .saved-product-grid {
          display: grid;
          gap: 14px;
          margin-top: 8px;
        }

        .order-card,
        .address-item,
        .default-address-bar {
          border: 1px solid #efe6d8;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fffdfa;
        }

        .default-address-bar span {
          color: #9a6b05;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .default-address-bar strong {
          margin-left: 8px;
          font-family: 'Sora', sans-serif;
          color: #1f1a14;
        }

        .default-address-bar p {
          margin: 7px 0 0;
          font-size: 12.5px;
          color: #5e564b;
          line-height: 1.4;
        }

        .default-address-bar {
          margin-bottom: 6px;
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status {
          font-size: 11px;
          text-transform: uppercase;
          background: #eef6ff;
          color: #235f8d;
          border: 1px solid #b9d8ee;
          border-radius: 999px;
          padding: 3px 8px;
          font-weight: 800;
        }

        .order-total {
          font-family: 'Sora', sans-serif;
          margin-top: 8px;
          font-size: 18px;
          color: #a06a00;
          font-weight: 700;
        }

        .address-item h4 {
          margin: 0;
          font-family: 'Sora', sans-serif;
          color: #1f1a14;
          font-size: 15px;
        }

        .address-item p {
          margin: 4px 0 2px;
          font-size: 12.5px;
          color: #635b4f;
          line-height: 1.35;
        }

        .address-item small {
          color: #8b8171;
          font-size: 12px;
        }

        .address-default {
          border-color: #dab169;
          background: #fffbf2;
        }

        .saved-product-grid {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .saved-product-card {
          border: 1px solid #efe3cf;
          border-radius: 12px;
          background: #fffdfa;
          padding: 10px;
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 10px;
          align-items: center;
        }

        .saved-product-card img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #f1e7d8;
          padding: 4px;
        }

        .saved-product-card h4 {
          margin: 0;
          font-family: 'Sora', sans-serif;
          color: #1f1a14;
          font-size: 15px;
        }

        .saved-product-card p {
          margin: 4px 0 0;
          color: #6c6358;
          font-size: 13px;
          font-weight: 700;
        }

        .profile-form label,
        .address-form label {
          display: block;
          color: #6e655a;
          font-size: 12px;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .profile-form input:not([type='checkbox']),
        .address-form input:not([type='checkbox']) {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 1px solid #dcd0bd;
          padding: 0 12px;
          font-family: 'Manrope', sans-serif;
          font-size: 13.5px;
          color: #281d08;
          box-sizing: border-box;
          background: #fff;
        }

        .profile-form input:not([type='checkbox']):focus,
        .address-form input:not([type='checkbox']):focus {
          border-color: #c48613;
          outline: none;
        }

        .field-grid {
          display: grid;
          gap: 10px;
        }

        .field-grid.two {
          grid-template-columns: 1fr 1fr;
        }

        .field-grid.three {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .address-form h3 {
          margin: 18px 0 10px;
          font-family: 'Sora', sans-serif;
          color: #2f2410;
        }

        .address-form {
          display: grid;
          gap: 10px;
          margin-top: 4px;
        }

        .check-label {
          margin: 6px 0 0;
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          color: #685f52;
          font-size: 12.5px;
          font-weight: 600;
          user-select: none;
        }

        .check-label input[type='checkbox'] {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #b67a09;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .address-actions {
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .gold-btn,
        .ghost-btn {
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          padding: 11px 16px;
        }

        .gold-btn {
          background: linear-gradient(120deg, #ab7106, #c28918);
          color: #fff;
        }

        .gold-btn:hover {
          filter: brightness(1.05);
        }

        .ghost-btn {
          background: #fff6e5;
          color: #8d5f04;
          border: 1px solid #e0c58f;
        }

        .text-link {
          color: #9e6e03;
          font-weight: 800;
          text-decoration: underline;
        }

        .profile-view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .profile-view-item {
          border: 1px solid #efe3cf;
          border-radius: 12px;
          background: #fffdfa;
          padding: 12px;
        }

        .profile-view-item label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #9a8f7b;
          margin-bottom: 6px;
        }

        .profile-view-item p {
          margin: 0;
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          color: #1f1a14;
          line-height: 1.35;
        }

        .profile-view-full {
          grid-column: 1 / -1;
        }

        .profile-action-row {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .profile-hero {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .profile-layout-v2 {
            grid-template-columns: 1fr;
          }

          .saved-top-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 700px) {
          .field-grid.two,
          .field-grid.three {
            grid-template-columns: 1fr;
          }

          .profile-view-grid {
            grid-template-columns: 1fr;
          }

          .profile-hero h1 {
            font-size: 25px;
          }

          .profile-panel h2 {
            font-size: 24px;
          }

          .address-actions .gold-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
