import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './RegisterPage.css'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register data:', form)
    // TODO: Connect to backend API endpoint /auth/register
  }

  return (
    <div className="auth-container">
      <div className="register-box">
        <h1>Create Your Account</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        <div className="register-footer">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
