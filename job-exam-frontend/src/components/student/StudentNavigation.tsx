import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface StudentNavigationProps {
  username: string;
}

const StudentNavigation: React.FC<StudentNavigationProps> = ({ username }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/student/news" className="nav-logo">
         Online Examination Portal
        </Link>
        
        {/* Desktop Navigation */}
        <div className="nav-menu-container hidden md:block">
          <ul className="nav-menu">
            <li>
              <Link 
                to="/student/news" 
                className={`nav-link ${isActive('/student/news') ? 'active' : ''}`}
              >
                News
              </Link>
            </li>
            <li>
              <Link 
                to="/student/applications" 
                className={`nav-link ${isActive('/student/applications') ? 'active' : ''}`}
              >
                My Applications
              </Link>
            </li>
            <li>
              <Link 
                to="/student/feedback" 
                className={`nav-link ${isActive('/student/feedback') ? 'active' : ''}`}
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link 
                to="/student/profile" 
                className={`nav-link ${isActive('/student/profile') ? 'active' : ''}`}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn block md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <ul className="mobile-menu-list">
            <li>
              <Link 
                to="/student/news" 
                className={`mobile-nav-link ${isActive('/student/news') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                News
              </Link>
            </li>
            <li>
              <Link 
                to="/student/applications" 
                className={`mobile-nav-link ${isActive('/student/applications') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Applications
              </Link>
            </li>
            <li>
              <Link 
                to="/student/feedback" 
                className={`mobile-nav-link ${isActive('/student/feedback') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link 
                to="/student/profile" 
                className={`mobile-nav-link ${isActive('/student/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default StudentNavigation;