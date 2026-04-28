import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuideDashboard.css';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const profileData = JSON.parse(localStorage.getItem('currentUser')) || {};
  const guideName = profileData.username || 'Meera Reddy'; // Default mapped for testing Admin assigns
  const user = profileData;

  const [activeTab, setActiveTab] = useState('application');

  const [tripsDB, setTripsDB] = useState([]);

  useEffect(() => {
    const fetchAssignedTrips = async () => {
      try {
        if (!user || (!user.id && !user.email)) return;
        let guideId = user.id;

        // Auto-heal missing ID
        if (!guideId) {
           const usersResp = await axios.get("http://localhost:8080/api/auth/users");
           const found = usersResp.data.find(u => u.email === user.email);
           if (found) guideId = found.id;
        }

        if (guideId) {
          const res = await axios.get(`http://localhost:8080/api/trips/guide/${guideId}`);
          
          // Fetch chats for each assigned trip
          const tripsWithChats = await Promise.all(res.data.map(async (trip) => {
             if(trip.status === 'ASSIGNED') {
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
          
          setTripsDB(tripsWithChats);
        }
      } catch (err) {
        console.error("Failed to fetch assigned trips from database", err);
      }
    };

    if (activeTab === 'operations') {
      fetchAssignedTrips();
    }
  }, [user?.id, user?.email, activeTab]);

  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const fetchAppStatus = async () => {
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
                 const mappedStatus = latestApp.status === 'APPROVED' ? 'Approved' : (latestApp.status === 'REJECTED' ? 'Rejected' : 'Pending');
                 setApplicationStatus({ ...latestApp, status: mappedStatus });
                 if (mappedStatus === 'Approved') {
                     setActiveTab('operations');
                 }
             }
          } catch(e) {
             console.error("Error fetching application status in Guide Dashboard:", e);
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
        description: guideForm.description
      };

      await axios.post('http://localhost:8080/api/guide-applications/apply', appPayload, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
         }
      });

      setApplicationStatus({ ...appPayload, status: 'Pending' });
      alert('Application submitted successfully! Admins can now approve you from the Admin Dashboard.');
      setGuideForm({ ...guideForm, languages: '', experience: '', description: '' });
    } catch (err) {
      console.error(err);
      alert('Error submitting application from GuideDashboard.');
    }
  };

  const handleSendMessage = async (tripId, targetName) => {
    const msg = prompt(`Type your message to your client, ${targetName}:`);
    if (!msg) return;
    
    try {
      // Frontend-only mock storage
      const chatDb = JSON.parse(localStorage.getItem('mockChats')) || {};
      const tripHistory = chatDb[tripId] || [];
      const newMsg = { sender: guideName, text: msg, time: new Date().toLocaleTimeString() };
      chatDb[tripId] = [...tripHistory, newMsg];
      localStorage.setItem('mockChats', JSON.stringify(chatDb));
      
      const newTrips = tripsDB.map(t => {
        if (t.id === tripId) {
          const history = t.messages || [];
          return { ...t, messages: [...history, { sender: guideName, text: msg, time: new Date().toLocaleTimeString() }] };
        }
        return t;
      });
      setTripsDB(newTrips);
    } catch(e) {
       alert("Error sending message to backend!");
    }
  };

  const handleCompleteTrip = async (tripId) => {
    const confirmDone = window.confirm("Are you sure you want to officially mark this tour as Completed? This will permanently close the trip queue.");
    if (confirmDone) {
      try {
        await axios.put(`http://localhost:8080/api/trips/${tripId}/complete`);
        const newTrips = tripsDB.map(t => t.id === tripId ? { ...t, status: 'COMPLETED' } : t);
        setTripsDB(newTrips);
        alert('Trip marked as successfully Completed!');
      } catch (e) {
        console.error("Error completing trip:", e);
        alert("Failed to complete trip. Did you add the /complete route to your backend?");
      }
    }
  };

  const activeAssignments = tripsDB.filter(t => t.status === 'ASSIGNED');

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1>Tour Guide Operations Hub</h1>
        <p>Manage your assigned travelers, chat instantly, and process trips.</p>
        <p style={{background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '5px 15px', borderRadius: '15px', fontSize: '0.9rem', color: '#ccc'}}>Currently securely logged in as Server ID: <strong>{user?.id}</strong> | {user?.email}</p>

        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
             className={`action-btn ${activeTab === 'application' ? 'active-tab' : ''}`} 
             onClick={() => setActiveTab('application')} 
             style={{ padding: '10px 20px', background: activeTab === 'application' ? '#fca311' : 'transparent', color: activeTab === 'application' ? '#000' : '#fca311', border: '2px solid #fca311' }}
          >📝 My Application</button>
          
          <button 
             className={`action-btn ${activeTab === 'operations' ? 'active-tab' : ''}`} 
             onClick={() => setActiveTab('operations')} 
             disabled={applicationStatus?.status !== 'Approved'} 
             style={{ padding: '10px 20px', background: activeTab === 'operations' ? '#0dcaf0' : 'transparent', color: activeTab === 'operations' ? '#000' : '#ccc', border: '2px solid' + (applicationStatus?.status === 'Approved' ? ' #0dcaf0' : ' #555'), cursor: applicationStatus?.status !== 'Approved' ? 'not-allowed' : 'pointer' }}
          >🛠️ Tour Operations</button>
        </div>
      </div>

      <div className="guide-content" style={{marginTop: '30px'}}>
        
        {activeTab === 'application' && (
           <div className="details-card" style={{maxWidth: '800px', margin: '0 auto', padding: '30px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px'}}>
              {applicationStatus ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  {applicationStatus.status === 'Approved' ? (
                    <>
                      <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎉</div>
                      <h2 style={{ color: '#28a745', marginBottom: '10px' }}>Application Approved!</h2>
                      <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: '1.5' }}>
                        Congratulations! You are now an approved Tour Guide.<br /><br />
                        You now have full access to the <strong>Tour Operations</strong> tab above!
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '4rem', marginBottom: '15px' }}>⏳</div>
                      <h2 style={{ color: '#fca311', marginBottom: '10px' }}>Application Submitted</h2>
                      <p style={{ color: '#ccc', fontSize: '1.05rem' }}>Your application is currently under review by our Admin team.</p>
                      <p style={{ color: '#888', marginTop: '10px' }}>We will evaluate your profile and contact you soon.</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <h2 style={{marginBottom: '10px', color: '#fca311'}}>Apply for Approval</h2>
                  <p style={{ marginBottom: '20px', color: '#ccc' }}>You have signed up as a Tour Guide, but you need to be verified by the Admin before accessing operations. Submit your details below.</p>
                  <form className="profile-form" onSubmit={handleApplyGuide}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                      <input type="text" name="name" value={guideForm.name} onChange={handleGuideChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                      <input type="email" name="email" value={guideForm.email} onChange={handleGuideChange} required readOnly style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.3)', color: '#aaa' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Languages Spoken</label>
                      <input type="text" name="languages" placeholder="e.g. English, Hindi, Marathi" value={guideForm.languages} onChange={handleGuideChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Years of Experience</label>
                      <input type="text" name="experience" placeholder="e.g. 5 Years" value={guideForm.experience} onChange={handleGuideChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Why do you want to be a guide?</label>
                      <textarea name="description" rows="4" value={guideForm.description} onChange={handleGuideChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}></textarea>
                    </div>
                    <button type="submit" className="action-btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>Submit Profile for Approval</button>
                  </form>
                </>
              )}
           </div>
        )}

        {activeTab === 'operations' && (
          <div className="animate-fade">
            <h2 style={{borderBottom: '2px solid #0dcaf0', paddingBottom: '10px', marginBottom: '20px'}}>Active User Assignments <span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>(For Guide ID: {user?.id})</span></h2>
            
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
                      <h3>{trip.user?.username || trip.userName || 'Client'}</h3>
                      {trip.state && <span className="trip-state-badge">TRIP TO {trip.state.toUpperCase()}</span>}
                    </div>
                    
                    <div className="guide-card-details">
                      <p><strong>Client Email:</strong> <span>{trip.user?.email || trip.email}</span></p>
                      <p><strong>Tour Dates:</strong> <span>{trip.startDate} to {trip.endDate}</span></p>
                      <p><strong>Group Size:</strong> <span>{trip.numPeople} People</span></p>
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
                      }) : <p style={{color: '#444', fontSize: '0.85rem', textAlign: 'center', marginTop: '30px'}}>Direct messaging is offline. Please email the client at {trip.email}.</p>}
                    </div>
                    
                    <div className="guide-actions">
                      <button className="guide-btn-chat" onClick={() => handleSendMessage(trip.id, trip.user?.username || trip.userName)}>💬 Chat Server</button>
                      <button className="guide-btn-complete" onClick={() => handleCompleteTrip(trip.id)}>✓ Mark Completed</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;
