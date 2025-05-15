import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import '../styles/global.css';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      addNotification('error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword(token || '', password);
      addNotification('success', 'Password has been reset successfully');
      // Redirect to homepage after successful password reset
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      addNotification('error', err.response?.data?.msg || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="cyber-dots"></div>
      
      <div className="homepage-content">
        <div className="logo-container">
          <h1 className="welcome-text">RefMe</h1>
          <p className="tagline">Reset your password</p>
        </div>
        
        <div className="glass-panel" style={{ maxWidth: '500px', width: '100%' }}>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 