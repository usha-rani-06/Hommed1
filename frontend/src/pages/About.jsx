import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const About = () => {
  const { getImageUrl } = useCart();
  const [activeFaq, setActiveFaq] = useState(0);

  const principles = [
    {
      title: 'Source First',
      desc: 'We begin with trusted apiaries, natural forage zones, and harvests that respect the colony.'
    },
    {
      title: 'Handled Gently',
      desc: 'Our honey is protected from unnecessary heat, dilution, and aggressive processing.'
    },
    {
      title: 'Clear Standards',
      desc: 'Every batch is checked for purity, moisture balance, flavour, and traceable handling.'
    }
  ];

  const processSteps = [
    ['01', 'Find the right hive', 'We select honey from regions where flowers, season, and hive health naturally produce better flavour.'],
    ['02', 'Preserve what matters', 'Extraction and filtration stay minimal so the honey keeps its natural aroma, texture, and character.'],
    ['03', 'Pack with care', 'Small batches are packed cleanly, labelled clearly, and sent out only after quality checks.']
  ];

  const faqs = [
    {
      q: 'What makes HOMMED honey different?',
      a: 'HOMMED focuses on natural sourcing, minimal handling, and batch-level quality checks instead of creating a uniform processed taste.'
    },
    {
      q: 'Why can pure honey crystallize?',
      a: 'Crystallization is natural. It can happen when raw honey contains real floral sugars and pollen traces. Warm water can gently return it to liquid form.'
    },
    {
      q: 'Do you work directly with beekeepers?',
      a: 'Yes. Our sourcing approach is built around long-term relationships with responsible apiaries and harvesters.'
    }
  ];

  return (
    <div className="about-page-container refined-page about-refined">
      <section className="refined-hero about-refined-hero" aria-label="About HOMMED">
        <div className="refined-hero-copy">
          <span className="refined-kicker">About HOMMED</span>
          <h1>Pure honey, handled with patience.</h1>
          <p>
            We make everyday wellness feel closer to nature by sourcing honest honey and protecting the flavour,
            texture, and character that already exist inside the hive.
          </p>
          <div className="refined-hero-actions">
            <Link className="refined-btn refined-btn-primary" to="/shop">Explore Products</Link>
            <Link className="refined-btn refined-btn-secondary" to="/contact">Talk to Us</Link>
          </div>
        </div>
        <div className="refined-hero-media">
          <img src={getImageUrl('honey in tree.png')} alt="Natural honeycomb hanging from a tree" />
          <div className="refined-media-note">
            <span>100%</span>
            <p>Focused on purity, traceability, and thoughtful handling.</p>
          </div>
        </div>
      </section>

      <section className="refined-band about-belief" aria-label="Our belief">
        <div className="refined-section-heading">
          <span className="refined-kicker">Our Belief</span>
          <h2>Nature does not need to be overworked.</h2>
        </div>
        <p>
          Good honey begins with healthy bees, diverse flowers, and careful timing. Our role is simple:
          choose well, interfere less, and make the journey from hive to home transparent.
        </p>
      </section>

      <section className="refined-section about-principles" aria-label="Brand principles">
        <div className="refined-section-heading">
          <span className="refined-kicker">How We Work</span>
          <h2>Three standards guide every jar.</h2>
        </div>
        <div className="refined-card-grid refined-three">
          {principles.map((item) => (
            <article className="refined-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-process-panel" aria-label="Hive to jar process">
        <div className="about-process-image">
          <img src={getImageUrl('honey items .png')} alt="Honey bowl with natural ingredients" />
        </div>
        <div className="about-process-copy">
          <span className="refined-kicker">Hive to Jar</span>
          <h2>A calmer process for a cleaner result.</h2>
          <div className="about-process-list">
            {processSteps.map(([num, title, desc]) => (
              <article key={num}>
                <span>{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-proof-strip" aria-label="HOMMED quality highlights">
        <div>
          <strong>Small batch</strong>
          <span>Handled with attention</span>
        </div>
        <div>
          <strong>No dilution</strong>
          <span>Nothing added to stretch flavour</span>
        </div>
        <div>
          <strong>Trusted sources</strong>
          <span>Relationships built over time</span>
        </div>
        <div>
          <strong>Everyday quality</strong>
          <span>Made for daily use</span>
        </div>
      </section>

      <section className="refined-section about-faq-refined" aria-label="About questions">
        <div className="refined-section-heading">
          <span className="refined-kicker">Questions</span>
          <h2>What people ask before choosing HOMMED.</h2>
        </div>
        <div className="refined-faq-list">
          {faqs.map((faq, index) => (
            <article className={`refined-faq-item ${activeFaq === index ? 'is-open' : ''}`} key={faq.q}>
              <button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span>{faq.q}</span>
                <i>{activeFaq === index ? '-' : '+'}</i>
              </button>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
