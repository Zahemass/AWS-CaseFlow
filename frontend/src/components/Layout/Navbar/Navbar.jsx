import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FaSun, FaMoon, FaChevronDown, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../../../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const { logout, user } = useAuthContext();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    setTimeout(() => navigate('/login'), 300);
  };

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <i className="bi bi-layers-half" style={{ fontSize: '1.8rem', marginRight: '8px' }}></i>
          <span>CaseFlow AI</span>
        </div>
      </div>

      <div className="navbar-right">
        

        {/* User Profile Dropdown */}
        <div className="navbar-user" ref={dropdownRef}>
          <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="username">Hi</span>
            <FaChevronDown className="dropdown-icon" />
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <FaUserCircle /> Profile
              </button>
              <button
                className="dropdown-item"
               onClick={handleLogout}
              >
                <FaSignOutAlt  /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
