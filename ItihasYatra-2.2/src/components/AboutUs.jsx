import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">About ItihasYatra</h2>
        <div className="about-content">
          <p className="about-text">
            <strong>ItihasYatra</strong> is an interactive platform designed to inspire awareness of Indian culture, heritage, historical places, and famous monuments. Our mission is to take you on an enchanting journey through time.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏛️</div>
              <h3>Historical Sites</h3>
              <p>Discover detailed information about ancient temples, majestic forts, and intricate palaces seamlessly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Virtual Tours</h3>
              <p>Experience breathtaking virtual tours guided by experts, bringing heritage right to your screen.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Cultural Discussions</h3>
              <p>Engage with fellow cultural enthusiasts and share insights about India's vibrant traditions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
