import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login Data:', form)
    // TODO: connect with backend login endpoint
    // navigate('/dashboard')
  }

  return (
    <div className="auth-container">
      <div className="login-box">
        <h1>Welcome Back</h1>

        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>

        <div className="login-footer">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
