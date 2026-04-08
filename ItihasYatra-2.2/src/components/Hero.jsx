import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import bg1 from '../assets/india_heritage_1.png';
import bg2 from '../assets/india_culture_2.png';
import bg3 from '../assets/india_landscape_3.png';

const images = [bg1, bg2, bg3];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="hero-section">
      {images.map((img, index) => (
        <div 
          key={index} 
          className={`hero-bg ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <h1 className="hero-title">ItihasYatra</h1>
        <p className="hero-subtitle">Journey through India's rich heritage</p>
        <button className="explore-btn" onClick={() => navigate('/auth')}>
          Start Exploring
        </button>
      </div>

      <a href="#about" className="scroll-indicator">
        <div className="mouse"></div>
        <span>Scroll Down</span>
      </a>
    </section>
  );
};

export default Hero;
