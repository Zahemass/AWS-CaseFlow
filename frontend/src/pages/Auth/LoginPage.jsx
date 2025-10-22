import React from 'react';
import './LoginPage.css';
import { LoginForm } from '../../components';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back 👋</h1>
          <p className="subtitle">Sign in to continue your journey</p>
        </div>

        <div className="auth-form-container">
          <LoginForm onLoginSuccess={() => navigate('/dashboard')} />
        </div>

        <p className="auth-switch">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
