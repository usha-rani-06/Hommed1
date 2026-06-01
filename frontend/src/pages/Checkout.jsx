import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../services/api';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, currentUser, setCart, getImageUrl } = useCart();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [country, setCountry] = useState('India');
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (!currentUser?.isLoggedIn) {
      navigate('/login?next=/checkout');
      return;
    }

    const source = localStorage.getItem('checkoutSource') || 'cart';
    if (source === 'buynow') {
      const buyNowItem = localStorage.getItem('buyNowItem');
      if (!buyNowItem) {
        navigate('/cart');
        return;
      }
      setCheckoutItems([JSON.parse(buyNowItem)]);
      setIsBuyNow(true);
    } else {
      if (!cart.length) {
        navigate('/cart');
        return;
      }
      setCheckoutItems(cart);
      setIsBuyNow(false);
    }
  }, [cart, currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      const defaultAddress = (currentUser.addresses || []).find((a) => a.isDefault);
      if (defaultAddress) {
        setAddress(defaultAddress.line1 || '');
        setCity(defaultAddress.city || '');
        setState(defaultAddress.state || 'Rajasthan');
        setPincode(defaultAddress.pincode || '');
        setCountry(defaultAddress.country || 'India');
      }
    }
  }, [currentUser]);

  const totals = useMemo(() => {
    const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = 50;
    const packaging = 20;
    const total = subtotal + shipping + packaging;
    return { subtotal, shipping, packaging, total };
  }, [checkoutItems]);

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!currentUser?.isLoggedIn) {
      navigate('/login?next=/checkout');
      return;
    }

    if (!name || !email || !phone || !address || !city || !pincode || !state || !country) {
      alert('Please fill all shipping fields.');
      return;
    }

    setIsLoading(true);
    try {
      const shippingAddress = {
        fullName: name,
        line1: address,
        city,
        state,
        pincode,
        country,
        phone
      };

      const orderRes = await apiRequest('/orders', {
        method: 'POST',
        body: {
          items: checkoutItems.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image
          })),
          totals,
          shippingAddress,
          paymentMethod
        }
      });

      if (saveAddress) {
        await apiRequest('/users/addresses', {
          method: 'POST',
          body: {
            ...shippingAddress,
            isDefault: true
          }
        });
      }

      if (!isBuyNow) {
        setCart([]);
      }
      localStorage.removeItem('checkoutSource');
      localStorage.removeItem('buyNowItem');

      setOrderNumber(orderRes.order?.orderNumber || 'HM-ORDER');
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      alert(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <main style={{ maxWidth: '640px', margin: '70px auto', padding: '0 20px', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Order Placed Successfully</h1>
        <p style={{ color: '#6E6E6E' }}>Order Number: <strong>{orderNumber}</strong></p>
        <button onClick={() => navigate('/profile')} style={{ marginTop: '24px', background: '#B87A00', border: 'none', color: '#FFF', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
          Go to Profile / Orders
        </button>
      </main>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 16px', fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ fontSize: '30px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        <section style={{ background: '#FFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ marginTop: 0 }}>Shipping Details</h2>
          <form onSubmit={placeOrder} style={{ display: 'grid', gap: '10px' }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address line" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>

            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
            </select>

            <label style={{ fontSize: '13px' }}>
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} style={{ marginRight: '8px' }} />
              Save this address in profile
            </label>

            <button disabled={isLoading} type="submit" style={{ height: '44px', background: '#B87A00', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </section>

        <aside style={{ background: '#FFF', border: '1px solid #ECE7E0', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ marginTop: 0 }}>Order Summary</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {checkoutItems.map((item) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: '10px', alignItems: 'center' }}>
                <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#F8F8F8', borderRadius: '8px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#7E7870' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>Rs. {(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
          <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><strong>Rs. {totals.subtotal.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><strong>Rs. {totals.shipping.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Packaging</span><strong>Rs. {totals.packaging.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}><span>Total</span><strong>Rs. {totals.total.toFixed(2)}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
};
