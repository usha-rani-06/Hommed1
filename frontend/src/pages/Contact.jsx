import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const Contact = () => {
  const { getImageUrl } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) nextErrors.message = 'Message is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  const contactCards = [
    ['Orders', 'For delivery, returns, and payment help.', 'support@Hommed.com'],
    ['Partnerships', 'For retail, gifting, and bulk enquiries.', 'partners@Hommed.com'],
    ['General', 'For product questions and brand notes.', 'info@Hommed.com']
  ];

  const contactFaqs = [
    {
      q: 'How quickly does the team respond?',
      a: 'Most messages are reviewed within one business day. Order-related messages are prioritised during working hours.'
    },
    {
      q: 'Can I request a bulk or gifting quote?',
      a: 'Yes. Share the quantity, delivery city, timeline, and any packaging request so the team can respond with the right options.'
    },
    {
      q: 'Where do I ask about ingredients or sourcing?',
      a: 'Use the form or email info@Hommed.com. Mention the product name or batch details if you have them.'
    }
  ];

  return (
    <div className="contact-page-container refined-page contact-refined">
      <section className="refined-hero contact-refined-hero" aria-label="Contact HOMMED">
        <div className="refined-hero-copy">
          <span className="refined-kicker">Contact</span>
          <h1>We are here for orders, sourcing, and simple questions.</h1>
          <p>
            Reach the HOMMED team for support, collaborations, gifting, or product guidance. Clear answers,
            thoughtful replies, and no complicated maze.
          </p>
        </div>
        <div className="contact-hero-card">
          <img src={getImageUrl('homepage honey.png')} alt="HOMMED honey jar" />
          <div>
            <span>Support hours</span>
            <strong>Mon to Sat</strong>
            <p>9:00 AM to 6:00 PM IST</p>
          </div>
        </div>
      </section>

      <section className="contact-desk" aria-label="Contact desk">
        <div className="contact-routing">
          <div className="refined-section-heading">
            <span className="refined-kicker">Start Here</span>
            <h2>Choose the quickest route.</h2>
          </div>
          <div className="contact-route-list">
            {contactCards.map(([title, desc, email]) => (
              <a className="contact-route-card" href={`mailto:${email}`} key={title}>
                <span>{title}</span>
                <p>{desc}</p>
                <strong>{email}</strong>
              </a>
            ))}
          </div>
          <div className="contact-address-panel">
            <span className="refined-kicker">Headquarters</span>
            <p>12, Honeycomb Estate, Sector 5, HSR Layout, Bengaluru, Karnataka - 560102</p>
            <a href="tel:+911234567890">+91 1234567890</a>
          </div>
        </div>

        <form className="contact-refined-form" onSubmit={handleSubmit} noValidate>
          <div>
            <span className="refined-kicker">Message Us</span>
            <h2>Send a note to the right team.</h2>
          </div>

          <div className="contact-form-row">
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </label>
            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </label>
          </div>

          <label>
            Subject
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="How can we help?"
              className={errors.subject ? 'input-error' : ''}
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your message here"
              className={errors.message ? 'input-error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </label>

          <button type="submit" className="refined-btn refined-btn-primary">Send Message</button>
        </form>
      </section>

      <section className="contact-social-refined" aria-label="Social channels">
        <div className="refined-section-heading">
          <span className="refined-kicker">Community</span>
          <h2>Follow the hive notes.</h2>
        </div>
        <div className="contact-social-row">
          <a href="#">Instagram <span>@HommedPure</span></a>
          <a href="#">Facebook <span>/HommedHoney</span></a>
          <a href="#">LinkedIn <span>HOMMED Wellness</span></a>
        </div>
      </section>

      <section className="refined-section contact-faq-refined" aria-label="Contact questions">
        <div className="refined-faq-list">
          {contactFaqs.map((faq, index) => (
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

      {isSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal-card">
            <span className="success-modal-check">OK</span>
            <h2>Message Sent Successfully</h2>
            <p>Thank you for reaching out to HOMMED. Our support team will review your message and respond soon.</p>
            <button onClick={() => setIsSuccess(false)} className="success-modal-close-btn" type="button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
