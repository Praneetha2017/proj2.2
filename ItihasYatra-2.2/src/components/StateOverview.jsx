import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StateOverview.css';

const stateDataDB = {
  rajasthan: {
    name: "Rajasthan",
    description: "Rajasthan, the 'Land of Kings', is India's largest state by area. It is globally renowned for its magnificent forts, opulent palaces, and vibrant culture. The state is framed by the harsh beauty of the Thar Desert and the ancient Aravalli Range. Whether it's the pink hues of Jaipur, the blue alleys of Jodhpur, or the golden sands of Jaisalmer, Rajasthan offers an unforgettable journey into India's princely past. Its culinary heritage and folk arts are unmatched.",
    spots: [
      { id: 'rj-1', name: "Amber Fort", icon: "🏰", url: "https://images.unsplash.com/photo-1599661559891-b3b054238714?h=400", desc: "A magnificent fort built with red sandstone and marble, located high on a hill in Amer.", specialty: "Famous for its Hindu-Rajput architectural style and the magical Sheesh Mahal (Mirror Palace)." },
      { id: 'rj-2', name: "Hawa Mahal", icon: "🕌", url: "https://images.unsplash.com/photo-1599827668698-5c4238e8ecab?h=400", desc: "The 'Palace of Winds' is a beautiful five-story facade with 953 small windows.", specialty: "Built so royal ladies could observe street festivals without being seen from outside." },
    ],
    virtualTours: [
      { name: "360° Amber Fort Walkthrough", icon: "🥽", url: "https://images.unsplash.com/photo-1563821015694-de4c34a1ad59?h=400", desc: "Experience the royal courtyards in immersive virtual reality." },
      { name: "Jaisalmer AR Desert Safari", icon: "🐪", url: "https://images.unsplash.com/photo-1502016590393-27aa51c27db1?h=400", desc: "Interactive augmented reality desert visualization." }
    ],
    arts: [
      { name: "Blue Pottery", icon: "🏺", url: "https://images.unsplash.com/photo-1616428784110-6cfa87df0bdf?h=400", desc: "Famous Jaipur craft known for vibrant blue dyes." },
      { name: "Bandhani Fabrics", icon: "👘", url: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?h=400", desc: "Traditional tie-dye textile art." }
    ],
    cuisine: [
      { name: "Dal Baati Churma", icon: "🍛", url: "https://images.unsplash.com/photo-1626315865660-316f0ce3f4cb?h=400", desc: "Classic baked wheat balls served with lentils and ghee." },
      { name: "Laal Maas", icon: "🍲", url: "https://images.unsplash.com/photo-1606471191009-63994c53433b?h=400", desc: "Fiery traditional meat curry." }
    ]
  },
  maharashtra: {
    name: "Maharashtra",
    description: "Maharashtra is a vast state spanning the western coast of India, blending fast-paced modernization with ancient history. It is the home of the bustling metropolis Mumbai and the heartland of the great Maratha Empire. The state features the majestic Sahyadri mountain range, ancient rock-cut caves, and heavily fortified coastal forts. From the vibrant Ganesh Chaturthi festivals to its spicy and diverse street food, Maharashtra is a state of dynamic contrasts.",
    spots: [
      { id: 'mh-1', name: "Ajanta & Ellora Caves", icon: "🛕", url: "https://images.unsplash.com/photo-1582542289668-3f5f6bdde4be?h=400", desc: "Ancient rock-cut caves featuring elaborate Buddhist, Hindu, and Jain sculptures.", specialty: "A UNESCO World Heritage site known for its exquisite ancient Indian rock-cut architecture." },
      { id: 'mh-2', name: "Gateway of India", icon: "🏛️", url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?h=400", desc: "An iconic arch monument overlooking the Arabian Sea in Mumbai.", specialty: "Built in 1924, it stands as a symbolic monument representing the city's coastal heritage." },
    ],
    virtualTours: [
      { name: "Ajanta Caves 3D", icon: "🥽", url: "https://images.unsplash.com/photo-1620138902506-c8129cc1ca83?h=400", desc: "Explore the ancient Buddhist paintings in high-definition VR." },
      { name: "Raigad Fort Drone Tour", icon: "🚁", url: "https://images.unsplash.com/photo-1625807963953-ad4771485c2b?h=400", desc: "Aerial virtual tour of the Maratha Empire's capital." }
    ],
    arts: [
      { name: "Warli Painting", icon: "🖌️", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?h=400", desc: "Tribal geometric art form created using white pigment on mud walls." },
      { name: "Paithani Sarees", icon: "🧵", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?h=400", desc: "Handwoven silk sarees with intricate zari borders." }
    ],
    cuisine: [
      { name: "Vada Pav", icon: "🍔", url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?h=400", desc: "The ultimate Mumbai street food staple." },
      { name: "Misal Pav", icon: "🍛", url: "https://images.unsplash.com/photo-1631452180519-c014fe946cea?h=400", desc: "Spicy sprouted moth bean curry served with bread." }
    ]
  },
  'uttar pradesh': {
    name: "Uttar Pradesh",
    description: "Uttar Pradesh is the spiritual heart of India and its most populous state. It is the cradle of the ancient Vedic civilization and the epicenter of major religions including Hinduism and Buddhism. The state hosts the majestic Taj Mahal along the banks of the Yamuna and the sacred ghats of Varanasi along the Ganges. Its rich history weaves together Mughal grandeur, ancient mythological epics, and a deep, enduring cultural legacy.",
    spots: [
      { id: 'up-1', name: "Taj Mahal", icon: "🕌", url: "https://images.unsplash.com/photo-1548013146-72479768bada?h=400", desc: "The ivory-white marble mausoleum in Agra, a universal symbol of love.", specialty: "One of the Seven Wonders of the World, built by Emperor Shah Jahan in 1631." },
      { id: 'up-2', name: "Varanasi Ghats", icon: "🕉️", url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?h=400", desc: "Ancient riverfront steps leading down to the sacred Ganges river.", specialty: "The spiritual capital of India, known for the evening Ganga Aarti and ancient rituals." },
    ],
    virtualTours: [
      { name: "Taj Mahal VR Experience", icon: "🥽", url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?h=400", desc: "Step inside the magnificent tomb with 360° panoramas." },
      { name: "Varanasi Aarti Live/VR", icon: "🔥", url: "https://images.unsplash.com/photo-1613904985222-0d534430bdbd?h=400", desc: "Virtual simulation of the evening riverfront prayers." }
    ],
    arts: [
      { name: "Chikankari", icon: "👘", url: "https://images.unsplash.com/photo-1616147610444-245dae858df3?h=400", desc: "Delicate and traditional hand embroidery from Lucknow." },
      { name: "Banarasi Silk", icon: "📜", url: "https://images.unsplash.com/photo-1583391733975-7b568340d8af?h=400", desc: "Opulent silk fabrics renowned for gold and silver brocade." }
    ],
    cuisine: [
      { name: "Awadhi Biryani", icon: "🍲", url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?h=400", desc: "Rich and aromatic rice and meat dish from the royal kitchens." },
      { name: "Galouti Kebabs", icon: "🍖", url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?h=400", desc: "Melt-in-the-mouth minced meat kebabs." }
    ]
  },
  'tamil nadu': {
    name: "Tamil Nadu",
    description: "Tamil Nadu lies in the southern-most part of the Indian peninsula and is the proud keeper of the ancient Dravidian culture. The state is dotted with magnificent, towering temple gopurams and serene coastal beaches. Its history is incredibly ancient, ruled by great dynasties like the Cholas, Pandyas, and Pallavas. From the classical melodies of Carnatic music to the precise movements of Bharatanatyam, Tamil Nadu is a treasure trove of classical arts.",
    spots: [
      { id: 'tn-1', name: "Meenakshi Temple", icon: "🛕", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?h=400", desc: "A historic Hindu temple located on the southern bank of the Vaigai River.", specialty: "Renowned for its towering gateways (gopurams) covered in thousands of colorful figures." },
      { id: 'tn-2', name: "Mahabalipuram", icon: "🗿", url: "https://images.unsplash.com/photo-1632230784236-41724395646f?h=400", desc: "A collection of 7th-century rock-cut monuments by the Bay of Bengal.", specialty: "Famous for the Shore Temple and the massive 'Descent of the Ganges' rock relief." },
    ],
    virtualTours: [
      { name: "Meenakshi Gopurams 3D", icon: "🥽", url: "https://images.unsplash.com/photo-1605809789725-d04b68498877?h=400", desc: "Virtual zoom-in on the thousands of intricate temple sculptures." },
      { name: "Shore Temple AR", icon: "🌊", url: "https://images.unsplash.com/photo-1587320023419-4cefa710156d?h=400", desc: "Augmented reality reconstruction of the structural temple." }
    ],
    arts: [
      { name: "Tanjore Painting", icon: "🖼️", url: "https://images.unsplash.com/photo-1590480838186-b4be46cb9bd5?h=400", desc: "Classical South Indian painting style characterized by rich colors and gold foil." },
      { name: "Kanchipuram Silk", icon: "🧵", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?h=400", desc: "Heavy silk sarees renowned globally." }
    ],
    cuisine: [
      { name: "Dosa & Idli", icon: "🥞", url: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?h=400", desc: "Crispy rice crepes and steamed cakes." },
      { name: "Filter Coffee", icon: "☕", url: "https://images.unsplash.com/photo-1620612347209-be8c3a274df2?h=400", desc: "Strong, frothy traditional coffee." }
    ]
  },
  uttarakhand: {
    name: "Uttarakhand",
    description: "Uttarakhand, often referred to as 'Devbhumi' (Land of the Gods), is a pristine state nestled in the Himalayas. It is known for its breathtaking natural beauty, snow-capped peaks, and dense alpine forests. The state is a major pilgrimage hub, notably the Chardham Yatra, and is the origin point of the holy rivers Ganga and Yamuna. Whether drawing spiritual seekers to Rishikesh or trekkers to its valleys, Uttarakhand radiates a sense of divine peace.",
    spots: [
      { id: 'uk-1', name: "Kedarnath Temple", icon: "🏔️", url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?h=400", desc: "One of the holiest Hindu temples dedicated to Lord Shiva, located in the Garhwal Himalayas.", specialty: "Accessible only by a steep 16km trek, offering profoundly spiritual views." },
      { id: 'uk-2', name: "Valley of Flowers", icon: "🌸", url: "https://images.unsplash.com/photo-1634862413156-fbb97c276f55?h=400", desc: "A stunning national park known for its endemic alpine flowers.", specialty: "A UNESCO World Heritage site that blooms into a vibrant carpet of colors every monsoon." },
    ],
    virtualTours: [
      { name: "Kedarnath Trek Simulation", icon: "🥽", url: "https://images.unsplash.com/photo-1594519932142-99071c6a6f69?h=400", desc: "Experience the arduous holy trek from home." },
      { name: "Valley of Flowers 360°", icon: "🌼", url: "https://images.unsplash.com/photo-1614051065403-f0fa809ef99c?h=400", desc: "Virtual walk through the blooming alpine valleys." }
    ],
    arts: [
      { name: "Aipan Art", icon: "🎨", url: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?h=400", desc: "Ritualistic folk art drawn on the floors of Kumaoni houses." },
      { name: "Ringal Handicrafts", icon: "🧺", url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?h=400", desc: "Traditional bamboo weaving." }
    ],
    cuisine: [
      { name: "Kafuli", icon: "🥬", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?h=400", desc: "Nutritious mountain spinach dish." },
      { name: "Bal Mithai", icon: "🍬", url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?h=400", desc: "Roasted fudge-like sweet coated in sugar balls." }
    ]
  },
  kerala: {
    name: "Kerala",
    description: "Kerala, known as 'God's Own Country', is a lush, tropical paradise on the Malabar Coast. It is famous for its intricate network of emerald backwaters, sprawling tea gardens, and palm-lined beaches. The state enjoys a deeply ingrained tradition of Ayurvedic medicine and vibrant temple festivals. With its high literacy rates and eco-tourism initiatives, Kerala perfectly balances progressive society with well-preserved ancient traditions.",
    spots: [
      { id: 'kl-1', name: "Alleppey Backwaters", icon: "🛶", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?h=400", desc: "A vast network of lakes and lagoons best explored on traditional houseboats.", specialty: "Offers a serene, slow-paced journey through the pristine tropical rural life of Kerala." },
      { id: 'kl-2', name: "Munnar Tea Estates", icon: "🍃", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fca?h=400", desc: "Rolling hills heavily covered by meticulously maintained tea plantations.", specialty: "Known for its cool climate, exotic flora like the Neelakurinji, and rich tea heritage." },
    ],
    virtualTours: [
      { name: "Backwater Houseboat VR", icon: "🥽", url: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?h=400", desc: "A tranquil 360° cruise through the palm-fringed canals." },
      { name: "Munnar Drone Tour", icon: "🚁", url: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?h=400", desc: "Cinematic aerial view of the endless tea gardens." }
    ],
    arts: [
      { name: "Kathakali Costuming", icon: "🎭", url: "https://images.unsplash.com/photo-1584989045763-8a3bca2dc539?h=400", desc: "The intricate mask and costume creation for dance-dramas." },
      { name: "Coir Weaving", icon: "🧶", url: "https://images.unsplash.com/photo-1558431382-27e303142255?h=400", desc: "Traditional craft using coconut fiber." }
    ],
    cuisine: [
      { name: "Sadya", icon: "🍌", url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?h=400", desc: "Massive traditional vegetarian feast served on a banana leaf." },
      { name: "Karimeen Pollichathu", icon: "🐟", url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?h=400", desc: "Pearl spot fish roasted in plantain leaves." }
    ]
  },
  'west bengal': {
    name: "West Bengal",
    description: "West Bengal is an incredibly diverse eastern state stretching from the Himalayas to the Bay of Bengal. It is famously the cultural, intellectual, and artistic capital of India. The state embraces the legacy of Rabindranath Tagore, colonial-era architecture, and the majestic Royal Bengal Tiger in the Sunderbans. From the frenetic joyous energy of Durga Puja to the quiet beauty of Darjeeling tea gardens, Bengal is soul-stirring.",
    spots: [
      { id: 'wb-1', name: "Victoria Memorial", icon: "🏛️", url: "https://images.unsplash.com/photo-1627885741006-25916cc8c3b7?h=400", desc: "A colossal, white-marble museum in the heart of Kolkata.", specialty: "An architectural marvel dedicated to the memory of Queen Victoria." },
      { id: 'wb-2', name: "Sundarbans", icon: "🐅", url: "https://images.unsplash.com/photo-1596767439502-140c953fb3eb?h=400", desc: "The largest mangrove forest in the world, home to the Royal Bengal Tiger.", specialty: "A complex delta ecosystem that is both dangerous and breathtakingly beautiful." },
    ],
    virtualTours: [
      { name: "Sundarbans Tiger Safari VR", icon: "🥽", url: "https://images.unsplash.com/photo-1606822854972-7e0b571168ba?h=400", desc: "Virtual boat ride deep into the mangrove tiger territory." },
      { name: "Durga Puja Pandal 360°", icon: "🎪", url: "https://images.unsplash.com/photo-1602492194916-43b95ce70e9f?h=400", desc: "Immersive walkthrough of the grand Kolkata festivals." }
    ],
    arts: [
      { name: "Terracotta Art", icon: "🏺", url: "https://images.unsplash.com/photo-1616428784110-6cfa87df0bdf?h=400", desc: "Baked clay art prominent in Bishnupur." },
      { name: "Kantha Embroidery", icon: "🧵", url: "https://images.unsplash.com/photo-1593344607315-05e810adfdc3?h=400", desc: "Exquisite running-stitch embroidery on sarees." }
    ],
    cuisine: [
      { name: "Rasgulla", icon: "🥣", url: "https://images.unsplash.com/photo-1631452180537-889db4c86e0c?h=400", desc: "Famous syrupy cottage cheese dessert." },
      { name: "Macher Jhol", icon: "🍲", url: "https://images.unsplash.com/photo-1606471191009-63994c53433b?h=400", desc: "Classic Bengali spicy fish curry." }
    ]
  }
};

const StateOverview = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const [expandedSpot, setExpandedSpot] = useState(null);
  const [backendApprovedContent, setBackendApprovedContent] = useState([]);

  // Fallback to Rajasthan if the URL parameter doesn't match our DB perfectly
  const data = stateDataDB[stateName.toLowerCase()] || stateDataDB['rajasthan'];

  useEffect(() => {
    const fetchApprovedFromBackend = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/content/state/${data.name}`);
        setBackendApprovedContent(res.data);
      } catch (e) {
        console.warn("Backend content fetch failed, using local mock data only.", e);
      }
    };
    fetchApprovedFromBackend();
  }, [data.name]);

  const mockContent = JSON.parse(localStorage.getItem('mockContentDB')) || [];
  
  // Combine both sources, avoiding duplicates by name
  const allApprovedItems = [
    ...mockContent.filter(item => item.state === data.name && item.status === 'Approved'),
    ...backendApprovedContent.map(c => ({
       id: c.id,
       type: c.category || 'Monument',
       state: c.targetState,
       name: c.name,
       description: c.description,
       url: c.url,
       icon: c.icon || (c.category === 'Cuisine' ? '🍛' : c.category === 'Art & Craft' ? '🎨' : '🏰'),
       status: 'Approved'
    }))
  ];

  // deduplicate by name to prevent showing same item twice
  const uniqueApprovedContent = Array.from(new Map(allApprovedItems.map(item => [item.name, item])).values());

  const approvedSpots = uniqueApprovedContent.filter(item => item.type === 'Monument');
  const approvedArts = uniqueApprovedContent.filter(item => item.type === 'Art & Craft');
  const approvedCuisine = uniqueApprovedContent.filter(item => item.type === 'Cuisine');

  const toggleSpot = (id) => {
    setExpandedSpot(expandedSpot === id ? null : id);
  };

  const handleVRTourStart = (tourName) => {
    navigate(`/virtual-tour/${encodeURIComponent(tourName)}`);
  };

  return (
    <div className="state-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')} style={{marginBottom: '20px'}}>← Back to Map</button>
      
      <div className="state-hero">
        <h1>{data.name}</h1>
        <p className="state-desc-long">{data.description}</p>
      </div>

      <div className="state-sections">
        {/* Heritage Section */}
        <section>
          <h2>🏰 Heritage Spots & Monuments</h2>
          <div className="cards-grid">
            {data.spots.map(spot => (
              <div 
                key={spot.id} 
                className={`spot-card ${expandedSpot === spot.id ? 'expanded' : ''}`} 
                onClick={() => toggleSpot(spot.id)}
              >
                {spot.url ? (
                  <div className="spot-image-container">
                    <img 
                      src={spot.url} 
                      alt={spot.name} 
                      className="spot-img" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="spot-icon">${spot.icon || '📍'}</div>`;
                      }}
                    />
                  </div>
                ) : (
                  <div className="spot-icon">{spot.icon || '📍'}</div>
                )}
                <h3>{spot.name}</h3>
                <p>{spot.desc}</p>
                
                {/* Expandable Speciality section */}
                {expandedSpot === spot.id ? (
                  <div className="spot-specialty slide-down">
                    <strong>Speciality:</strong> {spot.specialty}
                    <div style={{marginTop: '15px'}}>
                      <button className="view-btn" onClick={(e) => { e.stopPropagation(); navigate(`/monument/${spot.id}`); }}>
                        View Full Gallery & Reviews
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="click-to-expand">Click Card to reveal Speciality ▼</p>
                )}
              </div>
            ))}
          </div>
          {approvedSpots.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Creator-Approved Spot Additions</h3>
              <div className="cards-grid">
                {approvedSpots.map(item => (
                  <div key={item.id} className="spot-card">
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const container = document.createElement('div');
                          container.className = 'spot-icon';
                          container.innerText = item.icon || '🏰';
                          e.target.parentElement.prepend(container);
                        }}
                      />
                    ) : (
                      <div className="spot-icon">{item.icon || '🏰'}</div>
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Virtual Tours Section (NEW) */}
        <section>
          <h2>🥽 Virtual Tours & AR Experiences</h2>
          <div className="cards-grid">
            {data.virtualTours.map((tour, idx) => (
              <div key={idx} className="spot-card virtual-tour-card">
                {tour.url ? <img src={tour.url} alt={tour.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px'}} /> : <div className="spot-icon">{tour.icon}</div>}
                <h3>{tour.name}</h3>
                <p>{tour.desc}</p>
                <div style={{marginTop: '20px'}}>
                  <button className="view-btn vr-btn" onClick={() => handleVRTourStart(tour.name)}>
                    Start Virtual Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Culture: Arts Section (NEW) */}
        <section>
          <h2>🎨 Art & Handicrafts</h2>
          <div className="cards-grid">
            {data.arts.map((art, idx) => (
              <div key={idx} className="spot-card">
                {art.url ? <img src={art.url} alt={art.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px'}} /> : <div className="spot-icon">{art.icon}</div>}
                <h3>{art.name}</h3>
                <p>{art.desc}</p>
              </div>
            ))}
          </div>
          {approvedArts.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Creator-Approved Art & Craft</h3>
              <div className="cards-grid">
                {approvedArts.map(item => (
                  <div key={item.id} className="spot-card">
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const container = document.createElement('div');
                          container.className = 'spot-icon';
                          container.innerText = item.icon || '🎨';
                          e.target.parentElement.prepend(container);
                        }}
                      />
                    ) : (
                      <div className="spot-icon">{item.icon || '🎨'}</div>
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Culture: Cuisine Section (NEW) */}
        <section>
          <h2>🍛 Local Cuisine</h2>
          <div className="cards-grid">
            {data.cuisine.map((dish, idx) => (
              <div key={idx} className="spot-card">
                {dish.url ? <img src={dish.url} alt={dish.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px'}} /> : <div className="spot-icon">{dish.icon}</div>}
                <h3>{dish.name}</h3>
                <p>{dish.desc}</p>
              </div>
            ))}
          </div>
          {approvedCuisine.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Creator-Approved Cuisine</h3>
              <div className="cards-grid">
                {approvedCuisine.map(item => (
                  <div key={item.id} className="spot-card">
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const container = document.createElement('div');
                          container.className = 'spot-icon';
                          container.innerText = item.icon || '🍛';
                          e.target.parentElement.prepend(container);
                        }}
                      />
                    ) : (
                      <div className="spot-icon">{item.icon || '🍛'}</div>
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>

      <div className="plan-section">
        <h2>Ready to Visit {data.name}?</h2>
        <p>Let us help you connect with professional tour guides and assure a safe, wonderful trip!</p>
        <button className="plan-btn" onClick={() => navigate('/plan-trip')}>📝 Plan a Trip</button>
      </div>
    </div>
  );
};

export default StateOverview;
