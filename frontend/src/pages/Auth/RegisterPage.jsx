import React from 'react';
import './RegisterPage.css';
import { RegisterForm } from '../../components';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Create Your Account 🚀</h2>
        <RegisterForm onRegisterSuccess={() => navigate('/login')} />
        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
