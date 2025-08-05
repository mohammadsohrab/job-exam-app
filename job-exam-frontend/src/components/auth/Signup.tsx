import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // Import the axios instance
import axios from 'axios';



interface SignupProps {
  onLogin: (token: string, username: string, role: string) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };
  const verifyEmailExists = async (email: string): Promise<boolean> => {
  try {
    const apiKey = '05b33d4bcd6c4644979f221a4f3fa8e3'; // Your Abstract API Key
    const res = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`);
    
    return res.data.deliverability === 'DELIVERABLE' && res.data.is_smtp_valid.value === true;
  } catch (err) {
    console.error("Email verification failed:", err);
    return false; // fallback: fail closed
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailIsValid = await verifyEmailExists(formData.email);
  if (!emailIsValid) {
    setError('Entered email does not appear to exist or is undeliverable.');
    setLoading(false);
    return;
  }

   try {
      const response = await axiosInstance.post('/public/signup', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'student',
      });

      const { token, fullName, role } = response.data;

      // Store token info
      localStorage.setItem('token', token);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('role', role);

      onLogin(token, fullName, role);

      navigate(role === 'student' ? '/student/news' : '/admin');
    } catch (err: any) {
      if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.message);
    if (error.response) {
      console.error("Backend response:", error.response.data);
      setError(error.response.data.message || 'Signup failed');
    } else if (error.request) {
      console.error("No response received:", error.request);
      setError('Server not responding');
    } else {
      setError(error.message);
    }
  } else {
    console.error("Unexpected error:", error);
    setError('An unexpected error occurred.');
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Online Examination Portal Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onSwitchToLogin}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;