import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StateOverview.css';
// Using the same underlying dictionary structure, but providing extreme mutability powers!
const stateDataDB = {
  rajasthan: {
    name: "Rajasthan",
    description: "Rajasthan, the 'Land of Kings', is India's largest state by area. It is globally renowned for its magnificent forts, opulent palaces, and vibrant culture. The state is framed by the harsh beauty of the Thar Desert and the ancient Aravalli Range. Whether it's the pink hues of Jaipur, the blue alleys of Jodhpur, or the golden sands of Jaisalmer, Rajasthan offers an unforgettable journey into India's princely past. Its culinary heritage and folk arts are unmatched.",
    spots: [
      { id: 'rj-1', name: "Amber Fort", icon: "🏰", desc: "A magnificent fort built with red sandstone and marble, located high on a hill in Amer.", specialty: "Famous for its Hindu-Rajput architectural style and the magical Sheesh Mahal (Mirror Palace)." },
      { id: 'rj-2', name: "Hawa Mahal", icon: "🕌", desc: "The 'Palace of Winds' is a beautiful five-story facade with 953 small windows.", specialty: "Built so royal ladies could observe street festivals without being seen from outside." },
    ],
    virtualTours: [
      { name: "360° Amber Fort Walkthrough", icon: "🥽", desc: "Experience the royal courtyards in immersive virtual reality." },
      { name: "Jaisalmer AR Desert Safari", icon: "🐪", desc: "Interactive augmented reality desert visualization." }
    ],
    arts: [
      { name: "Blue Pottery", icon: "🏺", desc: "Famous Jaipur craft known for vibrant blue dyes." },
      { name: "Bandhani Fabrics", icon: "👘", desc: "Traditional tie-dye textile art." }
    ],
    cuisine: [
      { name: "Dal Baati Churma", icon: "🍛", desc: "Classic baked wheat balls served with lentils and ghee." },
      { name: "Laal Maas", icon: "🍲", desc: "Fiery traditional meat curry." }
    ]
  },
  // Adding just one more base state for rapid fallback debugging internally
  maharashtra: {
    name: "Maharashtra",
    description: "Maharashtra is a vast state spanning the western coast of India, blending fast-paced modernization with ancient history. It is the home of the bustling metropolis Mumbai and the heartland of the great Maratha Empire.",
    spots: [
      { id: 'mh-1', name: "Ajanta & Ellora Caves", icon: "🛕", desc: "Ancient rock-cut caves featuring elaborate Buddhist, Hindu, and Jain sculptures.", specialty: "A UNESCO World Heritage site known for its exquisite ancient Indian rock-cut architecture." }
    ],
    virtualTours: [],
    arts: [],
    cuisine: []
  }
};

const CreatorStateOverview = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const [expandedSpot, setExpandedSpot] = useState(null);
  
  // Power User Toggles
  const [editMode, setEditMode] = useState(false);
  const initialData = stateDataDB[stateName.toLowerCase()] || stateDataDB['rajasthan'];
  const [data, setData] = useState(initialData);

  const getMockContent = () => JSON.parse(localStorage.getItem('mockContentDB')) || [];
  const saveMockContent = (items) => localStorage.setItem('mockContentDB', JSON.stringify(items));

  const toggleSpot = (id) => {
    setExpandedSpot(expandedSpot === id ? null : id);
  };

  const handleAddField = (category) => {
    const newData = { ...data };
    if (category === 'spots') {
      newData.spots.push({ id: `new-${Date.now()}`, name: "New Monument", icon: "🗿", desc: "Description...", specialty: "Specialty detail...", url: "" });
    } else if (category === 'arts' || category === 'cuisine') {
      newData[category].push({ name: "New Entry", icon: "✨", desc: "Description...", url: "" });
    }
    setData(newData);
  };

  const handleDeleteField = (category, idx) => {
    const newData = { ...data };
    newData[category].splice(idx, 1);
    setData(newData);
  };

  const handleUpdateField = (category, idx, field, value) => {
    const newData = { ...data };
    newData[category][idx][field] = value;
    setData(newData);
  };

  return (
    <div className="state-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <button className="back-btn" onClick={() => navigate('/creator')} style={{marginBottom: 0}}>← Back to Creator Studio</button>
        {editMode ? (
          <button className="plan-btn" style={{background: '#28a745', border: 'none'}} onClick={async () => {
             try {
                const queueItems = [];
                const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                data.spots.forEach(spot => queueItems.push({
                  id: `creator-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  type: 'Monument',
                  state: data.name,
                  name: spot.name,
                  description: spot.desc,
                  url: spot.url || '',
                  status: 'Pending',
                  createdBy: currentUser.email || 'creator',
                  createdAt: new Date().toISOString()
                }));
                data.arts.forEach(art => queueItems.push({
                  id: `creator-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  type: 'Art & Craft',
                  state: data.name,
                  name: art.name,
                  description: art.desc,
                  url: art.url || '',
                  status: 'Pending',
                  createdBy: currentUser.email || 'creator',
                  createdAt: new Date().toISOString()
                }));
                data.cuisine.forEach(food => queueItems.push({
                  id: `creator-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  type: 'Cuisine',
                  state: data.name,
                  name: food.name,
                  description: food.desc,
                  url: food.url || '',
                  status: 'Pending',
                  createdBy: currentUser.email || 'creator',
                  createdAt: new Date().toISOString()
                }));

                const existing = getMockContent();
                const saved = [...existing, ...queueItems];
                saveMockContent(saved);

                try {
                  for (const item of queueItems) {
                    await axios.post("http://localhost:8080/api/creator/content/add", {
                      category: item.type,
                      targetState: item.state,
                      name: item.name,
                      description: item.description,
                      url: item.url
                    }, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                      }
                    });
                  }
                } catch (innerError) {
                  console.warn('Backend upload failed, local queue still preserved.', innerError);
                }

                alert('All edits queued for Admin review and saved locally. Approved content will appear for users after Admin approval.');
                setEditMode(false);
             } catch(e) {
                alert("Save failed. Please try again.");
                console.error(e);
             }
          }}>💾 Publish Changes to Admin Queue</button>
        ) : (
          <button className="plan-btn" style={{background: '#fca311', color: '#000', border: 'none'}} onClick={() => setEditMode(true)}>🖍️ Enter Edit Mode</button>
        )}
      </div>
      
      <div className="state-hero">
        {editMode ? (
          <input className="edit-input-hero" value={data.name} onChange={e => setData({...data, name: e.target.value})} style={{fontSize: '3rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', color: '#fca311', width: '100%', textAlign: 'center', border: '1px dashed #fca311'}} />
        ) : (
          <h1>{data.name} <span style={{fontSize: '1rem', color: '#fca311', border: '1px solid #fca311', padding: '5px 10px', borderRadius: '15px', verticalAlign: 'middle'}}>Creator Privileges</span></h1>
        )}

        {editMode ? (
          <textarea className="edit-textarea-hero" value={data.description} onChange={e => setData({...data, description: e.target.value})} style={{width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.1)', color: '#fff', marginTop: '20px', padding: '15px'}} />
        ) : (
          <p className="state-desc-long">{data.description}</p>
        )}
      </div>

      <div className="state-sections">
        {/* Heritage Section */}
        <section style={editMode ? {border: '1px dashed #fca311', padding: '20px', borderRadius: '10px'} : {}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>🏰 Heritage Spots & Monuments</h2>
            {editMode && <button className="add-btn-small" onClick={() => handleAddField('spots')} style={{background: '#0dcaf0', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold'}}>+ Add Monument</button>}
          </div>
          
          <div className="cards-grid">
            {data.spots.map((spot, idx) => (
              <div key={spot.id} className={`spot-card ${expandedSpot === spot.id && !editMode ? 'expanded' : ''}`} onClick={!editMode ? () => toggleSpot(spot.id) : undefined} style={editMode ? {cursor: 'default'} : {}}>
                {editMode && <button onClick={() => handleDeleteField('spots', idx)} style={{float:'right', background:'red', color:'white', border:'none', borderRadius:'5px'}}>X</button>}
                
                {editMode ? (
                  <>
                    <input value={spot.icon} onChange={e => handleUpdateField('spots', idx, 'icon', e.target.value)} style={{width:'40px', fontSize:'2rem'}} />
                    <input value={spot.name} onChange={e => handleUpdateField('spots', idx, 'name', e.target.value)} style={{width:'100%', marginTop:'10px', fontSize:'1.2rem', fontWeight:'bold'}} />
                    <textarea value={spot.desc} onChange={e => handleUpdateField('spots', idx, 'desc', e.target.value)} style={{width:'100%', marginTop:'10px', height: '60px'}} />
                    <input value={spot.specialty} onChange={e => handleUpdateField('spots', idx, 'specialty', e.target.value)} placeholder="Specialty info..." style={{width:'100%', marginTop:'10px'}} />
                    <input value={spot.url || ''} onChange={e => handleUpdateField('spots', idx, 'url', e.target.value)} placeholder="Optional Image/URL (https://...)" style={{width:'100%', marginTop:'10px', border:'1px dashed #0dcaf0', background:'rgba(13,202,240,0.05)'}} />
                  </>
                ) : (
                  <>
                    {spot.url ? (
                      <img src={spot.url} alt={spot.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px'}} />
                    ) : (
                      <div className="spot-icon">{spot.icon}</div>
                    )}
                    <h3>{spot.name}</h3>
                    <p>{spot.desc}</p>
                    {expandedSpot === spot.id ? (
                      <div className="spot-specialty slide-down">
                        <strong>Speciality:</strong> {spot.specialty}
                      </div>
                    ) : (
                      <p className="click-to-expand">Click Card to reveal Speciality ▼</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Culture: Arts Section */}
        <section style={editMode ? {border: '1px dashed #fca311', padding: '20px', borderRadius: '10px'} : {}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>🎨 Art & Handicrafts</h2>
            {editMode && <button className="add-btn-small" onClick={() => handleAddField('arts')} style={{background: '#0dcaf0', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold'}}>+ Add Art</button>}
          </div>
          <div className="cards-grid">
            {data.arts.map((art, idx) => (
              <div key={idx} className="spot-card">
                {editMode && <button onClick={() => handleDeleteField('arts', idx)} style={{float:'right', background:'red', color:'white', border:'none', borderRadius:'5px'}}>X</button>}
                {editMode ? (
                  <>
                    <input value={art.icon} onChange={e => handleUpdateField('arts', idx, 'icon', e.target.value)} style={{width:'40px', fontSize:'2rem'}} />
                    <input value={art.name} onChange={e => handleUpdateField('arts', idx, 'name', e.target.value)} style={{width:'100%', marginTop:'10px', fontWeight:'bold'}} />
                    <textarea value={art.desc} onChange={e => handleUpdateField('arts', idx, 'desc', e.target.value)} style={{width:'100%', marginTop:'10px', height: '60px'}} />
                    <input value={art.url || ''} onChange={e => handleUpdateField('arts', idx, 'url', e.target.value)} placeholder="Optional Image URL (https://...)" style={{width:'100%', marginTop:'10px', border:'1px dashed #0dcaf0', background:'rgba(13,202,240,0.05)'}} />
                  </>
                ) : (
                  <>
                    {art.url ? (
                      <img src={art.url} alt={art.name} style={{width: '100%', height: '200px', objectFit:'cover', borderRadius:'12px', marginBottom:'15px'}} />
                    ) : (
                      <div className="spot-icon">{art.icon}</div>
                    )}
                    <h3>{art.name}</h3>
                    <p>{art.desc}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
export default CreatorStateOverview;
