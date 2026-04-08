import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Monument.css';

const guides = [
  { id: 101, name: "Ramesh Sharma", experience: "5 Years", rating: 4.8 },
  { id: 102, name: "Anjali Gupta", experience: "8 Years", rating: 4.9 },
  { id: 103, name: "Vikram Singh", experience: "3 Years", rating: 4.5 }
];

const mockDetails = {
  name: "Historic Monument",
  desc: "An incredible piece of Indian heritage with stunning architecture and rich history.",
  gallery: [
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581015112397-6a1bd14424ce?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621213491410-b8beeb6fe73d?auto=format&fit=crop&q=80&w=800"
  ],
  reviews: [
    { id: 1, user: "Afrin", comment: "Absolutely breathtaking! A must visit.", rating: 5 },
    { id: 2, user: "Rajesh", comment: "Beautiful architecture, but very crowded.", rating: 4 }
  ]
};

const Monument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Generic mock details for demonstration
  const details = mockDetails;

  const handleBookGuide = (guideName) => {
    alert(`Successfully booked tour guide: ${guideName}! They will contact you shortly.`);
  };

  return (
    <div className="monument-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')} style={{marginTop: 0}}>← Back to Dashboard</button>
      
      <div className="monument-header">
        <h1>{details.name} (ID: {id})</h1>
        <p>{details.desc}</p>
      </div>

      <div className="monument-content">
        <section className="gallery-section">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {details.gallery.map((img, index) => (
              <img key={index} src={img} alt="Monument view" className="gallery-img" />
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <h2>User Reviews</h2>
          <div className="reviews-list">
            {details.reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.user}</strong>
                  <span>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guides-section">
          <h2>Available Tour Guides</h2>
          <div className="guides-list">
            {guides.map(guide => (
              <div key={guide.id} className="guide-card">
                <div className="guide-info">
                  <h3>{guide.name}</h3>
                  <p>Experience: {guide.experience} | Rating: {guide.rating} ⭐</p>
                </div>
                <button className="book-btn" onClick={() => handleBookGuide(guide.name)}>Book Guide</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Monument;
