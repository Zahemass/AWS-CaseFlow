import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} CaseFlow AI — Built for Legal Intelligence</p>
    </footer>
  )
}

export default Footer
