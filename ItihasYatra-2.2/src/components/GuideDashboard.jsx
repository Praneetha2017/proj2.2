import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideDashboard.css';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const profileData = JSON.parse(localStorage.getItem('currentUser')) || {};
  const guideName = profileData.username || 'Meera Reddy'; // Default mapped for testing Admin assigns

  const [tripsDB, setTripsDBState] = useState(() => {
    return JSON.parse(localStorage.getItem('mockTripsDB')) || [];
  });

  const setTripsDB = (newTrips) => {
    setTripsDBState(newTrips);
    localStorage.setItem('mockTripsDB', JSON.stringify(newTrips));
  };

  const handleSendMessage = (tripId, targetName) => {
    const msg = prompt(`Type your message to your client, ${targetName}:`);
    if (!msg) return;
    const newTrips = tripsDB.map(t => {
      if (t.id === tripId) {
        const history = t.messages || [];
        return { ...t, messages: [...history, { sender: guideName, text: msg, time: new Date().toLocaleTimeString() }] };
      }
      return t;
    });
    setTripsDB(newTrips);
  };

  const handleCompleteTrip = (tripId) => {
    const confirmDone = window.confirm("Are you sure you want to officially mark this tour as Completed?");
    if (confirmDone) {
      const newTrips = tripsDB.map(t => t.id === tripId ? { ...t, status: 'Completed' } : t);
      setTripsDB(newTrips);
      alert('Trip marked as successfully Completed! It has been moved to your Guiding History.');
    }
  };

  const activeAssignments = tripsDB.filter(t => t.assignedGuide && (t.assignedGuide.name === guideName || t.assignedGuide.name === "Meera Reddy") && t.status !== 'Completed');

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1>Tour Guide Operations Hub</h1>
        <p>Manage your assigned travelers, chat instantly, and process trips.</p>
      </div>

      <div className="guide-content">
        <h2>Active User Assignments</h2>
        
        {activeAssignments.length === 0 ? (
          <div className="empty-state">
            <h3>You have no pending assignments right now.</h3>
            <p>Check back once the Admin has processed new bookings!</p>
          </div>
        ) : (
          <div className="guide-card-grid">
            {activeAssignments.map(trip => (
              <div key={trip.id} className="guide-card">
                <div className="guide-card-header">
                  <h3>{trip.user}</h3>
                  <span className="trip-state-badge">TRIP TO {trip.state.toUpperCase()}</span>
                </div>
                
                <div className="guide-card-details">
                  <p><strong>Client Email:</strong> <span>{trip.email}</span></p>
                  <p><strong>Tour Dates:</strong> <span>{trip.dates}</span></p>
                  <p><strong>Group Size:</strong> <span>{trip.people} People</span></p>
                </div>
                
                <div className="chat-portal">
                  <h5>Live Communication Portal</h5>
                  {trip.messages && trip.messages.length > 0 ? trip.messages.map((m, i) => {
                    const isGuide = m.sender === guideName;
                    return (
                      <div key={i} className={`chat-msg ${isGuide ? 'guide' : 'client'}`}>
                        <strong className={`chat-sender ${isGuide ? 'guide' : 'client'}`}>
                          {m.sender} <span className="chat-time">{m.time}</span>
                        </strong> 
                        {m.text}
                      </div>
                    );
                  }) : <p style={{color: '#444', fontSize: '0.85rem', textAlign: 'center', marginTop: '30px'}}>No messages yet. Send a greeting!</p>}
                </div>
                
                <div className="guide-actions">
                  <button className="guide-btn-chat" onClick={() => handleSendMessage(trip.id, trip.user)}>💬 Chat Server</button>
                  <button className="guide-btn-complete" onClick={() => handleCompleteTrip(trip.id)}>✓ Mark Completed</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;
