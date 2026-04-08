import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  
  // High fidelity state mocking
  const statesData = [
    { name: "Rajasthan", capital: "Jaipur", special: "Land of Kings and Forts", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" },
    { name: "Maharashtra", capital: "Mumbai", special: "Heart of the Maratha Empire", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800" },
    { name: "Uttar Pradesh", capital: "Lucknow", special: "Cradle of Indian Civilization", img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800" },
    { name: "Tamil Nadu", capital: "Chennai", special: "Home of Dravidian Temples", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800" },
    { name: "Uttarakhand", capital: "Dehradun", special: "The Land of Gods (Devbhumi)", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800" },
    { name: "Kerala", capital: "Thiruvananthapuram", special: "God's Own Country", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
    { name: "West Bengal", capital: "Kolkata", special: "Cultural Capital of India", img: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay"></div>
      
      <div className="dashboard-content-layer">
        <header className="dashboard-header" style={{borderBottom: '2px dashed #fca311', paddingBottom: '20px'}}>
          <h1 style={{color: '#fca311'}}>Creator Studio Dashboard</h1>
          <p>Select a region to directly access its Content Edit Terminal.</p>
          <button onClick={() => { alert('Creator Logged out safely.'); navigate('/'); }} style={{marginTop: '15px', background: 'transparent', border: '1px solid #dc3545', color: '#dc3545', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', position: 'relative', zIndex: 10}}>Exit Studio Portal</button>
        </header>

        <div className="monument-grid">
          {statesData.map((state, index) => (
            <div 
              key={index} 
              className="monument-card"
              onClick={() => navigate(`/creator/state/${state.name.toLowerCase()}`)}
              style={{border: '1px solid #fca311'}}
            >
              <img src={state.img} alt={state.name} className="monument-img" />
              <div className="monument-info">
                <h3>{state.name}</h3>
                <p>Capital: {state.capital}</p>
                <div style={{marginTop: '15px', color: '#fca311', fontWeight: 'bold', borderTop: '1px dashed rgba(252,163,17,0.3)', paddingTop: '15px'}}>🖍️ Enter Edit Terminal &rarr;</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CreatorDashboard;
