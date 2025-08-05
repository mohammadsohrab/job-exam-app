import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthHandler from './components/auth/AuthHandler';
import StudentNews from './components/student/StudentNews';
import StudentApplications from './components/student/StudentApplications';
import StudentFeedback from './components/student/StudentFeedback';
import StudentProfile from './components/student/StudentProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentLayout from './components/student/StudentLayout';
import StudentProfileView from './components/student/StudentProfileView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
  
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');

    if (token && storedUsername && storedRole) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, username: string, role: string) => {
    setIsAuthenticated(true);
    setUsername(username);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUsername('');
    setRole('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<AuthHandler onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {role === 'student' ? (
              <>
                <Route path="/" element={<Navigate to="/student/news" replace />} />
                <Route path="/student" element={<StudentLayout username={username} />}>
                  <Route index element={<Navigate to="/student/news" replace />} />
                  <Route path="news" element={<StudentNews />} />
                  <Route path="applications" element={<StudentApplications />} />
                  <Route path="feedback" element={<StudentFeedback />} />
                  <Route path="profile" element={<StudentProfile />} />
                </Route>
                <Route path="*" element={<Navigate to="/student/news" replace />} />
              </>
            ) : role === 'admin' ? (
              <>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<AdminDashboard/>} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;