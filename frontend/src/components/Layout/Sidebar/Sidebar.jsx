import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'
import {
  FaHome,
  FaFolderOpen,
  FaFileAlt,
  FaRobot,
  FaChartPie,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Detect screen resize to toggle mobile mode
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Navigation links (with AI Agent added)
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/cases', label: 'Cases', icon: <FaFolderOpen /> },
    { path: '/documents', label: 'Documents', icon: <FaFileAlt /> },
    { path: '/analysis', label: 'AI Analysis', icon: <FaChartPie /> },
    { path: '/agent', label: 'AI Agent', icon: <FaRobot /> }, // 🧠 NEW LINK
    { path: '/reports', label: 'Reports', icon: <FaChartPie /> },
  ]

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <div className="mobile-toggle" onClick={() => setIsOpen(true)}>
          <FaBars size={22} />
        </div>
      )}

      {/* Overlay for mobile mode */}
      {isMobile && isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobile ? (isOpen ? 'open' : 'closed') : ''
        }`}
      >
        <div
          className="sidebar-toggle"
          onClick={() =>
            isMobile ? setIsOpen(false) : setIsCollapsed(!isCollapsed)
          }
        >
          {isMobile ? <FaTimes /> : isCollapsed ? '☰' : '✖'}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
