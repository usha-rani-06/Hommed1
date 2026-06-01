import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const Insights = () => {
  const { getImageUrl } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'source', label: 'Sourcing' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'kitchen', label: 'Kitchen' }
  ];

  const articles = [
    {
      id: 1,
      title: 'How to read honey purity beyond the label',
      category: 'source',
      tag: 'Sourcing',
      readTime: '6 min read',
      date: 'May 12, 2026',
      desc: 'A practical guide to texture, aroma, crystallization, and the questions that matter before buying honey.',
      image: 'honey in tree.png'
    },
    {
      id: 2,
      title: 'A calmer morning ritual with raw honey',
      category: 'wellness',
      tag: 'Wellness',
      readTime: '4 min read',
      date: 'May 08, 2026',
      desc: 'Simple ways to use honey without overheating it or turning a daily routine into a complicated wellness project.',
      image: 'honey spoon.png'
    },
    {
      id: 3,
      title: 'Pairing honey with figs, seeds, and tea',
      category: 'kitchen',
      tag: 'Kitchen',
      readTime: '5 min read',
      date: 'Apr 28, 2026',
      desc: 'Balanced snack and drink ideas built around natural sweetness, texture, and clean pantry ingredients.',
      image: 'combo.png'
    },
    {
      id: 4,
      title: 'Why seasonal honey can taste different',
      category: 'source',
      tag: 'Sourcing',
      readTime: '7 min read',
      date: 'Apr 18, 2026',
      desc: 'Flowers, climate, hive location, and harvest timing all shape the taste of a real jar.',
      image: 'honey items .png'
    },
    {
      id: 5,
      title: 'Honey in warm drinks without losing character',
      category: 'wellness',
      tag: 'Wellness',
      readTime: '3 min read',
      date: 'Mar 30, 2026',
      desc: "Temperature, timing, and small habits that help preserve more of honey's natural flavour.",
      image: 'honey dabba.png'
    },
    {
      id: 6,
      title: 'A simple clean pantry checklist',
      category: 'kitchen',
      tag: 'Kitchen',
      readTime: '6 min read',
      date: 'Mar 24, 2026',
      desc: 'Build a useful shelf with honey, seeds, dried fruit, tea, spices, and everyday staples.',
      image: 'seeds.png'
    }
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((article) => article.category === selectedCategory);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="insights-page-container refined-page insights-refined">
      <section className="insights-editorial-hero" aria-label="HOMMED Journal">
        <div className="insights-hero-copy">
          <span className="refined-kicker">Journal</span>
          <h1>Better honey starts with better questions.</h1>
          <p>
            Explore sourcing, clean routines, kitchen ideas, and practical notes for choosing honey with more confidence.
          </p>
        </div>
        <article className="insights-feature-card">
          <img src={getImageUrl('honey in tree.png')} alt="Honeycomb in a natural tree setting" />
          <div>
            <span>Featured</span>
            <h2>What natural honey should feel like before it reaches your table.</h2>
            <p>From hive setting to final jar, a clear look at what careful handling protects.</p>
          </div>
        </article>
      </section>

      <section className="insights-tabs-section" aria-label="Article categories">
        <div className="insights-filter-tabs refined-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-tab-btn ${selectedCategory === cat.id ? 'tab-active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="insights-layout" aria-label="Latest articles">
        <aside className="insights-sidebar">
          <span className="refined-kicker">Editor's Notes</span>
          <h2>Small details make better daily choices.</h2>
          <p>
            Use these reads as a quiet guide to sourcing, storage, flavour, and the everyday rituals that make clean
            ingredients easier to trust.
          </p>
          <div className="insights-stat-list">
            <span>6 curated reads</span>
            <span>3 practical themes</span>
            <span>Monthly updates</span>
          </div>
        </aside>

        <div className="insights-article-grid">
          {filteredArticles.map((article) => (
            <article className="insights-article-card" key={article.id}>
              <img src={getImageUrl(article.image)} alt={article.title} />
              <div>
                <span>{article.tag}</span>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
                <small>{article.date} / {article.readTime}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="insights-knowledge-band" aria-label="Honey knowledge">
        <div>
          <span className="refined-kicker">Field Notes</span>
          <h2>Look for aroma, texture, source, and restraint.</h2>
        </div>
        <p>
          Pure honey is not always identical from jar to jar. Its colour, thickness, and flavour can shift with flowers,
          region, and season. That variation is part of what makes it real.
        </p>
      </section>

      <section className="newsletter-section insights-newsletter-refined" aria-label="Newsletter signup">
        <div className="newsletter-card-inner">
          <span className="refined-kicker">Newsletter</span>
          <h2>Get the next hive note.</h2>
          <p>Monthly thoughts on clean ingredients, honey rituals, recipes, and new seasonal arrivals.</p>
          <form className="newsletter-form-capture" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscribed && <p className="newsletter-thanks">Thank you. You are subscribed to the HOMMED Journal.</p>}
        </div>
      </section>
    </div>
  );
};
