import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const allProducts = {
    'prod-wild-forest': { id: 'prod-wild-forest', name: 'Wild Forest Honey', price: 499, originalPrice: 599, rating: 5.0, image: 'honey dabba.png', category: 'wild-forest-honey', weight: '500g', reviewsCount: 128, desc: 'Pure wild forest honey sourced from local natural wildflower hives - unprocessed, rich, and wholesome.' },
    'prod-organic-raw': { id: 'prod-organic-raw', name: 'Organic Raw Honey', price: 699, originalPrice: 799, rating: 4.8, image: 'homepage honey.png', category: 'organic-honey', weight: '750g', reviewsCount: 156, desc: 'Naturally certified organic raw honey from untouched organic fields.' },
    'prod-himalayan': { id: 'prod-himalayan', name: 'Himalayan Honey', price: 899, originalPrice: 999, rating: 4.9, image: 'honey.png', category: 'organic-honey', weight: '1kg', reviewsCount: 182, desc: 'High-altitude organic Himalayan honey harvested from deep mountain valleys.' },
    'prod-premium-gold': { id: 'prod-premium-gold', name: 'Premium Gold Honey', price: 1199, originalPrice: 1399, rating: 4.7, image: 'honey spoon.png', category: 'premium-collection', weight: '1kg', reviewsCount: 98, desc: 'Our signature reserve luxury golden honey of the highest purity.' },
    'prod-gift-pack': { id: 'prod-gift-pack', name: 'Honey Gift Pack', price: 1499, originalPrice: 1799, rating: 4.9, image: 'combo.png', category: 'gift-packs', weight: '3 x 250g', reviewsCount: 210, isBestseller: true, desc: 'A gorgeous corporate wellness gift hamper bundling three signature honey jars.' },
    'prod-natural-bee': { id: 'prod-natural-bee', name: 'Natural Bee Honey', price: 599, originalPrice: 699, rating: 4.6, image: 'honey.png', category: 'raw-honey', weight: '500g', reviewsCount: 134, desc: 'Mindfully extracted raw bee honey filled with natural enzymes and pollen.' },
    'prod-acacia': { id: 'prod-acacia', name: 'Acacia Honey', price: 649, originalPrice: 749, rating: 4.5, image: 'honey.png', category: 'premium-collection', weight: '500g', reviewsCount: 108, desc: 'Luxuriously clear, light Acacia honey with a delicate sweet floral notes.' },
    'prod-tulsi': { id: 'prod-tulsi', name: 'Tulsi Honey', price: 549, originalPrice: 649, rating: 4.4, image: 'honey.png', category: 'wild-forest-honey', weight: '500g', reviewsCount: 98, desc: 'Medicinal honey infused with organic Tulsi leaves for immune defense.' },
    'prod-multi-floral': { id: 'prod-multi-floral', name: 'Multi Floral Honey', price: 699, originalPrice: 799, rating: 4.7, image: 'honey.png', category: 'organic-honey', weight: '750g', reviewsCount: 115, desc: 'Multiflora organic honey packing rich vitamins and deep forest tones.' },
    'prod-jamun': { id: 'prod-jamun', name: 'Jamun Honey', price: 599, originalPrice: 699, rating: 4.5, image: 'honey.png', category: 'raw-honey', weight: '500g', reviewsCount: 89, desc: 'Sourced from Jamun orchards, this dark honey offers diabetic-friendly sweetness.' },
    'prod-sunflower': { id: 'prod-sunflower', name: 'Sunflower Honey', price: 649, originalPrice: 749, rating: 4.6, image: 'honey.png', category: 'wild-forest-honey', weight: '750g', reviewsCount: 72, desc: 'Golden, warm sunflower honey harvested from sprawling sunlit farms.' },
    'prod-litchi': { id: 'prod-litchi', name: 'Litchi Honey', price: 599, originalPrice: 699, rating: 4.3, image: 'honey.png', category: 'wild-forest-honey', weight: '500g', reviewsCount: 64, desc: 'Monofloral honey from litchi orchards carrying a sweet, fruity aftertaste.' },
    'prod-sidr-royal': { id: 'prod-sidr-royal', name: 'Sidr Royal Honey', price: 1899, originalPrice: 2199, rating: 4.9, image: 'honey.png', category: 'premium-collection', weight: '250g', reviewsCount: 120, desc: 'Rare and precious Sidr honey with supreme anti-inflammatory properties.' },
    'prod-kashmir-saffron': { id: 'prod-kashmir-saffron', name: 'Kashmir Saffron Honey', price: 999, originalPrice: 1199, rating: 4.8, image: 'honey.png', category: 'premium-collection', weight: '250g', reviewsCount: 95, desc: 'Premium Kashmiri saffron threads submerged in deep raw organic forest honey.' },
    'prod-eucalyptus': { id: 'prod-eucalyptus', name: 'Eucalyptus Honey', price: 499, originalPrice: 599, rating: 4.5, image: 'honey.png', category: 'raw-honey', weight: '500g', reviewsCount: 60, desc: 'Strong herbal honey harvested from dense eucalyptus forest belts.' },
    'prod-neem': { id: 'prod-neem', name: 'Neem Organic Honey', price: 549, originalPrice: 649, rating: 4.6, image: 'honey.png', category: 'raw-honey', weight: '500g', reviewsCount: 85, desc: 'Rich medicinal honey loaded with blood-purifying neem active bio-agents.' },
    'prod-clover': { id: 'prod-clover', name: 'Clover Blossom Honey', price: 599, originalPrice: 699, rating: 4.7, image: 'honey.png', category: 'raw-honey', weight: '500g', reviewsCount: 110, desc: 'Classic sweet honey sourced from sprawling clover blossom fields.' },
    'prod-ginger': { id: 'prod-ginger', name: 'Ginger Infused Honey', price: 399, originalPrice: 499, rating: 4.4, image: 'honey.png', category: 'raw-honey', weight: '250g', reviewsCount: 45, desc: 'Warm ginger-infused wildflower honey for cold soothing and digestive comfort.' },
    'prod-forest-dew': { id: 'prod-forest-dew', name: 'Forest Dew Honey', price: 520, originalPrice: 599, rating: 4.5, image: 'honey.png', category: 'wild-forest-honey', weight: '500g', reviewsCount: 52, desc: 'Sweet woodland dew honey sliced directly from thriving green branches.' },
    'prod-berry-nectar': { id: 'prod-berry-nectar', name: 'Berry Nectar Honey', price: 480, originalPrice: 549, rating: 4.3, image: 'honey.png', category: 'wild-forest-honey', weight: '500g', reviewsCount: 38, desc: 'Fruity wildflower honey gathered from mountain blueberry and bramble blossoms.' },
    'prod-wildflower-org': { id: 'prod-wildflower-org', name: 'Wildflower Organic Honey', price: 750, originalPrice: 849, rating: 4.7, image: 'honey.png', category: 'organic-honey', weight: '750g', reviewsCount: 140, desc: 'Delicate wildflower blend carrying all organic certified health indices.' },
    'prod-sundarban': { id: 'prod-sundarban', name: 'Sundarban Honey', price: 620, originalPrice: 699, rating: 4.6, image: 'honey.png', category: 'organic-honey', weight: '500g', reviewsCount: 92, desc: 'Deep mangrove sundarban honey loaded with rare antibacterial plant extracts.' },
    'prod-duet-combo': { id: 'prod-duet-combo', name: 'Premium Honey Duet Combo', price: 1099, originalPrice: 1299, rating: 4.9, image: 'combo.png', category: 'gift-packs', weight: '2 x 250g', reviewsCount: 78, desc: 'A wellness duet pairing wildflower honey alongside organic nuts.' },
    'prod-nuts-hamper': { id: 'prod-nuts-hamper', name: 'Festive Honey & Nuts Hamper', price: 1999, originalPrice: 2299, rating: 4.8, image: 'combo.png', category: 'gift-packs', weight: '1kg', reviewsCount: 62, desc: 'Gourmet festive box holding rich saffron honey and premium roasted almonds.' }
  };

  const getImageUrl = (imageName) => {
    return new URL(`../assets/${imageName}`, import.meta.url).href;
  };

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const addToCart = (productId, qty = 1, showDrawer = true) => {
    const item = allProducts[productId];
    if (!item) return;

    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === productId);
      if (existing) {
        return prevCart.map((c) =>
          c.id === productId ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prevCart, { ...item, qty }];
    });

    if (showDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQty = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((c) => (c.id === productId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.includes(productId);
      if (exists) {
        return prevWishlist.filter((id) => id !== productId);
      }
      return [...prevWishlist, productId];
    });
  };

  const loginUser = (user, token = null) => {
    setCurrentUser({ ...user, isLoggedIn: true });
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
  };

  const updateUser = (updatedFields) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedFields };
    });
  };

  const getTotals = () => {
    let rawSubtotal = 0;
    let bulkDiscount = 0;

    cart.forEach((item) => {
      const cost = item.price * item.qty;
      rawSubtotal += cost;
      if (item.qty >= 3) {
        bulkDiscount += cost * 0.10;
      } else if (item.qty === 2) {
        bulkDiscount += cost * 0.05;
      }
    });

    const subtotal = rawSubtotal - bulkDiscount;
    const couponDiscount = isCouponApplied ? subtotal * 0.10 : 0;
    const finalSubtotal = subtotal - couponDiscount;
    const freeShippingLimit = 50.00;
    const shipping = finalSubtotal >= freeShippingLimit || finalSubtotal === 0 ? 0.00 : 5.00;
    const tax = finalSubtotal * 0.05;
    const total = finalSubtotal + shipping + tax;

    return {
      rawSubtotal,
      bulkDiscount,
      subtotal,
      couponDiscount,
      finalSubtotal,
      shipping,
      tax,
      total,
      freeShippingLimit
    };
  };

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, imageSrc = null) => {
    setToast({ message, image: imageSrc ? getImageUrl(imageSrc) : null });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        wishlist,
        currentUser,
        isCouponApplied,
        setIsCouponApplied,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isMenuOpen,
        setIsMenuOpen,
        allProducts,
        getImageUrl,
        addToCart,
        updateQty,
        removeFromCart,
        toggleWishlist,
        loginUser,
        logoutUser,
        updateUser,
        getTotals,
        showToast,
        toast
      }}
    >
      {children}
      {toast && (
        <div
          id="wishlist-user-toast"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid rgba(158, 111, 6, 0.18)',
            borderRadius: '20px',
            boxShadow: '0 12px 35px rgba(95, 59, 7, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            zIndex: 10000,
            fontFamily: "'Poppins', Arial, sans-serif",
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
            pointerEvents: 'none',
            maxWidth: '380px',
            boxSizing: 'border-box'
          }}
        >
          {toast.image && (
            <img
              src={toast.image}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                objectFit: 'contain',
                background: '#ffffff',
                border: '1px solid rgba(158, 111, 6, 0.08)',
                padding: '2px',
                flexShrink: 0
              }}
              alt=""
            />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12.5px', color: '#333333', lineHeight: 1.45, margin: 0, fontWeight: 500 }}>
              {toast.message}
            </p>
            <span style={{ fontSize: '10.5px', color: '#8c8c8c', display: 'block', marginTop: '3px', fontWeight: 500 }}>
              Shopping Bag updated
            </span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};
