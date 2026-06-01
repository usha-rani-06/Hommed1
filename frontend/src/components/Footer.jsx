import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Footer = () => {
  const { getImageUrl } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="hommed-footer" aria-label="HOMMED footer">
      <img className="footer-honeycomb" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-left">
            <h2>Let's Bring<br /><span>Nature Closer To You.</span></h2>

            <form className="footer-subscribe" onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input id="footer-email" type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>

            <div className="footer-contact-row">
              <div className="footer-contact">
                <h3>Socials</h3>
                <div className="footer-socials">
                  <a href="#" aria-label="X">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.3l.7-3h-3V9c0-.6.4-1 1-1Z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 10v8M7 7.5v.1M11 18v-8M11 13.4c0-2 1.2-3.4 3.2-3.4 1.8 0 2.8 1.2 2.8 3.4V18"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="footer-contact">
                <h3>Email</h3>
                <a href="mailto:info@Hommed.com">info@Hommed.com</a>
              </div>

              <div className="footer-contact">
                <h3>Phone</h3>
                <a href="tel:+911234567890">+91 1234567890</a>
              </div>
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <div>
              <h3>Explore</h3>
              <Link to="/shop">Shop</Link>
              <Link to="/about">Our Story</Link>
              <Link to="/about#process">From Hive to Jar</Link>
              <Link to="/insights">Insights</Link>
            </div>

            <div>
              <h3>Categories</h3>
              <Link to="/shop?category=honey">Honey</Link>
              <Link to="/shop?category=seeds">Seeds</Link>
              <Link to="/shop?category=superfoods">Superfoods</Link>
              <Link to="/shop?category=combos">Combos</Link>
            </div>

            <div>
              <h3>Support</h3>
              <Link to="/contact">Contact</Link>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <Link to="/contact#faq">FAQS</Link>
            </div>
          </nav>
        </div>

        <div className="footer-divider" aria-hidden="true"></div>
        <p className="footer-watermark" aria-hidden="true">Hommed</p>
        <div className="footer-bottom">
          <p>&copy; 2026 Hommed - All rights reserved. Design by Lumen Consulting</p>
          <nav aria-label="Footer legal links">
            <a href="#">Write For Us</a>
            <a href="#">Terms &amp; Condition</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Sitemap</a>
            <a href="#">Accessibility</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
