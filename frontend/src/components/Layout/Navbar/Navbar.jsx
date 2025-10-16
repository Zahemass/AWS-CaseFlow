import React, { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { FaSun, FaMoon, FaChevronDown, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef()

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode')
      setIsDarkMode(true)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    } else {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/logo192.png" alt="CaseFlow AI" />
          <span>CaseFlow AI</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Profile Dropdown */}
        <div className="navbar-user" ref={dropdownRef}>
          <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src="https://i.pravatar.cc/40" alt="User" className="user-avatar" />
            <span className="username">Zaheer</span>
            <FaChevronDown className="dropdown-icon" />
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <FaUserCircle /> Profile
              </button>
              <button className="dropdown-item">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
