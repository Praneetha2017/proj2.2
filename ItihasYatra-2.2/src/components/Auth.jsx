import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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

  const getMockUsers = () => JSON.parse(localStorage.getItem('mockUsersDB')) || {};
  const saveMockUser = (user) => {
    const users = getMockUsers();
    users[user.email] = user;
    localStorage.setItem('mockUsersDB', JSON.stringify(users));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      
      const pwd = formData.password;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

      if (pwd.length < 8 || !hasUpper || !hasLower || !hasSpecial) {
        alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character.");
        return;
      }
    }

    try {
      if (!isLogin) {
        const selectedRole = formData.role === 'Admin' ? 'Cultural Enthusiast' : formData.role;
        const approvedGuideApps = Object.values(JSON.parse(localStorage.getItem('mockGuideApplicationsDB')) || {}).filter(app => app.status === 'Approved');
        const isApprovedGuideEmail = approvedGuideApps.some(app => app.approvalEmail === formData.email);

        if (selectedRole === 'Tour Guide' && !isApprovedGuideEmail) {
          alert('Invalid access: Tour Guide signup requires an admin-approved guide email.');
          return;
        }

        const approvalStatus = (selectedRole === 'Content Creator') ? 'Pending' : 'Approved';

        await axios.post("http://localhost:8080/api/auth/signup", {
          username: formData.username,
          email: formData.email,
          role: selectedRole,
          password: formData.password
        });

        saveMockUser({
          username: formData.username,
          email: formData.email,
          role: selectedRole,
          status: approvalStatus,
          createdAt: new Date().toISOString()
        });

        alert(`Signup Successful! Registered securely as a ${selectedRole}. ${approvalStatus === 'Pending' ? 'Your account requires Admin approval before you can access the creator/tour guide portal.' : ''}`);
        setFormData({
          username: '',
          email: '',
          role: 'Cultural Enthusiast',
          password: '',
          confirmPassword: ''
        });
        setIsLogin(true);
        return;
      }

      if (formData.email === hardcodedAdmin.email && formData.password === hardcodedAdmin.password) {
        const currentUserObj = { ...hardcodedAdmin };
        localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
        localStorage.setItem('jwtToken', hardcodedAdmin.token);
        navigate('/admin');
        return;
      }

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;
      const savedUser = getMockUsers()[formData.email];
      const userStatus = savedUser?.status;
      const role = data.role === 'Admin' ? 'Admin' : savedUser?.role || data.role;

      const currentUserObj = {
        id: data.id,
        username: data.username,
        email: data.email,
        role,
        status: userStatus || 'Approved',
        token: data.token
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
      localStorage.setItem('jwtToken', data.token);

      if ((role === 'Content Creator' || role === 'Tour Guide') && userStatus === 'Pending') {
        alert('Your application is still pending admin approval. You can still sign in as a normal user until approval is granted.');
        navigate('/dashboard');
        return;
      }

      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Content Creator') {
        navigate('/creator');
      } else if (role === 'Tour Guide') {
        navigate('/guide');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error("Backend Auth Error:", error);
      if (error.response && error.response.data) {
        alert("Authentication Failed: " + JSON.stringify(error.response.data, null, 2));
      } else {
        alert("Authentication Failed! Is the Spring Boot server fully up and running on port 8080?");
      }
    }
  };

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
            <input type="password" name="password" placeholder="Password (Min 8 Chars)" required minLength="8" value={formData.password} onChange={handleChange} />
          </div>
          {!isLogin && (
            <div className="form-group">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required minLength="8" value={formData.confirmPassword} onChange={handleChange} />
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
