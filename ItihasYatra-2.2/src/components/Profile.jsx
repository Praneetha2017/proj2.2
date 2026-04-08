import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
      return {
        name: savedUser.username || savedUser.email.split('@')[0],
        email: savedUser.email,
        role: savedUser.role || 'Cultural Enthusiast',
        status: savedUser.status || 'Approved'
      };
    }
    return {
      name: 'Guest User',
      email: 'guest@itihasyatra.com',
      role: 'Cultural Enthusiast'
    };
  });
  const [guideApplicationStatus, setGuideApplicationStatus] = useState(() => {
    const apps = JSON.parse(localStorage.getItem('mockGuideApplicationsDB')) || {};
    return apps[profileData.email] || null;
  });
  const [guideProofFile, setGuideProofFile] = useState(null);
  const [guideProofName, setGuideProofName] = useState('');
  const [guideLang, setGuideLang] = useState('');
  const [guideExp, setGuideExp] = useState('');
  const [guideDesc, setGuideDesc] = useState('');

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  };

  // Pull Universal Trips Database
  const [tripsDB, setTripsDBState] = useState(() => {
    return JSON.parse(localStorage.getItem('mockTripsDB')) || [];
  });

  const setTripsDB = (newTrips) => {
    setTripsDBState(newTrips);
    localStorage.setItem('mockTripsDB', JSON.stringify(newTrips));
  };

  const handleSendMessage = (tripId, targetName) => {
    const msg = prompt(`Type your message to ${targetName}:`);
    if (!msg) return;
    const newTrips = tripsDB.map(t => {
      if (t.id === tripId) {
        const history = t.messages || [];
        return { ...t, messages: [...history, { sender: profileData.name, text: msg, time: new Date().toLocaleTimeString() }] };
      }
      return t;
    });
    setTripsDB(newTrips);
  };

  const handleSave = () => {
    setIsEditing(false);
    
    // Save locally to simulate backend sync
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const updatedUser = { ...currentUser, email: profileData.email, role: profileData.role, username: profileData.name, status: profileData.status || currentUser.status || 'Approved' };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Sync global mock database memory
    if (currentUser.email) {
       const usersDB = JSON.parse(localStorage.getItem('mockUsersDB')) || {};
       if (usersDB[currentUser.email]) {
         usersDB[profileData.email] = { ...usersDB[currentUser.email], ...updatedUser };
         if (profileData.email !== currentUser.email) delete usersDB[currentUser.email];
         localStorage.setItem('mockUsersDB', JSON.stringify(usersDB));
       }
    }

    alert('Profile updated and securely synced to Local Database Memory!');
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <h2>{profileData.role} Profile</h2>
        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>👤 Profile Details</button>
        
        {/* Dynamic Tabs purely based on the user's explicit Role */}
        {(profileData.role === 'Cultural Enthusiast' || profileData.role === 'Guest User' || !profileData.role) && (
          <>
            <button className={activeTab === 'trips' ? 'active' : ''} onClick={() => setActiveTab('trips')}>✈️ My Trips</button>
            <button className={activeTab === 'guide' ? 'active' : ''} onClick={() => setActiveTab('guide')}>🎓 Apply as Guide</button>
          </>
        )}

        {profileData.role === 'Tour Guide' && (
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>📚 Guiding History</button>
        )}

        {profileData.role === 'Admin' && (
          <button className="" onClick={() => navigate('/admin')}>⚙️ Admin Portal &rarr;</button>
        )}

        {profileData.role === 'Content Creator' && (
          <button className="" onClick={() => navigate('/creator')}>🖍️ Creator Studio &rarr;</button>
        )}
        
        <button 
          className="logout-btn" 
          onClick={() => {
            localStorage.removeItem('currentUser'); // Sever the memory session!
            alert('Logged out successfully!');
            navigate('/');
          }}
          style={{marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#ff4757', fontWeight: 'bold'}}
        >
          🚪 Logout
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'details' && (
          <div className="tab-pane animate-fade">
            <h3>Personal Details</h3>
            <div className="details-card">
              {isEditing ? (
                <div className="edit-profile-form">
                  <div style={{marginBottom: '15px'}}>
                    <strong style={{display: 'inline-block', width: '80px', color: '#fff'}}>Name:</strong>
                    <input type="text" name="name" value={profileData.name} onChange={handleChange} 
                      style={{padding: '10px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '250px'}} />
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong style={{display: 'inline-block', width: '80px', color: '#fff'}}>Email:</strong>
                    <input type="email" name="email" value={profileData.email} onChange={handleChange} 
                      style={{padding: '10px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '250px'}} />
                  </div>
                  <div style={{marginBottom: '20px'}}>
                    <strong style={{display: 'inline-block', width: '80px', color: '#fff'}}>Role:</strong>
                    <select name="role" value={profileData.role} onChange={handleChange}
                      style={{padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: '#fff', width: '250px'}}>
                      <option value="Cultural Enthusiast">Cultural Enthusiast</option>
                      <option value="Content Creator">Content Creator</option>
                      <option value="Tour Guide">Tour Guide</option>
                    </select>
                  </div>
                  <button className="edit-btn" onClick={handleSave} style={{background: 'var(--accent-color)', color: '#000', fontWeight: 'bold'}}>Save Profile</button>
                  <button className="edit-btn" onClick={() => setIsEditing(false)} style={{marginLeft: '15px', color: '#aaa', borderColor: '#555', background: 'transparent'}}>Cancel</button>
                </div>
              ) : (
                <>
                  <p><strong>Name:</strong> {profileData.name}</p>
                  <p><strong>Email:</strong> {profileData.email}</p>
                  <p><strong>Role:</strong> {profileData.role}</p>
                  {profileData.status && <p><strong>Status:</strong> {profileData.status}</p>}
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="tab-pane animate-fade">
            <h3>My Trips</h3>
            {tripsDB.filter(t => t.email === profileData.email || t.email === 'priya@example.com').map(trip => (
              <div key={trip.id} className={`trip-card ${trip.status === 'Approved' ? 'completed' : 'planned'}`}>
                <div className="trip-header">
                  <h4>Trip to {trip.state}</h4>
                  <span className={`badge ${trip.status === 'Approved' ? 'completed-badge' : 'planned-badge'}`}>{trip.status}</span>
                </div>
                <p>Dates: {trip.dates} | People: {trip.people}</p>
                
                {trip.assignedGuide ? (
                  <>
                    <hr style={{borderColor: '#444', margin: '15px 0'}}/>
                    <p className="guide-status" style={{color: '#0dcaf0'}}><strong>Guide Assigned:</strong> {trip.assignedGuide.name} (📞 {trip.assignedGuide.phone})</p>
                    
                    <div style={{background: '#111', padding: '15px', borderRadius: '10px', marginTop: '10px', maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      {trip.messages && trip.messages.length > 0 ? trip.messages.map((m, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: m.sender === profileData.name ? 'flex-end' : 'flex-start',
                          marginBottom: '5px'
                        }}>
                          <div style={{
                            maxWidth: '70%',
                            padding: '10px 14px',
                            borderRadius: m.sender === profileData.name ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: m.sender === profileData.name ? '#0dcaf0' : '#25d366',
                            color: m.sender === profileData.name ? '#000' : '#000',
                            wordWrap: 'break-word'
                          }}>
                            <p style={{margin: 0, fontSize: '0.95rem', fontWeight: '500'}}>{m.text}</p>
                            <p style={{margin: '4px 0 0 0', fontSize: '0.7rem', opacity: 0.7}}>{m.time}</p>
                          </div>
                        </div>
                      )) : <p style={{color: '#666', fontSize: '0.85rem', textAlign: 'center'}}>💬 No messages yet. Start the conversation!</p>}
                    </div>

                    <button className="action-btn" onClick={() => handleSendMessage(trip.id, trip.assignedGuide.name)} style={{marginTop: '15px'}}>Message Guide</button>
                  </>
                ) : (
                  <p style={{color: '#fca311', marginTop: '10px'}}>Pending Guide Assignment from Admin...</p>
                )}
              </div>
            ))}
            {tripsDB.filter(t => t.email === profileData.email || t.email === 'priya@example.com').length === 0 && (
              <p style={{color: '#aaa', fontStyle: 'italic'}}>You have no active trips.</p>
            )}
          </div>
        )}

        {activeTab === 'guide' && (profileData.role === 'Cultural Enthusiast' || !profileData.role) &&  (
          <div className="tab-pane animate-fade">
            <h3>Tour Guide Application</h3>
            
            {guideApplicationStatus?.status === 'Approved' ? (
              <div style={{background: 'rgba(40,167,69,0.2)', border: '2px solid #28a745', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
                <h4 style={{color: '#28a745', margin: '0 0 10px 0'}}>✅ Congratulations! You are an Approved Guide</h4>
                <p style={{color: '#0dcaf0', fontWeight: 'bold'}}>Use this email to sign up on the Guide Portal:</p>
                <div style={{background: '#000', padding: '15px', borderRadius: '8px', marginTop: '10px', border: '1px solid #0dcaf0'}}>
                  <p style={{margin: '0', color: '#0dcaf0', fontSize: '1.1rem'}}>📧 {guideApplicationStatus.approvalEmail}</p>
                </div>
                <p style={{fontSize: '0.9rem', color: '#aaa', marginTop: '10px'}}>Approved on: {new Date(guideApplicationStatus.approvalDate).toLocaleDateString()}</p>
              </div>
            ) : guideApplicationStatus?.status === 'Pending' ? (
              <div style={{background: 'rgba(252,163,17,0.2)', border: '2px solid #fca311', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
                <h4 style={{color: '#fca311', margin: '0'}}>⏳ Your Application is Pending Admin Review</h4>
                <p style={{color: '#aaa', fontSize: '0.9rem', marginTop: '10px'}}>Submitted on: {new Date(guideApplicationStatus.appliedAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <>
                <p className="guide-desc">Apply to become an official ItihasYatra guide. Submit your proof and details for Admin verification.</p>
                <form className="guide-form" onSubmit={async (e) => {
                  e.preventDefault();
                  if (!guideProofFile) {
                    alert('Please upload Aadhar proof!');
                    return;
                  }
                  if (!guideLang || !guideExp || !guideDesc) {
                    alert('Please complete all guide application fields.');
                    return;
                  }

                  let proofData = '';
                  try {
                    proofData = await readFileAsDataURL(guideProofFile);
                  } catch (err) {
                    console.error(err);
                    alert('Unable to read proof file. Please try again with a different file.');
                    return;
                  }

                  const apps = JSON.parse(localStorage.getItem('mockGuideApplicationsDB')) || {};
                  apps[profileData.email] = {
                    email: profileData.email,
                    name: profileData.name,
                    languages: guideLang,
                    experience: guideExp,
                    description: guideDesc,
                    proofName: guideProofName || guideProofFile.name,
                    proofData,
                    status: 'Pending',
                    appliedAt: new Date().toISOString()
                  };
                  localStorage.setItem('mockGuideApplicationsDB', JSON.stringify(apps));
                  setGuideApplicationStatus(apps[profileData.email]);
                  alert('Application submitted successfully! Admin will review and send approval email.');
                }}>
                  <textarea rows="4" placeholder="Briefly describe your knowledge of Indian heritage and history..." value={guideDesc} onChange={(e) => setGuideDesc(e.target.value)} required></textarea>
                  <input type="text" placeholder="Languages known (e.g. English, Hindi, Tamil)" value={guideLang} onChange={(e) => setGuideLang(e.target.value)} required />
                  <input type="number" placeholder="Years of experience" value={guideExp} onChange={(e) => setGuideExp(e.target.value)} required />
                  
                  <div style={{marginTop: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(13,202,240,0.1)', border: '1px dashed #0dcaf0', borderRadius: '8px'}}>
                    <label style={{display: 'block', color: '#0dcaf0', fontWeight: 'bold', marginBottom: '10px'}}>📄 Upload Aadhar/ID Proof (REQUIRED)</label>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setGuideProofFile(file);
                        setGuideProofName(file?.name || '');
                      }} 
                      required
                      style={{color: '#aaa', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '5px', width: '100%'}}
                    />
                    <p style={{fontSize: '0.8rem', color: '#888', marginTop: '5px'}}>Accepted: PDF, JPG, PNG</p>
                  </div>
                  
                  <button type="submit" className="submit-app-btn">Submit Application for Review</button>
                </form>
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && profileData.role === 'Tour Guide' && (
          <div className="tab-pane animate-fade">
            <h3>Completed Tour History</h3>
            {tripsDB.filter(t => t.assignedGuide && (t.assignedGuide.name === profileData.name || t.assignedGuide.name === 'Meera Reddy') && t.status === 'Completed').map(trip => (
              <div key={trip.id} className="trip-card completed">
                <div className="trip-header">
                  <h4>Guided: Trip to {trip.state}</h4>
                  <span className="badge" style={{background: '#28a745'}}>Completed ✓</span>
                </div>
                <p><strong>Client:</strong> {trip.user} ({trip.email})</p>
                <p><strong>Dates:</strong> {trip.dates} | <strong>Group:</strong> {trip.people} People</p>
                
                <hr style={{borderColor: '#444', margin: '15px 0'}}/>
                <button className="action-btn outline" onClick={() => alert("Review requested from client!")} style={{marginTop: '10px'}}>Request Review from Client</button>
              </div>
            ))}
            {tripsDB.filter(t => t.assignedGuide && (t.assignedGuide.name === profileData.name || t.assignedGuide.name === 'Meera Reddy') && t.status === 'Completed').length === 0 && (
              <p style={{color: '#aaa', fontStyle: 'italic'}}>You have no previously recorded completed trips.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
