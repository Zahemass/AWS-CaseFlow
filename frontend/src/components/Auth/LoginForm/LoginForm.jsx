import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        console.log('✅ Login successful');
        navigate('/cases');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <p className="login-subtitle">continue to your workspace</p>

      <div className="input-group">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=" "
        />
        <label htmlFor="email">Email Address</label>
      </div>

      <div className="input-group">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=" "
        />
        <label htmlFor="password">Password</label>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
