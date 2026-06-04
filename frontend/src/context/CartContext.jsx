import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const allProducts = {
    'prod-honey-15g': { id: 'prod-honey-15g', name: 'Hommed Honey 15g', price: 15, originalPrice: 20, rating: 4.8, image: '15gm.png', category: 'raw-honey', weight: '15g', reviewsCount: 42, desc: 'Perfect for sampling and promotions. Easy to carry anywhere. Single serve pack. Ideal for travel and on-the-go use.' },
    'prod-honey-30g': { id: 'prod-honey-30g', name: 'Hommed Honey 30g', price: 30, originalPrice: 35, rating: 4.7, image: '30 gm.png', category: 'raw-honey', weight: '30g', reviewsCount: 55, desc: 'Great for travel and daily use. Hygienic & convenient pack. Perfect portion control. Ideal for food service industry.' },
    'prod-honey-50g': { id: 'prod-honey-50g', name: 'Hommed Honey 50g', price: 45, originalPrice: 50, rating: 4.8, image: '50 gm.png', category: 'raw-honey', weight: '50g', reviewsCount: 78, desc: 'Ideal for regular household use. Easy to pour and store. Rich taste and natural sweetness. Great for tea, milk & recipes.' },
    'prod-honey-100g': { id: 'prod-honey-100g', name: 'Hommed Honey 100g', price: 70, originalPrice: 80, rating: 4.9, image: '1oo gm.png', category: 'raw-honey', weight: '100g', reviewsCount: 104, desc: 'Perfect for daily family use. Maintains natural goodness. Supports healthy lifestyle. Ideal for cooking & beverages.' },
    'prod-honey-200g': { id: 'prod-honey-200g', name: 'Hommed Honey 200g', price: 120, originalPrice: 140, rating: 4.9, image: '200 updated.png', category: 'raw-honey', weight: '200g', reviewsCount: 128, desc: 'Great for families. Natural energy booster. Strengthens immunity. 100% pure and natural.' },
    'prod-honey-450g': { id: 'prod-honey-450g', name: 'Hommed Honey 450g', price: 225, originalPrice: 250, rating: 4.8, image: '450 Gm.png', category: 'raw-honey', weight: '450g', reviewsCount: 92, desc: 'Value pack for families. Pure, natural & wholesome. Perfect for daily consumption. Delicious in every drop.' },
    'prod-honey-1kg': { id: 'prod-honey-1kg', name: 'Hommed Honey 1kg', price: 499, originalPrice: 590, rating: 5.0, image: 'honey dabba.png', category: 'raw-honey', weight: '1kg', reviewsCount: 240, desc: 'Bulk pack for high consumption. Ideal for large families & businesses. 100% pure and natural. Premium quality honey.' },
    'prod-pumpkin-seeds': { id: 'prod-pumpkin-seeds', name: 'Premium Pumpkin Seeds', price: 180, originalPrice: 220, rating: 4.8, image: 'PUMPKIN SEEDS 250 GM.jpeg', category: 'seeds', weight: '200g', reviewsCount: 64, desc: 'Premium quality raw pumpkin seeds - nutrient-dense, rich in zinc and magnesium, perfect for snacking.' },
    'prod-sunflower-seeds': { id: 'prod-sunflower-seeds', name: 'Premium Sunflower Seeds', price: 150, originalPrice: 190, rating: 4.7, image: 'SUNFLOWER SEEDS 250 GM.jpeg', category: 'seeds', weight: '250g', reviewsCount: 48, desc: 'Nutrient-rich raw sunflower seeds loaded with vitamin E and healthy fats.' },
    'prod-chia-seeds': { id: 'prod-chia-seeds', name: 'Premium Chia Seeds', price: 160, originalPrice: 200, rating: 4.9, image: 'CHIA SEEDS 250 GM.jpeg', category: 'seeds', weight: '200g', reviewsCount: 82, desc: 'Superfood organic chia seeds packed with omega-3 fatty acids, fiber, and protein.' },
    'prod-watermelon-seeds': { id: 'prod-watermelon-seeds', name: 'Premium Watermelon Seeds', price: 140, originalPrice: 175, rating: 4.6, image: 'WATERMELON SEEDS 250 GM.jpeg', category: 'seeds', weight: '200g', reviewsCount: 36, desc: 'Crunchy raw watermelon seeds, a rich source of iron, potassium, and magnesium.' },
    'prod-anjeer': { id: 'prod-anjeer', name: 'Premium Dried Anjeer', price: 349, originalPrice: 399, rating: 4.9, image: 'Anjeer 200 gm .jpeg', category: 'premium-collection', weight: '200g', reviewsCount: 112, desc: 'Handpicked premium soft and sweet dried figs (Anjeer) rich in fiber and essential minerals.' },
    'prod-duet-combo': { id: 'prod-duet-combo', name: 'Premium Honey Duet Combo', price: 549, originalPrice: 649, rating: 4.9, image: 'combo.png', category: 'gift-packs', weight: '2 x 250g', reviewsCount: 78, desc: 'A wellness duet pairing wildflower honey alongside organic nuts.' },
    'prod-gift-pack': { id: 'prod-gift-pack', name: 'Honey Gift Pack', price: 799, originalPrice: 999, rating: 4.9, image: 'combo.png', category: 'gift-packs', weight: '3 x 100g', reviewsCount: 210, isBestseller: true, desc: 'A gorgeous wellness gift hamper bundling three signature honey jars.' }
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
