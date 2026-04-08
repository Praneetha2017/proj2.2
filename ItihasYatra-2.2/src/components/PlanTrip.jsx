import React, { useState } from 'react';
import './PlanTrip.css';

const PlanTrip = () => {
  const [needGuide, setNeedGuide] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    startDate: '',
    endDate: '',
    people: 1,
    language: '',
    gender: 'any'
  });
  const guideCostPerDay = 500; // Estimated guide cost

  const getTripsDB = () => JSON.parse(localStorage.getItem('mockTripsDB')) || [];
  const saveTripsDB = (trips) => localStorage.setItem('mockTripsDB', JSON.stringify(trips));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const email = currentUser.email || formValues.email;
    const name = currentUser.username || formValues.name;

    if (!email || !name || !formValues.state || !formValues.startDate || !formValues.endDate) {
      alert('Please fill in all required trip details.');
      return;
    }

    const newTrip = {
      id: Date.now(),
      user: name,
      email,
      state: formValues.state,
      dates: `${formValues.startDate} - ${formValues.endDate}`,
      people: Number(formValues.people),
      guideNeeded: needGuide,
      assignedGuide: null,
      status: 'Pending',
      messages: [],
      requestedAt: new Date().toISOString(),
      languagePreference: formValues.language || 'Any',
      genderPreference: formValues.gender || 'any'
    };

    const trips = getTripsDB();
    trips.push(newTrip);
    saveTripsDB(trips);

    alert('Trip request submitted successfully! Admin can now review it in the dashboard.');
    setFormValues({ name: '', email: '', phone: '', startDate: '', endDate: '', people: 1, language: '', gender: 'any' });
    setNeedGuide(false);
  };

  return (
    <div className="plan-container">
      <h1>Plan Your Custom Trip</h1>
      <form className="plan-form" onSubmit={handleSubmit}>
        <div className="form-group"><input type="text" name="name" placeholder="Full Name" required value={formValues.name} onChange={handleChange} /></div>
        <div className="form-group"><input type="email" name="email" placeholder="Email Address" required value={formValues.email} onChange={handleChange} /></div>
        <div className="form-group"><input type="tel" name="phone" placeholder="Phone Number" value={formValues.phone} onChange={handleChange} /></div>
        <div className="form-group">
          <select name="state" required value={formValues.state} onChange={handleChange}>
            <option value="">Select State for Trip</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Kerala">Kerala</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" required value={formValues.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" required value={formValues.endDate} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-group">
          <input type="number" name="people" placeholder="Number of People Traveling" min="1" required value={formValues.people} onChange={handleChange} />
        </div>
        
        <div className="guide-section">
          <label className="toggle-label">
            <input type="checkbox" checked={needGuide} onChange={(e) => setNeedGuide(e.target.checked)} />
            Need a Tour Guide? (Estimated Cost: ₹{guideCostPerDay}/day)
          </label>
          
          {needGuide && (
            <div className="guide-requirements">
              <h4>Guide Requirements</h4>
              <select name="language" required value={formValues.language} onChange={handleChange}>
                <option value="">Select Language Preference</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="regional">Local Regional Language</option>
              </select>
              <select name="gender" required value={formValues.gender} onChange={handleChange}>
                <option value="any">No Preference</option>
                <option value="male">Male Guide</option>
                <option value="female">Female Guide</option>
              </select>
            </div>
          )}
        </div>

        <div className="safety-panel">
          <h4>🛡️ Women's Safety & Emergency Panel</h4>
          <label className="safety-label">
            <input type="checkbox" /> 
            Activate Real-time Location Sharing to Admin/Family during trip
          </label>
          <p className="safety-note">Note: If activated, an emergency SOS button will be present on your profile page during your trip.</p>
        </div>

        <button type="submit" className="submit-trip-btn">Submit Trip Request</button>
      </form>
    </div>
  );
};
export default PlanTrip;
