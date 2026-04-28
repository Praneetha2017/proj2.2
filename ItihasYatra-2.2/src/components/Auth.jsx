import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_BASE_URL = "http://localhost:8080/api/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // --- RESTORED ADMIN DETAILS ---
  const hardcodedAdmin = {
    id: 0,
    username: 'Site Admin',
    email: 'admin@itihasyatra.com',
    role: 'Admin',
    password: 'Admin@1234',
    token: 'hardcoded-admin-token',
    status: 'Approved'
  };

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Cultural Enthusiast',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleEnumMap = {
      'Cultural Enthusiast': 'CULTURAL_ENTHUSIAST',
      'Content Creator': 'CONTENT_CREATOR',
      'Tour Guide': 'TOUR_GUIDE',
    };

    try {
      if (!isLogin) {
        // --- SIGNUP LOGIC ---
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
          alert("Please enter a valid email address with a standard domain extension (e.g., @gmail.com).");
          return;
        }

        if (formData.password.length < 8) {
          alert("Password must be at least 8 characters long.");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        // Validation removed. Anyone can signup as Tour Guide.

        await axios.post(`${API_BASE_URL}/signup`, {
          username: formData.username,
          email: formData.email,
          role: roleEnumMap[formData.role] || 'CULTURAL_ENTHUSIAST',
          password: formData.password
        });

        alert("Signup Successful! Please check your email for the OTP.");
        setAwaitingOtp(true);
      } else {
        // --- LOGIN LOGIC ---
        
        // 1. Check for Hardcoded Admin first (Exactly as before)
        if (formData.email === hardcodedAdmin.email && formData.password === hardcodedAdmin.password) {
          localStorage.setItem('currentUser', JSON.stringify(hardcodedAdmin));
          localStorage.setItem('jwtToken', hardcodedAdmin.token);
          navigate('/admin');
          return;
        }

        // 2. Otherwise, check Database
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password
        });

        // Backend login might not return ID, so fetch the user list to guarantee we get the correct ID mapping
        const usersResp = await axios.get(`${API_BASE_URL}/users`);
        const foundUser = usersResp.data.find(u => u.email === formData.email);
        const resolvedId = foundUser ? foundUser.id : response.data.id;

        // Mapping Database response to currentUser (Ensuring ID is included)
        const currentUserObj = {
          id: resolvedId, // Critical for PlanTrip and Profile
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
        localStorage.setItem('jwtToken', response.data.token);

        alert("Login successful!");
        
        // Navigation based on Database Role
        const role = response.data.role;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'TOUR_GUIDE') navigate('/guide');
        else if (role === 'CONTENT_CREATOR') navigate('/creator');
        else navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const errorMsg = error.response?.data?.message || "Server Error: Is port 8080 running?";
      alert(errorMsg);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: formData.email,
        otp: otp
      });
      alert("OTP Verified Successfully! You can now login.");
      setAwaitingOtp(false);
      setIsLogin(true);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  if (awaitingOtp) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="active">Verify OTP</h2>
          </div>
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p style={{textAlign: 'center', marginBottom: '15px'}}>An OTP has been sent to {formData.email}</p>
            <div className="form-group">
              <input type="text" name="otp" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
            </div>
            <button type="submit" className="auth-btn">Verify</button>
          </form>
          <button className="back-btn" onClick={() => setAwaitingOtp(false)}>
            ← Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</h2>
          <h2 onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Sign Up</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="Cultural Enthusiast">Cultural Enthusiast</option>
                  <option value="Content Creator">Content Creator</option>
                  <option value="Tour Guide">Tour Guide</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} minLength="8" />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} minLength="8" />
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Auth;