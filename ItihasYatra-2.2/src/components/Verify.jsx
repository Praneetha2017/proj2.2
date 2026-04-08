import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:8080/api/auth/verify?token=${token}`)
        .then(response => {
          alert('Email verified successfully! Redirecting to login...');
          navigate('/auth'); // Redirect to login page
        })
        .catch(error => {
          setMessage(error.response?.data || 'Verification failed. Invalid or expired link.');
          console.error(error);
        });
    } else {
      setMessage('No verification token found.');
    }
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center', color: '#fff' }}>
        <h2>Email Verification</h2>
        <p style={{ marginTop: '20px', color: '#ccc', fontSize: '1.2rem' }}>{message}</p>
      </div>
    </div>
  );
};

export default Verify;
