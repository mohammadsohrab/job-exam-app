import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance'; 


interface LoginProps {
  onLogin: (token: string, username: string, role: string) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   try {
      const response = await ('https://job-exam-app.onrender.com/public/login', {
        email: formData.email,
        password: formData.password
      });
      console.log("Login response:", response.data);
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
        <h2 className="auth-title">Online Examination Portal Login</h2>
        <form onSubmit={handleSubmit}>
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
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onSwitchToSignup}
          >
            Don't have an account? Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;