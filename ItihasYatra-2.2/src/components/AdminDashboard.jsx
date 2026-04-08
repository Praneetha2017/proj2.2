import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guides');
  const [selectedStateForContent, setSelectedStateForContent] = useState(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [assigningTripId, setAssigningTripId] = useState(null);
  const [newContentFormData, setNewContentFormData] = useState({
    type: 'Monument', name: '', url: '', description: ''
  });

  const statesList = [
    { name: "Rajasthan", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?h=200" },
    { name: "Maharashtra", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?h=200" },
    { name: "Uttar Pradesh", img: "https://images.unsplash.com/photo-1548013146-72479768bada?h=200" },
    { name: "Tamil Nadu", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?h=200" },
    { name: "Uttarakhand", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?h=200" },
    { name: "Kerala", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?h=200" },
    { name: "West Bengal", img: "https://images.unsplash.com/photo-1558431382-27e303142255?h=200" }
  ];

  // Interactive Admin State Mocks
  const [guides, setGuides] = useState([
    { id: 1, name: "Aarav Patel", phone: "+91 9876543210", languages: "English, Hindi", experience: "2 Years", status: "Pending" },
    { id: 2, name: "Meera Reddy", phone: "+91 8765432109", languages: "English, Telugu, Tamil", experience: "5 Years", status: "Verified" },
    { id: 3, name: "Vikram Singh", phone: "+91 7654321098", languages: "English, Hindi, French", experience: "7 Years", status: "Pending" }
  ]);

  const defaultTrips = [
    { id: 101, user: "Priya Sharma", email: "priya@example.com", state: "Rajasthan", dates: "12 Nov - 16 Nov", people: 4, guideNeeded: true, assignedGuide: null, status: "Pending", messages: [] },
    { id: 102, user: "Rahul Verma", email: "rahul@example.com", state: "Kerala", dates: "01 Dec - 07 Dec", people: 2, guideNeeded: false, assignedGuide: null, status: "Approved", messages: [] }
  ];

  const [tripsState, setTripsState] = useState(() => {
    const saved = localStorage.getItem('mockTripsDB');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('mockTripsDB', JSON.stringify(defaultTrips));
    return defaultTrips;
  });

  const setTrips = (newTrips) => {
    setTripsState(newTrips);
    localStorage.setItem('mockTripsDB', JSON.stringify(newTrips));
  };

  const trips = tripsState;

  const getMockUsers = () => JSON.parse(localStorage.getItem('mockUsersDB')) || {};
  const saveMockUsers = (users) => localStorage.setItem('mockUsersDB', JSON.stringify(users));

  const [guideApplications, setGuideApplications] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mockGuideApplicationsDB')) || {};
    return Object.values(saved);
  });

  const updateGuideApplications = (updatedApps) => {
    const appsByEmail = {};
    updatedApps.forEach(app => {
      appsByEmail[app.email] = app;
    });
    localStorage.setItem('mockGuideApplicationsDB', JSON.stringify(appsByEmail));
    setGuideApplications(updatedApps);
  };

  const [approvalEmailInput, setApprovalEmailInput] = useState({});

  const [applications, setApplications] = useState(() => {
    const saved = getMockUsers();
    return Object.values(saved).filter(u => u.role === 'Content Creator' || u.role === 'Tour Guide');
  });

  const approvedGuideApplications = applications.filter(app => app.role === 'Tour Guide' && app.status === 'Approved').map((app, index) => ({
    id: `app-guide-${index}`,
    name: app.username,
    phone: app.phone || '+91 0000000000',
    languages: app.languages || 'English',
    experience: app.experience || '1 Year',
    status: 'Verified'
  }));

  const approvedGuides = [...guides.filter(g => g.status === 'Verified'), ...approvedGuideApplications];

  const updateApplications = (updatedApps) => {
    setApplications(updatedApps);
    const users = getMockUsers();
    updatedApps.forEach(app => {
      users[app.email] = app;
    });
    saveMockUsers(users);
  };

  const [content, setContent] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mockContentDB'));
    const fallback = [
      { id: 1, type: "Monument", state: "Rajasthan", name: "Amber Fort", status: 'Approved' },
      { id: 2, type: "Virtual Tour", state: "Uttar Pradesh", name: "Taj Mahal VR", status: 'Approved' },
      { id: 3, type: "Cuisine", state: "West Bengal", name: "Rasgulla", status: 'Approved' },
      { id: 4, type: "Art & Craft", state: "Maharashtra", name: "Warli Painting", status: 'Approved' }
    ];
    if (saved) return saved;
    localStorage.setItem('mockContentDB', JSON.stringify(fallback));
    return fallback;
  });

  const setContentData = (newContent) => {
    setContent(newContent);
    localStorage.setItem('mockContentDB', JSON.stringify(newContent));
  };

  // Operational Handlers
  const handleVerifyGuide = (id) => {
    setGuides(guides.map(g => g.id === id ? { ...g, status: 'Verified' } : g));
    alert('Tour Guide Verified successfully! They have been added to the Active Roster.');
  };

  const handleRejectGuide = (id) => {
    setGuides(guides.filter(g => g.id !== id));
    alert('Guide Application Rejected and removed from the queue.');
  };

  const handleConfirmAssignGuide = (tripId, guideObj) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, assignedGuide: guideObj, status: "Approved" } : t));
    setAssigningTripId(null);
    alert(`Successfully assigned ${guideObj.name} to the trip! An automatic confirmation email has been securely routed.`);
  };

  const handleApproveApplication = (email, role) => {
    const updated = applications.map(app => app.email === email ? { ...app, status: 'Approved' } : app);
    updateApplications(updated);
    if (role === 'Tour Guide') {
      setGuides([...guides, {
        id: Date.now(),
        name: updated.find(app => app.email === email)?.username || 'New Guide',
        phone: updated.find(app => app.email === email)?.phone || '+91 0000000000',
        languages: updated.find(app => app.email === email)?.languages || 'English',
        experience: updated.find(app => app.email === email)?.experience || '1 Year',
        status: 'Verified'
      }]);
    }
    alert(`${role} application approved. The user can now login to their portal.`);
  };

  const handleRejectApplication = (email) => {
    const updated = applications.filter(app => app.email !== email);
    const stored = getMockUsers();
    delete stored[email];
    saveMockUsers(stored);
    setApplications(updated);
    alert('Application rejected and removed from the pending queue.');
  };

  const handleApproveGuideApplication = (email) => {
    const approvalEmail = approvalEmailInput[email];
    if (!approvalEmail) {
      alert('Please enter the approval email address to send to the user!');
      return;
    }

    const updated = guideApplications.map(app => 
      app.email === email 
        ? { ...app, status: 'Approved', approvalEmail: approvalEmail, approvalDate: new Date().toISOString() } 
        : app
    );
    updateGuideApplications(updated);
    
    alert(`✅ Guide Application Approved!\n\nApproval email sent to: ${email}\nThey can now create a Guide account using: ${approvalEmail}`);
    setApprovalEmailInput({ ...approvalEmailInput, [email]: '' });
  };

  const handleRejectGuideApplication = (email) => {
    const updated = guideApplications.filter(app => app.email !== email);
    updateGuideApplications(updated);
    alert('Guide application rejected and removed from queue.');
  };

  const handleDeleteContent = (id) => {
    const confirmDelete = window.confirm("SECURITY WARNING: Are you sure you want to permanently delete this content globally from the site?");
    if (confirmDelete) {
      setContentData(content.filter(c => c.id !== id));
    }
  };

  const handleAddContentClick = () => {
    setIsAddingContent(true);
    setNewContentFormData({ type: 'Monument', name: '', url: '', description: '' });
  };

  const handleSaveNewContent = (e) => {
    e.preventDefault();
    if (!newContentFormData.name) return;

    const newId = content.length > 0 ? Math.max(...content.map(c => c.id)) + 1 : 1;
    setContentData([...content, {
      id: newId,
      type: newContentFormData.type,
      state: selectedStateForContent,
      name: newContentFormData.name,
      url: newContentFormData.url,
      description: newContentFormData.description,
      status: 'Approved'
    }]);
    setIsAddingContent(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Portal</h2>
        <button className={activeTab === 'guides' ? 'active' : ''} onClick={() => setActiveTab('guides')}>🛡️ Manage Guides</button>
        <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>📨 Applications</button>
        <button className={activeTab === 'trips' ? 'active' : ''} onClick={() => setActiveTab('trips')}>🗺️ Manage Trips</button>
        <button className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>📝 Manage Content</button>

        <button
          className="logout-btn"
          onClick={() => {
            alert('Admin session terminated securely.');
            navigate('/');
          }}
          style={{ marginTop: 'auto' }}
        >
          🚪 Master Logout
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'guides' && (
          <div className="tab-pane animate-fade">
            <h3>Guide Verification Applications</h3>
            <div className="admin-cards-container">
              {guides.map(g => (
                <div key={g.id} className={`admin-card ${g.status === 'Verified' ? 'verified' : 'pending'}`}>
                  <h4>{g.name} <span className="status-badge">{g.status}</span></h4>
                  <p><strong>Languages:</strong> {g.languages}</p>
                  <p><strong>Experience:</strong> {g.experience}</p>
                  <p><strong>Phone:</strong> {g.phone}</p>

                  {g.status === 'Pending' ? (
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => handleVerifyGuide(g.id)}>Verify & Accept</button>
                      <button className="reject-btn" onClick={() => handleRejectGuide(g.id)}>Reject</button>
                    </div>
                  ) : (
                    <p style={{ marginTop: '15px', color: '#28a745' }}>✅ Active in Roster</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="tab-pane animate-fade">
            <h3>Content Creator & Tour Guide Applications</h3>
            
            {/* Content Creator Applications */}
            <div style={{marginBottom: '40px'}}>
              <h4 style={{color: '#0dcaf0', borderBottom: '2px solid #0dcaf0', paddingBottom: '10px'}}>📝 Content Creator Applications</h4>
              <div className="admin-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {applications.filter(app => app.role === 'Content Creator').length === 0 ? (
                  <div className="admin-card verified" style={{ textAlign: 'center', padding: '40px' }}>
                    <h4>No pending creator applications</h4>
                  </div>
                ) : applications.filter(app => app.role === 'Content Creator').map(app => (
                  <div key={app.email} className={`admin-card ${app.status === 'Approved' ? 'verified' : 'pending'}`}>
                    <h4>{app.username} <span className="status-badge">{app.status}</span></h4>
                    <p><strong>Email:</strong> {app.email}</p>
                    <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                    <div className="action-buttons">
                      {app.status === 'Pending' ? (
                        <>
                          <button className="approve-btn" onClick={() => handleApproveApplication(app.email, app.role)}>Approve</button>
                          <button className="reject-btn" onClick={() => handleRejectApplication(app.email)}>Reject</button>
                        </>
                      ) : (
                        <p style={{ marginTop: '15px', color: '#28a745' }}>✅ Approved</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Guide Applications from Profile */}
            <div>
              <h4 style={{color: '#fca311', borderBottom: '2px solid #fca311', paddingBottom: '10px'}}>👤 Tour Guide Profile Applications (with ID Proof)</h4>
              <div className="admin-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {guideApplications.length === 0 ? (
                  <div className="admin-card verified" style={{ textAlign: 'center', padding: '40px' }}>
                    <h4>No pending guide applications</h4>
                    <p>Users will apply as guides via their Profile tab.</p>
                  </div>
                ) : guideApplications.map(app => (
                  <div key={app.email} className={`admin-card ${app.status === 'Approved' ? 'verified' : 'pending'}`} style={{borderLeft: app.status === 'Approved' ? '5px solid #28a745' : '5px solid #fca311'}}>
                    <h4>{app.name} <span className="status-badge">{app.status}</span></h4>
                    <p><strong>Email:</strong> {app.email}</p>
                    <p><strong>Languages:</strong> {app.languages}</p>
                    <p><strong>Experience:</strong> {app.experience} years</p>
                    <p><strong>About:</strong> {app.description?.substring(0, 100)}...</p>
                    <p><strong>Proof Submitted:</strong> {app.proofName || app.proof || 'aadhar/id'}</p>
                    {app.proofData && (
                      <div style={{marginTop: '10px'}}>
                        <button
                          type="button"
                          onClick={() => window.open(app.proofData, '_blank')}
                          style={{
                            background: 'transparent',
                            border: '1px solid #0dcaf0',
                            color: '#0dcaf0',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '700'
                          }}
                        >
                          Open Proof Document
                        </button>
                      </div>
                    )}
                    <p style={{marginTop: '10px'}}><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    
                    {app.status === 'Pending' ? (
                      <>
                        <div style={{marginTop: '15px', padding: '12px', background: 'rgba(13,202,240,0.1)', borderRadius: '8px', border: '1px solid #0dcaf0'}}>
                          <label style={{display: 'block', color: '#0dcaf0', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem'}}>📧 Approval Email:</label>
                          <input 
                            type="email" 
                            placeholder="e.g., guide.approval@itihasyatra.com"
                            value={approvalEmailInput[app.email] || ''}
                            onChange={(e) => setApprovalEmailInput({...approvalEmailInput, [app.email]: e.target.value})}
                            style={{width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #555', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem'}}
                          />
                        </div>
                        <div className="action-buttons" style={{marginTop: '15px'}}>
                          <button className="approve-btn" onClick={() => handleApproveGuideApplication(app.email)}>Send Approval Email</button>
                          <button className="reject-btn" onClick={() => handleRejectGuideApplication(app.email)}>Reject</button>
                        </div>
                      </>
                    ) : (
                      <div style={{marginTop: '15px', padding: '12px', background: 'rgba(40,167,69,0.1)', borderRadius: '8px', border: '1px solid #28a745'}}>
                        <p style={{margin: 0, color: '#28a745', fontWeight: 'bold'}}>✅ Approved</p>
                        <p style={{margin: '5px 0 0 0', fontSize: '0.85rem', color: '#aaa'}}>Approval Email: <strong>{app.approvalEmail}</strong></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="tab-pane animate-fade">
            <h3>User Trip Requests</h3>
            <div className="admin-cards-container">
              {trips.map(t => (
                <div key={t.id} className={`admin-card ${t.status === 'Approved' ? 'verified' : 'pending'}`}>
                  <h4>Trip to {t.state} <span className="status-badge">{t.status}</span></h4>
                  <p><strong>User:</strong> {t.user} ({t.email})</p>
                  <p><strong>Dates:</strong> {t.dates} | <strong>People:</strong> {t.people}</p>

                  {t.guideNeeded && !t.assignedGuide && (
                    <p style={{ color: '#fca311', fontWeight: 'bold', marginTop: '10px' }}>⚠️ Requires Tour Guide!</p>
                  )}
                  {!t.guideNeeded && (
                    <p style={{ color: '#aaa', marginTop: '10px' }}>No Guide Requested.</p>
                  )}

                  {t.assignedGuide && typeof t.assignedGuide === 'object' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(40,167,69,0.1)', borderLeft: '3px solid #28a745', borderRadius: '5px' }}>
                      <p style={{ color: '#28a745', fontWeight: 'bold', margin: '0 0 5px 0' }}>✅ Assigned Guide: {t.assignedGuide.name}</p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#ccc' }}>📞 {t.assignedGuide.phone} | 🗣️ {t.assignedGuide.languages}</p>
                    </div>
                  )}

                  {/* Fallback for old string-based mock data if any */}
                  {t.assignedGuide && typeof t.assignedGuide === 'string' && (
                    <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '10px' }}>✅ Assigned Guide: {t.assignedGuide}</p>
                  )}

                  {t.status === 'Pending' && t.guideNeeded && assigningTripId !== t.id && (
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => {
                        if (approvedGuides.length === 0) {
                          alert("No verified guides available in active roster. Please verify an application first.");
                        } else {
                          setAssigningTripId(t.id);
                        }
                      }}>Assign Guide</button>
                    </div>
                  )}

                  {assigningTripId === t.id && (
                    <div className="animate-fade" style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', border: '1px solid #0dcaf0' }}>
                      <h5 style={{ color: '#0dcaf0', marginTop: 0, marginBottom: '15px', fontSize: '1.05rem' }}>Select Verified Guide:</h5>
                      <select
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #555', marginBottom: '15px', fontSize: '0.95rem', cursor: 'pointer' }}
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const g = approvedGuides.find(guid => String(guid.id) === e.target.value);
                          if (g) handleConfirmAssignGuide(t.id, g);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>-- Choose a Guide from Roster --</option>
                        {approvedGuides.map(g => (
                          <option key={g.id} value={g.id}>{g.name} (Exp: {g.experience}) - {g.languages}</option>
                        ))}
                      </select>
                      <button className="reject-btn" style={{ width: '100%', padding: '10px' }} onClick={() => setAssigningTripId(null)}>Cancel Assignment</button>
                    </div>
                  )}

                  {t.status === 'Pending' && !t.guideNeeded && (
                    <div className="action-buttons">
                      <button className="approve-btn" onClick={() => {
                        setTrips(trips.map(tr => tr.id === t.id ? { ...tr, status: 'Approved' } : tr));
                        alert('Trip Approved successfully without a guide.');
                      }}>Approve Trip</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="tab-pane animate-fade">
            {!selectedStateForContent ? (
              <>
                <div className="content-header-row">
                  <h3>Select Target State to Manage</h3>
                </div>
                <div className="admin-cards-container">
                  {statesList.map(st => (
                    <div key={st.name} className="admin-card state-admin-card" onClick={() => setSelectedStateForContent(st.name)}>
                      <div className="state-admin-img" style={{ backgroundImage: `url(${st.img})` }}></div>
                      <h4 style={{ marginTop: '20px' }}>{st.name} <span style={{ fontSize: '0.9rem', color: '#0dcaf0', fontWeight: 'bold' }}>Manage &rarr;</span></h4>
                    </div>
                  ))}
                </div>
              </>
            ) : isAddingContent ? (
              <div className="add-content-form animate-fade">
                <div className="content-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="reject-btn" style={{ padding: '8px 20px', border: '1px solid #555', color: '#aaa' }} onClick={() => setIsAddingContent(false)}>← Cancel</button>
                    <h3>Add New {selectedStateForContent} Content</h3>
                  </div>
                </div>

                <form className="admin-form" onSubmit={handleSaveNewContent}>
                  <div className="form-group">
                    <label>Content Category / Type</label>
                    <select value={newContentFormData.type} onChange={e => setNewContentFormData({ ...newContentFormData, type: e.target.value })}>
                      <option value="Monument">Monument</option>
                      <option value="Heritage Site">Heritage Site</option>
                      <option value="Culture">Culture</option>
                      <option value="Virtual Tour">Virtual Tour</option>
                      <option value="Cuisine">Cuisine</option>
                      <option value="Art & Craft">Art & Craft</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Name / Title</label>
                    <input type="text" placeholder="e.g. Hawa Mahal" value={newContentFormData.name} onChange={e => setNewContentFormData({ ...newContentFormData, name: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label>Media URL (Image or Source)</label>
                    <input type="text" placeholder="https://images.unsplash.com/..." value={newContentFormData.url} onChange={e => setNewContentFormData({ ...newContentFormData, url: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Detailed Description</label>
                    <textarea rows="4" placeholder="Write immersive historical or cultural details here..." value={newContentFormData.description} onChange={e => setNewContentFormData({ ...newContentFormData, description: e.target.value })}></textarea>
                  </div>

                  <div className="form-actions" style={{ display: 'flex', gap: '15px' }}>
                    <button type="submit" className="approve-btn" style={{ padding: '15px', fontSize: '1.05rem' }}>💾 Save Content directly to Database</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="content-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="reject-btn" style={{ padding: '8px 20px', border: '1px solid #555', color: '#aaa' }} onClick={() => { setSelectedStateForContent(null); setIsAddingContent(false); }}>← Back to Map</button>
                    <h3>{selectedStateForContent} Database</h3>
                  </div>
                  <button className="add-content-btn" onClick={handleAddContentClick}>+ Add {selectedStateForContent} Content</button>
                </div>

                <h4 style={{ marginTop: '20px', color: '#fca311' }}>Pending Approvals from Creators</h4>
                <button className="plan-btn" onClick={async () => {
                  try {
                    const res = await axios.get("http://localhost:8080/api/admin/content/pending", {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                    alert("Pending Content Fetched: " + res.data.length + " items awaiting approval!");
                    // You can set state here and map over it!
                  } catch (e) { console.error(e); }
                }}>🔄 Refresh Pending Queue</button>

                <table className="content-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.filter(c => c.state === selectedStateForContent).map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td><span className="type-badge">{c.type}</span></td>
                        <td>{c.name}</td>
                        <td><span style={{ color: c.status === 'Approved' ? '#28a745' : '#fca311' }}>{c.status || 'Pending'}</span></td>
                        <td>
                          <button className="approve-btn" style={{ padding: '5px 10px' }} onClick={async () => {
                            try {
                              const updatedContent = content.map(item => item.id === c.id ? { ...item, status: 'Approved' } : item);
                              setContentData(updatedContent);
                              await axios.put(`http://localhost:8080/api/admin/content/${c.id}/approve`, {}, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                              });
                              alert('Successfully Approved & Pushed to Live Website!');
                            } catch (e) {
                              alert('Approval completed locally. Backend not ready.');
                            }
                          }}>Approve</button>
                          <button className="delete-action" onClick={() => handleDeleteContent(c.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {content.filter(c => c.state === selectedStateForContent).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#888', fontStyle: 'italic' }}>
                          No database entries found for {selectedStateForContent}. Creators need to upload first!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
