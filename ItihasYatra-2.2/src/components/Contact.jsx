import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-subtitle">Have questions or want to contribute? Reach out to us.</p>
        
        <div className="contact-box">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
          
          <div className="contact-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <p>New Delhi, India</p>
            </div>
            <div className="info-item">
              <span className="info-icon">📧</span>
              <p>hello@itihasyatra.in</p>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
