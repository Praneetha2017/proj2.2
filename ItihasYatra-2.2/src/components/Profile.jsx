import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : {};
  });

  const [trips, setTrips] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const fetchAppStatus = async () => {
      if (user?.id || user?.email) {
          // If we don't have ID, maybe wait or try to use email, but the backend requires userId.
          // Let's rely on the auto-heal later or fetch with the healed ID.
      }
      let currentId = user?.id;
      if (!currentId && user?.email) {
          try {
            const usersResp = await axios.get(`http://localhost:8080/api/auth/users`);
            const dbUser = usersResp.data.find(u => u.email === user.email);
            if (dbUser) currentId = dbUser.id;
          } catch(e) {}
      }
      if (currentId) {
          try {
             const res = await axios.get(`http://localhost:8080/api/guide-applications/user/${currentId}`);
             if (res.data && res.data.length > 0) {
                 const latestApp = res.data[res.data.length - 1];
                 // Map the backend status (PENDING, APPROVED, REJECTED)
                 const mappedStatus = latestApp.status === 'APPROVED' ? 'Approved' : (latestApp.status === 'REJECTED' ? 'Rejected' : 'Pending');
                 setApplicationStatus({ ...latestApp, status: mappedStatus });
             }
          } catch(e) {
             console.error("Error fetching application status:", e);
          }
      }
    };
    fetchAppStatus();
  }, [user?.id, user?.email]);

  const [guideForm, setGuideForm] = useState({
    name: user.username || '',
    email: user.email || '',
    languages: '',
    experience: '',
    description: ''
  });

  const handleGuideChange = (e) => {
    setGuideForm({ ...guideForm, [e.target.name]: e.target.value });
  };

  const handleApplyGuide = async (e) => {
    e.preventDefault();
    try {
      const appPayload = {
        name: guideForm.name,
        email: guideForm.email,
        languages: guideForm.languages,
        experience: guideForm.experience,
        description: guideForm.description,
        proofName: 'id-proof.pdf', // Placeholder
        proofData: null // Assuming backend can accept null temporarily or bytes
      };

      await axios.post('http://localhost:8080/api/guide-applications/apply', appPayload);

      setApplicationStatus({ ...appPayload, status: 'Pending' });

      alert('Application submitted successfully! Admins can now approve you from the Admin Dashboard.');

      setGuideForm({ ...guideForm, languages: '', experience: '', description: '' });
    } catch (err) {
      console.error(err);
      alert('Error submitting application to backend. Check console.');
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      let currentId = user.id;

      // Self-healing function if ID is missing from local storage
      if (!currentId && user.email) {
        try {
          const usersResp = await axios.get(`http://localhost:8080/api/auth/users`);
          const dbUser = usersResp.data.find(u => u.email === user.email);
          if (dbUser) {
            currentId = dbUser.id;
            const updatedUser = { ...user, id: dbUser.id };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        } catch (e) {
          console.error("Could not heal user ID", e);
        }
      }

      if (!currentId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/trips/user/${currentId}`);
        
        const tripsWithChats = await Promise.all(response.data.map(async (trip) => {
           if (trip.status === 'ASSIGNED') {
               try {
                   // Frontend-only chat mock
                   const chatDb = JSON.parse(localStorage.getItem('mockChats')) || {};
                   return { ...trip, messages: chatDb[trip.id] || [] };
               } catch(e) {
                   return { ...trip, messages: [] };
               }
           }
           return { ...trip, messages: [] };
        }));
        
        setTrips(tripsWithChats);
      } catch (error) {
        console.error("Database Fetch Error:", error);
      }
    };

    if (activeTab === 'trips') {
      fetchTrips();
    }
  }, [user.id, user.email, activeTab]);

  const handleSendMessage = async (tripId, targetName) => {
    const msg = prompt(`Type your message to your Guide, ${targetName}:`);
    if (!msg) return;
    
    try {
      // Frontend-only mock storage
      const chatDb = JSON.parse(localStorage.getItem('mockChats')) || {};
      const tripHistory = chatDb[tripId] || [];
      const newMsg = { sender: user.username, text: msg, time: new Date().toLocaleTimeString() };
      chatDb[tripId] = [...tripHistory, newMsg];
      localStorage.setItem('mockChats', JSON.stringify(chatDb));
      
      const newTrips = trips.map(t => {
        if (t.id === tripId) {
          const history = t.messages || [];
          return { ...t, messages: [...history, { sender: user.username, text: msg, time: new Date().toLocaleTimeString() }] };
        }
        return t;
      });
      setTrips(newTrips);
    } catch(e) {
       alert("Error sending message to backend!");
    }
  };



  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h2 className="role-display">{user.role?.replace('_', ' ')}</h2>
          <p className="profile-label">Profile Dashboard</p>
        </div>

        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>👤 Details</button>

        {/* Navigation logic remains common */}
        {user.role === 'CULTURAL_ENTHUSIAST' && (
          <>
            <button className={activeTab === 'trips' ? 'active' : ''} onClick={() => setActiveTab('trips')}>✈️ My Trips</button>
          </>
        )}

        {user.role === 'TOUR_GUIDE' && (
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>📚 History</button>
        )}

        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('jwtToken');
          navigate('/');
        }}>🚪 Logout</button>
      </div>

      <div className="profile-content">
        {activeTab === 'details' && (
          <div className="tab-pane animate-fade">
            <h3>Personal Information</h3>
            <div className="details-card">
              <p><strong>Database ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="tab-pane animate-fade">
            <h3>My Trip Requests (MySQL)</h3>
            <div className="trips-container">
              {trips.length > 0 ? (
                trips.map(trip => (
                  <div key={trip.id} className={`trip-db-card ${trip.status === 'ASSIGNED' ? 'assigned-border' : ''}`}>
                    <div className="trip-db-header">
                      <h4>Destination: {trip.state}</h4>
                      <span className={`status-badge ${trip.status.toLowerCase()}`}>{trip.status}</span>
                    </div>
                    <div className="trip-db-body">
                      <p>🗓️ {trip.startDate} to {trip.endDate}</p>
                      <p>👥 {trip.numPeople} Travelers</p>

                      <hr className="card-divider" />

                      {trip.guideNeeded ? (
                        trip.guide ? (
                          <div className="guide-info-box">
                            <p className="success-text" style={{ fontSize: '1.1rem' }}>✅ <strong>Tour Guide Assigned</strong></p>

                            <div style={{ color: '#ddd', fontSize: '0.95rem', margin: '15px 0', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                              <p style={{ margin: '4px 0' }}>👤 <strong>Name:</strong> {trip.guide.username}</p>
                              <p style={{ margin: '4px 0' }}>📧 <strong>Email:</strong> {trip.guide.email}</p>
                              {trip.guide.languages && <p style={{ margin: '4px 0' }}>🗣️ <strong>Languages:</strong> {trip.guide.languages}</p>}
                              {trip.guide.experience && <p style={{ margin: '4px 0' }}>⭐ <strong>Experience:</strong> {trip.guide.experience}</p>}
                            </div>

                            <div className="chat-portal" style={{ marginTop: '15px' }}>
                              <h5 style={{ margin: '0 0 10px 0' }}>Live Chat with Guide</h5>
                              {trip.messages && trip.messages.length > 0 ? trip.messages.map((m, i) => {
                                const isUser = m.sender === user.username;
                                return (
                                  <div key={i} className={`chat-msg ${isUser ? 'client' : 'guide'}`} style={{ padding: '8px', background: isUser ? 'rgba(0,0,0,0.3)' : 'rgba(252, 163, 17, 0.1)', borderRadius: '5px', marginBottom: '5px', borderLeft: isUser ? '3px solid #ccc' : '3px solid #fca311' }}>
                                    <strong style={{ color: isUser ? '#ccc' : '#fca311' }}>
                                      {m.sender} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{m.time}</span>
                                    </strong>
                                    <p style={{ margin: '5px 0 0 0' }}>{m.text}</p>
                                  </div>
                                );
                              }) : <p style={{color: '#444', fontSize: '0.85rem'}}>No messages yet. Say hello!</p>}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                              <button className="action-btn" onClick={() => handleSendMessage(trip.id, trip.guide.username)} style={{ flex: 1, padding: '12px' }}>💬 Send Message</button>
                              <a href={`mailto:${trip.guide.email}`} className="action-btn" style={{ flex: 1, display: 'inline-block', boxSizing: 'border-box', textAlign: 'center', padding: '12px', textDecoration: 'none', background: '#444', color: '#fff' }}>✉️ Email</a>
                            </div>
                          </div>
                        ) : (
                          <div className="waiting-box">
                            <p className="waiting-text">⏳ Searching for a guide to accept your request...</p>
                          </div>
                        )
                      ) : (
                        <div className="guide-info-box" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <p className="success-text" style={{ color: '#fff' }}>🚶‍♂️ <strong>Self-Guided Trip</strong></p>
                          <p>You did not request a tour guide.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No trip requests found for ID: {user.id}</p>
                  <button onClick={() => navigate('/plan-trip')} className="action-btn">Plan a Trip Now</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guide Tab functionality has been moved to the Tour Guide Dashboard */}
      </div>
    </div>
  );
};

export default Profile;