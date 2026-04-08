import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VirtualTour.css';

const VirtualTour = () => {
  const { tourName } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="vr-container">
      <div className="vr-header">
        <button className="exit-vr-btn" onClick={() => navigate(-1)}>✕ Exit VR Module</button>
        <h2>{decodeURIComponent(tourName)}</h2>
        <div className="vr-status">🔴 LIVE 360°</div>
      </div>

      <div className="vr-viewport">
        {/* We use a wide panoramic image and animate its background position to simulate 360 viewing */}
        <div className={`vr-world ${isPlaying ? 'auto-pan' : ''}`}></div>

        {/* VR HUD Overlays for realistic effect */}
        <div className="vr-crosshair">+</div>
        <div className="vr-compass">N 045°</div>
        
        <div className="vr-controls">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸ Pause' : '▶ Auto-Pan'}
          </button>
          <button onClick={() => alert("Zooming In...")}>🔍 Zoom</button>
          <button onClick={() => alert("Please connect your VR Headset via Bluetooth.")}>🥽 Headset Mode</button>
        </div>
      </div>
      
      <div className="vr-instructions">
        <p>Interactive 360° Mock Environment. Use Auto-Pan to explore the heritage site.</p>
      </div>
    </div>
  );
};

export default VirtualTour;
