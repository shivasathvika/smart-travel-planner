import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Auth.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if no token is present
  React.useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (passwords.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        throw new Error('Reset token is missing');
      }

      const response = await api.auth.resetPassword(token, passwords.password);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Redirect to sign in page on success
      navigate('/signin', { 
        state: { message: 'Password has been reset successfully. Please sign in with your new password.' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwords.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <span className="form-help">
              Password must be at least 8 characters long
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>Remember your password? <Link to="/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
