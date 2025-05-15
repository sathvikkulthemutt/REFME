import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { authService } from '../services/api';
import '../styles/global.css';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const { login, error, clearError } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || (!forgotMode && !password)) {
      addNotification('error', forgotMode ? 'Please enter your email' : 'Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      
      if (forgotMode) {
        // Handle password reset request
        await authService.forgotPassword(username);
        addNotification('success', 'Password reset email sent. Please check your inbox.');
        setForgotMode(false);
      } else {
        // Handle normal login
        await login(username, password);
        addNotification('success', 'Login successful!');
      }
    } catch (err) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (forgotMode) {
    return (
      <div className="glass-panel">
        <h2>Forgot Password</h2>
        {error && (
          <div className="alert error" onClick={clearError}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setForgotMode(false); }}>
              Back to Login
            </a>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2>Login</h2>
      {error && (
        <div className="alert error" onClick={clearError}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setForgotMode(true); }}>
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm; 