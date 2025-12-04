/**
 * AccountCreation modal component using Supabase Auth
 *
 * Provides simple email/password authentication for both sign up and sign in.
 * Displays as an overlay modal on top of the onboarding page.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AccountCreation.css';

export default function AccountCreation({ mode = 'signup', isOpen, onClose, onSwitchMode }) {
  const isSignUp = mode === 'signup';
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setMessage(null);
    }
  }, [isOpen, mode]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      });

      if (error) throw error;

      if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setMessage('Account already exists. Please sign in instead.');
        } else if (data.session) {
          setMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            onClose();
            navigate('/');
          }, 500);
        } else {
          setMessage('Please check your email to confirm your account.');
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        setMessage('Signed in successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          navigate('/');
        }, 500);
      }
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleSignIn;

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('auth-modal-backdrop')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isSignUp ? 'Create your account' : 'Welcome back!'}</h2>
          <button className="auth-close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="auth-modal-subheading">
          {isSignUp
            ? "We'll save your progress and generate your personalized report"
            : 'Sign in to access your reports and continue your journey'}
        </p>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {/* Email input */}
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="auth-input"
            />
          </div>

          {/* Password input */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={loading}
              className="auth-input"
            />
            {isSignUp && (
              <p className="field-hint">Must be at least 6 characters</p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="auth-message success">
              {message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-primary-button"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          {/* Toggle between sign in/sign up */}
          <div className="auth-toggle">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => onSwitchMode('signin')}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => onSwitchMode('signup')}
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
