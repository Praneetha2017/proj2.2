import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Auth from './components/Auth';
import Verify from './components/Verify';
import Dashboard from './components/Dashboard';
import StateOverview from './components/StateOverview';
import Monument from './components/Monument';
import PlanTrip from './components/PlanTrip';
import Profile from './components/Profile';
import VirtualTour from './components/VirtualTour';
import AdminDashboard from './components/AdminDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import CreatorStateOverview from './components/CreatorStateOverview';
import GuideDashboard from './components/GuideDashboard';
import './index.css';

const Home = () => (
  <>
    <Hero />
    <AboutUs />
    <Contact />
  </>
);

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 40px', backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 100
    }}>
      <div onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
        <h2 style={{fontFamily: "var(--display-font)", fontStyle: "italic", color: "var(--accent-color)", margin: 0}}>ItihasYatra</h2>
      </div>
      <div>
        <button 
          onClick={() => navigate('/profile')} 
          style={{background: "var(--accent-color)", color: "#000", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "600", cursor: "pointer"}}>
          Profile
        </button>
      </div>
    </nav>
  );
};

const MainLayout = () => (
  <>
    <Navbar />
    <div style={{ minHeight: "calc(100vh - 65px)", background: "var(--bg-color)" }}>
      <Outlet />
    </div>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />

          {/* Protected/Dashboard Routes with Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/state/:stateName" element={<StateOverview />} />
            <Route path="/monument/:id" element={<Monument />} />
            <Route path="/virtual-tour/:tourName" element={<VirtualTour />} />
            <Route path="/plan-trip" element={<PlanTrip />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/creator/state/:stateName" element={<CreatorStateOverview />} />
            <Route path="/guide" element={<GuideDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
