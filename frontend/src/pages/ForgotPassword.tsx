import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.auth.requestPasswordReset(email);

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('Password reset instructions have been sent to your email.');
      setEmail(''); // Clear the form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while requesting password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>Remember your password? <Link to="/signin">Sign In</Link></p>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
