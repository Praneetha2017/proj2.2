import React, { useState } from 'react';
import axios from 'axios'; 
import './PlanTrip.css';

const PlanTrip = () => {
  const [needGuide, setNeedGuide] = useState(false);
  const [formValues, setFormValues] = useState({
    state: '',
    startDate: '',
    endDate: '',
    people: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- UPDATED LOGIC TO GET LOGGED IN USER ---
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Use the ID from localStorage if it exists, otherwise fallback to 1 (Radha)
    const activeUserId = currentUser?.id || 1; 

    const tripPayload = {
      userId: activeUserId, // Link to the user currently browsing
      state: formValues.state,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      numPeople: Number(formValues.people),
      guideNeeded: needGuide
    };

    try {
      const response = await axios.post("http://localhost:8080/api/trips/request", tripPayload);
      
      if (response.status === 200 || response.status === 201) {
        // --- ADD TO LOCAL STORAGE FOR ADMIN PORTAL VISIBILITY ---
        const existingTrips = JSON.parse(localStorage.getItem('mockTripsDB')) || [];
        const newLocalTrip = {
            id: Date.now(),
            user: currentUser?.username || 'Guest',
            email: currentUser?.email || 'guest@example.com',
            state: formValues.state,
            dates: `${formValues.startDate} - ${formValues.endDate}`,
            people: Number(formValues.people),
            guideNeeded: needGuide,
            assignedGuide: null,
            status: "Pending",
            messages: []
        };
        localStorage.setItem('mockTripsDB', JSON.stringify([...existingTrips, newLocalTrip]));
        window.dispatchEvent(new Event('storage'));

        alert(`Trip request submitted! Linked to User ID: ${activeUserId}`);
        
        // Clear form
        setFormValues({ state: '', startDate: '', endDate: '', people: 1 });
        setNeedGuide(false);
      }
    } catch (error) {
      console.error("Database Update Error:", error.response?.data);
      alert("Failed to update database. Check if Spring Boot is running.");
    }
  };

  return (
    <div className="plan-container">
      <h1>Plan Your Custom Trip</h1>
      <form className="plan-form" onSubmit={handleSubmit}>
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
          <input type="number" name="people" placeholder="Number of People" min="1" required value={formValues.people} onChange={handleChange} />
        </div>
        
        <div className="guide-section">
          <label className="toggle-label">
            <input type="checkbox" checked={needGuide} onChange={(e) => setNeedGuide(e.target.checked)} />
            Need a Tour Guide? (Estimated Cost: ₹500/day)
          </label>
        </div>

        <button type="submit" className="submit-trip-btn">Submit Trip Request</button>
      </form>
    </div>
  );
};

export default PlanTrip;