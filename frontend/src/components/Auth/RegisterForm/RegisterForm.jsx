import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import './RegisterForm.css';

const RegisterForm = ({ onRegistered }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('register'); // "register" | "verify"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // -------------------
  // Step 1: Register user
  // -------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setMessage('Verification code sent to your email 📩');
        setStep('verify');
      } else {
        setMessage('Registered successfully! You can now log in.');
        if (onRegistered) onRegistered(email);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Step 2: Confirm verification code
  // -------------------
  const handleConfirm = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      setMessage('✅ Account verified! You can now log in.');
      setStep('done');
      if (onRegistered) onRegistered(email);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Confirmation failed:', err);
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={step === 'register' ? handleRegister : handleConfirm}>
      <p className="register-subtitle">
        {step === 'verify'
          ? 'Enter the verification code sent to your email'
          : 'Create your account to get started'}
      </p>

      {step === 'register' && (
        <>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Confirm Password</label>
          </div>
        </>
      )}

      {step === 'verify' && (
        <div className="input-group">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            placeholder=" "
          />
          <label>Verification Code</label>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <button type="submit" disabled={loading}>
        {loading
          ? step === 'verify'
            ? 'Verifying...'
            : 'Registering...'
          : step === 'verify'
          ? 'Confirm Code'
          : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
