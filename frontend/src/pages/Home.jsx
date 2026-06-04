import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { allProducts, getImageUrl, addToCart, isMenuOpen } = useCart();
  const navigate = useNavigate();

  const heroCards = [
    {
      title: 'From Hive to Jar.',
      copy: 'What begins in nature stays that way - pure, untouched, and carefully brought to you.',
      image: 'homepage honey.png',
      alt: 'HOMMED wild flower honey jar with honey dipper and honeycomb',
      label: 'Wild flower honey product',
      background: '#FDF2B4'
    },
    {
      title: 'From Farm to Table.',
      copy: 'Carefully cultivated on our farms and minimally handled to preserve the natural goodness of every harvest.',
      image: 'bg anjeer.png',
      alt: 'HOMMED anjeer jar with dry fruits and seeds',
      label: 'From farm to table product',
      background: '#EED7A7'
    },
    {
      title: 'From Farm to Crunch.',
      copy: 'Carefully cultivated on our farms and minimally handled to preserve the natural goodness of every harvest.',
      image: 'watermelon seeds.png',
      alt: 'HOMMED watermelon seeds jar with watermelon and seeds',
      label: 'From farm to crunch product',
      background: '#FBE8DD'
    }
  ];

  const [activeHeroCard, setActiveHeroCard] = useState(0);
  const currentHeroCard = heroCards[activeHeroCard];

  const featuredProductIds = ['prod-anjeer', 'prod-sunflower-seeds', 'prod-honey-1kg'];
  const testimonialCards = [
    { name: '- Aarav Mehta', role: 'Social Media Manager', className: 'testimonial-card-one', image: 'TESTIMONIAL 1.png' },
    { name: '- Nisha Rao', role: 'Wellness Coach', className: 'testimonial-card-two', image: 'TESTIMONIAL 2.png' },
    { name: '- Kabir Sethi', role: 'Founder', className: 'testimonial-card-three', image: 'TESTIMONIAL 3.png' },
    { name: '- Diya Kapoor', role: 'Home Chef', className: 'testimonial-card-four', image: 'TESTIMONIAL 4.png' },
    { name: '- Rohan Shah', role: 'Fitness Trainer', className: 'testimonial-card-one', image: 'TESTIMONIAL 5.png' },
    { name: '- Tara Iyer', role: 'Nutrition Writer', className: 'testimonial-card-two', image: 'TESTIMONIAL 6.png' },
    { name: '- Meera Jain', role: 'Product Designer', className: 'testimonial-card-three', image: 'TESTIMONIAL 7.png' },
    { name: '- Dev Malhotra', role: 'Brand Strategist', className: 'testimonial-card-four', image: 'TESTIMONIAL 8.png' }
  ];

  const handleBuyNow = (productId) => {
    const product = allProducts[productId];
    if (product) {
      localStorage.setItem('checkoutSource', 'buynow');
      localStorage.setItem('buyNowItem', JSON.stringify({ ...product, qty: 1 }));
      navigate('/checkout');
    }
  };

  const showPreviousHeroCard = () => {
    setActiveHeroCard((current) => (current === 0 ? heroCards.length - 1 : current - 1));
  };

  const showNextHeroCard = () => {
    setActiveHeroCard((current) => (current + 1) % heroCards.length);
  };


  return (
    <>
      <main className={`hero hero-slide-${activeHeroCard}`} style={{ '--hero-bg': currentHeroCard.background }} aria-label="HOMMED premium honey hero">
        <img className="hero-honeycomb hero-honeycomb-left" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />
        <img className="hero-honeycomb hero-honeycomb-center" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />
        <img className="hero-honeycomb hero-honeycomb-right" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <img className="gold-leaves" src={getImageUrl('golden leaves.png')} alt="" aria-hidden="true" />
        {activeHeroCard === 0 && (
          <>
            <img className="hero-green-leaf hero-green-leaf-left" src={getImageUrl('green leaf.png')} alt="" aria-hidden="true" />
            <img className="hero-green-leaf hero-green-leaf-right" src={getImageUrl('green leaf 1.png')} alt="" aria-hidden="true" />
          </>
        )}

        <aside className={`menu-panel ${isMenuOpen ? 'menu-active' : ''}`} aria-label="Main menu">
          <div className="menu-card">
            <img className="menu-card-honeycomb menu-card-left" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />
            <img className="menu-card-honeycomb menu-card-right" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

            <p className="menu-kicker">Menu</p>
            <nav className="menu-links" aria-label="Menu links">
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/insights">Insights</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/login">My Account</Link>
            </nav>
            <p className="menu-note">Clean living, mindful updates, and<br />thoughtful wellness inspiration.</p>
            <div className="menu-contact">
              <p>Stay Connected</p>
              <a href="mailto:info@Hommed.com">info@Hommed.com</a>
            </div>
          </div>
        </aside>

        <section className="hero-copy" key={`copy-${activeHeroCard}`}>
          <h1>{currentHeroCard.title}</h1>
          <p>{currentHeroCard.copy}</p>
          <Link className="cta" to="/shop">
            <span>Shop Now</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2.1l2.55 11.34a2 2 0 0 0 1.95 1.56h7.5a2 2 0 0 0 1.9-1.37L21 9H7"></path>
              <circle cx="10" cy="20" r="1.35"></circle>
              <circle cx="17" cy="20" r="1.35"></circle>
            </svg>
          </Link>
        </section>

        <section className="product-stage" aria-label={currentHeroCard.label} key={`image-${activeHeroCard}`}>
          <img src={getImageUrl(currentHeroCard.image)} alt={currentHeroCard.alt} />
        </section>

        <aside className="social-sidebar" aria-label="Social links">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="5" width="14" height="14" rx="4"></rect>
              <circle cx="12" cy="12" r="3.3"></circle>
              <circle className="filled" cx="16.5" cy="7.6" r="1"></circle>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="facebook-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className="filled"
                d="M14.45 8.08h2.18V4.35A26.2 26.2 0 0 0 13.45 4c-3.15 0-5.3 1.92-5.3 5.43v3.05H4.6v4.17h3.55V24h4.36v-7.35h3.42l.54-4.17h-3.96V9.84c0-1.2.33-1.76 1.94-1.76Z">
              </path>
            </svg>
          </a>
          <a href="#" aria-label="Twitter X" className="x-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19"></path>
            </svg>
          </a>
        </aside>

        <div className="slider-nav" aria-label="Product slider navigation">
          <button className="slider-btn prev" type="button" aria-label="Previous hero card" onClick={showPreviousHeroCard}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 6-6 6 6 6"></path>
            </svg>
          </button>
          <button className="slider-btn next" type="button" aria-label="Next hero card" onClick={showNextHeroCard}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9.5 6 6 6-6 6"></path>
            </svg>
          </button>
          <div className="hero-card-dots" aria-label="Choose hero card">
            {heroCards.map((card, index) => (
              <button
                className={`hero-card-dot ${index === activeHeroCard ? 'active' : ''}`}
                type="button"
                aria-label={`Show ${card.label}`}
                aria-current={index === activeHeroCard ? 'true' : undefined}
                key={card.title}
                onClick={() => setActiveHeroCard(index)}
              />
            ))}
          </div>
        </div>

        <div className="ribbon" aria-label="Honey quality highlights">
          <div className="ribbon-track">
            <span>No additives</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No dilution</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>Pure by nature</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No additives</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No dilution</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>Pure by nature</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
          </div>
          <div className="ribbon-track" aria-hidden="true">
            <span>No additives</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No dilution</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>Pure by nature</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No additives</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>No dilution</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
            <span>Pure by nature</span>
            <svg className="ribbon-star" viewBox="0 0 22 24" aria-hidden="true">
              <path d="M9.04 0h3.92l-.55 8.19 6.52-5 2.35 3.28-7.6 3.17 7.6 3.17-2.35 3.28-6.52-5 .55 8.19H9.04l.55-8.19-6.52 5L.72 12.81l7.6-3.17-7.6-3.17L3.07 3.19l6.52 5L9.04 0Z"></path>
            </svg>
          </div>
        </div>
      </main>

      <section className="purity-section" aria-label="Honey purity story">
        <img className="purity-honeycomb" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <p className="purity-copy">
          Harvested from untouched natural landscapes, our honey
          is carefully sourced from thriving hives where bees
          flourish in their purest environment. Every drop carries
          the richness of real flowers, golden warmth, and nature's
          authentic sweetness — unprocessed, wholesome, and
          crafted to bring purity straight to your table.
        </p>

        <h2 className="purity-heading">
          <span className="purity-gold">Every jar has a beginning.</span>
          <span className="purity-soft">Ours begins where purity</span>
          <span className="purity-pale">already exists.</span>
        </h2>
      </section>

      <section className="products-section" aria-label="Featured products">
        <div className="products-bg-honeycomb" aria-hidden="true">
          <img className="products-honeycomb-left" src={getImageUrl('Group 1.png')} alt="" />
          <img className="products-honeycomb-right" src={getImageUrl('Group 1.png')} alt="" />
        </div>

        <div className="products-header">
          <div>
            <h2>Start with Something Real</h2>
            <p>At HOMMED, purity isn’t created through processing — it’s<br />preserved through care, transparency, and minimal interference.</p>
          </div>
          <span>[ FEATURED PRODUCTS ]</span>
        </div>

        <div className="product-grid" id="featured-products">
          {featuredProductIds.map((id) => {
            const product = allProducts[id];
            if (!product) return null;
            return <ProductCard key={id} product={product} isFeatured={true} />;
          })}
        </div>
      </section>

      <section className="origin-section" aria-label="Honey origin story">
        <img className="origin-tree" src={getImageUrl('honey in tree.png')} alt="Honeycomb hanging from a tree with bees" />

        <div className="origin-content">
          <span className="origin-kicker">[ ABOUT US ]</span>
          <h2 className="origin-heading">
            <span>From Nature's Source</span> to Your Home.
          </h2>
          <p className="origin-copy">
            Nature already creates balance when given the right environment, time, and care. At HOMMED, our honey is
            thoughtfully sourced from natural hives, while our anjeer is grown in our own farms with patience and respect
            for the land. From cultivation and harvesting to careful handling, every step is focused on preserving the
            purity, richness, and authenticity nature intended from the very beginning.
          </p>
          <Link className="origin-cta" to="/shop">
            More Details
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8"></path>
            </svg>
          </Link>
        </div>
      </section>

      <section className="why-section" aria-label="Why HOMMED feels different">
        <div className="why-bg" aria-hidden="true">
          <img className="why-honeycomb why-honeycomb-left" src={getImageUrl('Group 1.png')} alt="" />
          <img className="why-honeycomb why-honeycomb-right" src={getImageUrl('Group 1.png')} alt="" />
        </div>

        <div className="why-header">
          <span>[ WHY US ]</span>
          <div>
            <h2>Why It Feels Different</h2>
            <p>At HOMMED, purity isn’t created through processing - it’s preserved through care, transparency, and minimal interference.</p>
          </div>
        </div>

        <div className="why-grid">
          <article className="why-card why-card-natural">
            <span className="why-mark why-flower" aria-hidden="true"></span>
            <h3>Naturally sourced</h3>
            <p>Carefully selected from trusted natural origins.</p>
          </article>

          <figure className="why-image">
            <img src={getImageUrl('honey spoon.png')} alt="Golden honeycomb with honey dripping from a wooden spoon" />
          </figure>

          <article className="why-card why-card-quality">
            <span className="why-mark why-abstract" aria-hidden="true"></span>
            <h3>Everyday trusted quality</h3>
            <p>Carefully selected from trusted natural origins.</p>
          </article>

          <article className="why-card why-card-processing">
            <span className="why-mark why-hourglass" aria-hidden="true"></span>
            <h3>No unnecessary processing</h3>
            <p>Carefully selected from trusted natural origins.</p>
          </article>

          <article className="why-card why-card-handling">
            <span className="why-mark why-ribbon" aria-hidden="true"></span>
            <h3>Transparent handling</h3>
            <p>Every step handled with honesty and care.</p>
          </article>


        </div>
      </section>

      <section className="categories-section" aria-label="Product categories">
        <img className="categories-honeycomb categories-honeycomb-top" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />
        <img className="categories-honeycomb categories-honeycomb-bottom" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <div className="categories-header">
          <div>
            <h2>More Than Just Honey</h2>
            <p>Built around clean ingredients and everyday wellness.</p>
          </div>
          <span>[ CATEGORIES ]</span>
        </div>

        <div className="categories-grid">
          <Link to="/shop?category=honey" className="category-card category-honey" style={{ textDecoration: 'none' }}>
            <img src={getImageUrl('honey.png')} alt="HOMMED natural honey bottle in a honeycomb scene" />
            <h3>Honey</h3>
          </Link>

          <Link to="/shop?category=seeds" className="category-card category-seeds" style={{ textDecoration: 'none' }}>
            <img src={getImageUrl('seeds.png')} alt="HOMMED seeds pack surrounded by seeds and leaves" />
            <h3>Seeds</h3>
          </Link>

          <Link to="/shop?category=superfoods" className="category-card category-superfoods" style={{ textDecoration: 'none' }}>
            <img src={getImageUrl('anjeer.png')} alt="HOMMED anjeer dried figs pack" />
            <h3>Superfoods</h3>
          </Link>

          <Link to="/shop?category=combos" className="category-card category-combos" style={{ textDecoration: 'none' }}>
            <img src={getImageUrl('combo.png')} alt="HOMMED honey, anjeer, and seeds combo hamper" />
            <h3>Combos</h3>
          </Link>
        </div>
      </section>

      <section className="nutrition-section" aria-label="Honey nutrition benefits">
        <img className="nutrition-honeycomb nutrition-honeycomb-left" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />
        <img className="nutrition-honeycomb nutrition-honeycomb-right" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <header className="nutrition-header">
          <h2>Naturally Delicious Purley Anjeer</h2>
          <p>sun-dried to perfection.Naturally rich in goodness</p>
        </header>

        <div className="nutrition-stage">
          <img src={getImageUrl('anjeer copy.png')} alt="Honey bowl with botanicals, citrus, mint, ginger, and seeds" />
        </div>
      </section>

      <section className="testimonials-section" aria-label="Customer testimonials">
        <img className="testimonials-honeycomb" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <div className="testimonials-header">
          <div>
            <h2>People Notice <span>the Difference</span></h2>
            <p>Everything you need to know, clearly stated and honestly handled.</p>
          </div>
          <span>[ TESTIMONIALS ]</span>
        </div>

        <div className="testimonial-marquee" aria-label="Customer review cards">
          {[0, 1].map((loopIndex) => (
            <div className="testimonial-track" aria-hidden={loopIndex === 1} key={loopIndex}>
              {testimonialCards.map((item) => (
                <article className={`testimonial-card ${item.className}`} key={`${loopIndex}-${item.name}`}>
                  <img className="testimonial-photo" src={getImageUrl(item.image)} alt={loopIndex === 0 ? 'Customer portrait' : ''} />
                  <div className="testimonial-stars" aria-label="4 out of 5 stars">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span className="star-empty">☆</span>
                  </div>
                  <div className="testimonial-content">
                    <h3>"It doesn't taste processed - and that changes everything."</h3>
                    <p>{item.name}</p>
                    <small>{item.role}</small>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>

        <div className="testimonial-track testimonial-track-static-hidden" aria-hidden="true">
          <article className="testimonial-card testimonial-card-one">
            <img className="testimonial-photo" src={getImageUrl('TESTIMONIAL 1.png')} alt="Customer portrait" />
            <div className="testimonial-stars" aria-label="4 out of 5 stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span className="star-empty">☆</span>
            </div>
            <div className="testimonial-content">
              <h3>“It doesn’t taste processed — and that changes everything.”</h3>
              <p>- Aarav Mehta</p>
              <small>Social Media Manager</small>
            </div>
          </article>

          <article className="testimonial-card testimonial-card-two">
            <img className="testimonial-photo" src={getImageUrl('TESTIMONIAL 2.png')} alt="Customer portrait" />
            <div className="testimonial-stars" aria-label="4 out of 5 stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span className="star-empty">☆</span>
            </div>
            <div className="testimonial-content">
              <h3>“It doesn’t taste processed — and that changes everything.”</h3>
              <p>- Aarav Mehta</p>
              <small>Social Media Manager</small>
            </div>
          </article>

          <article className="testimonial-card testimonial-card-three">
            <img className="testimonial-photo" src={getImageUrl('TESTIMONIAL 3.png')} alt="Customer portrait" />
            <div className="testimonial-stars" aria-label="4 out of 5 stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span className="star-empty">☆</span>
            </div>
            <div className="testimonial-content">
              <h3>“It doesn’t taste processed — and that changes everything.”</h3>
              <p>- Aarav Mehta</p>
              <small>Social Media Manager</small>
            </div>
          </article>

          <article className="testimonial-card testimonial-card-four" aria-hidden="true">
            <img className="testimonial-photo" src={getImageUrl('TESTIMONIAL 4.png')} alt="" />
            <div className="testimonial-content">
              <h3>“It doesn’t taste processed — and that changes everything.”</h3>
              <p>- Aarav Mehta</p>
              <small>Social Media Manager</small>
            </div>
          </article>
        </div>

        <p className="testimonials-note">
          What stands out about HOMMED is how untouched everything
          feels — from the flavour to the overall experience. It genuinely
          feels closer to its source.
        </p>
      </section>

      <section className="figma-honey-section" aria-label="Clean honest products">
        <div className="figma-honey-copy">
          <h2>Bring Home What’s Real</h2>
          <p>No confusion. No compromise. Just clean, honest<br />products made for everyday living.</p>
          <div className="figma-honey-actions">
            <Link className="figma-honey-btn figma-honey-btn-primary" to="/shop">
              <span>Shop Now</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2.1l2.55 11.34a2 2 0 0 0 1.95 1.56h7.5a2 2 0 0 0 1.9-1.37L21 9H7"></path>
                <circle cx="10" cy="20" r="1.35"></circle>
                <circle cx="17" cy="20" r="1.35"></circle>
              </svg>
            </Link>
            <a className="figma-honey-btn figma-honey-btn-secondary" href="#">Explore More</a>
          </div>
        </div>
      </section>

      <section className="blogs-section" aria-label="Honey blog articles">
        <img className="blogs-honeycomb" src={getImageUrl('Group 1.png')} alt="" aria-hidden="true" />

        <header className="blogs-header">
          <h2>Know <span>What You Consume</span></h2>
          <span>[ BLOGS ]</span>
        </header>

        <div className="blogs-grid">
          <article className="blog-card blog-card-one">
            <img src={getImageUrl('sunflower seeds.png')} alt="Honey dipper pouring honey onto a spoon" />
            <time dateTime="2026-01-27">27th Jan, 2026</time>
            <h3>How Pure Is the Snack You Choose Every Day?</h3>
          </article>

          <article className="blog-card blog-card-two">
            <img src={getImageUrl('pumpkin seeds.png')} alt="Honey dipper pouring honey onto a spoon" />
            <time dateTime="2026-01-27">27th Jan, 2026</time>
            <h3>From Shell to Seed: The Journey of a Pumpkin Seed</h3>
          </article>

          <article className="blog-card blog-card-three">
            <img src={getImageUrl('ws.png')} alt="Honey dipper pouring honey onto a spoon" />
            <time dateTime="2026-01-27">27th Jan, 2026</time>
            <h3>Why Nutrient Density Matters More Than You Think</h3>
          </article>

          <article className="blog-card blog-card-four">
            <img src={getImageUrl('CHIA SEEDS.png')} alt="Honey dipper pouring honey onto a spoon" />
            <time dateTime="2026-01-27">27th Jan, 2026</time>
            <h3>What Clean Nutrition Actually Looks Like</h3>
          </article>
        </div>
      </section>
    </>
  );
};
