import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const statesData = [
  { id: 1, name: "Rajasthan", capital: "Jaipur", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Maharashtra", capital: "Mumbai", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Uttar Pradesh", capital: "Lucknow", img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Tamil Nadu", capital: "Chennai", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Uttarakhand", capital: "Dehradun", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800" },
  { id: 6, name: "Kerala", capital: "Thiruvananthapuram", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
  { id: 7, name: "West Bengal", capital: "Kolkata", img: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=800" }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay"></div>
      
      <div className="dashboard-content-layer">
        <header className="dashboard-header">
          <h1>Discover India</h1>
          <p>Select a state to explore its heritage, culture, and magnificent spots</p>
        </header>

        <div className="monument-grid">
          {statesData.map(st => (
            <div key={st.id} className="monument-card" onClick={() => navigate(`/state/${st.name.toLowerCase()}`)}>
              <img src={st.img} alt={st.name} className="monument-img" />
              <div className="monument-info">
                <h3>{st.name}</h3>
                <p>Capital: {st.capital}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
