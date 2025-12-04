/**
 * Settings modal component with Supabase authentication
 * Displays as an overlay on top of the main app
 */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { api } from '../api';
import './Settings.css';

export default function Settings({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Get Supabase session token
  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Load user and subscription when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initializeSettings = async () => {
      setLoading(true);
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);

      // Load subscription
      await loadSubscription();
    };

    initializeSettings();
  }, [isOpen]);

  const loadSubscription = async () => {
    try {
      const sub = await api.getSubscription(getToken);
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      await api.cancelSubscription(getToken);
      alert('Subscription cancelled successfully. You will have access until the end of your billing period.');
      await loadSubscription(); // Reload to show updated status
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleManagePayment = async () => {
    setPortalLoading(true);
    try {
      const { portal_url } = await api.getCustomerPortal(getToken);
      window.location.href = portal_url; // Redirect to Stripe Customer Portal
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      alert('Failed to open payment settings. Please try again.');
      setPortalLoading(false);
    }
  };

  const handleUpgrade = () => {
    onClose();
    window.location.href = '/paywall';
  };

  const getTierDisplayName = (tier) => {
    const names = {
      'free': 'Free Tier',
      'single_report': 'Single Report',
      'monthly': 'Monthly Subscription',
      'yearly': 'Yearly Subscription'
    };
    return names[tier] || tier;
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('settings-modal-backdrop')) {
      onClose();
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="settings-modal-backdrop" onClick={handleBackdropClick}>
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h1>Account Settings</h1>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="settings-loading">Loading...</div>
        ) : (
          <div className="settings-content">
            {/* Account Section */}
            <section className="settings-section">
              <h2>Account</h2>
              <div className="setting-item">
                <label>Email Address</label>
                <p className="setting-value">{user?.email}</p>
              </div>
            </section>

            {/* Subscription Section */}
            <section className="settings-section">
              <h2>Subscription</h2>

              <div className="setting-item">
                <label>Current Plan</label>
                <p className="setting-value subscription-tier">
                  {getTierDisplayName(subscription?.tier)}
                </p>
              </div>

              {subscription?.tier !== 'free' && (
                <>
                  <div className="setting-item">
                    <label>Status</label>
                    <p className="setting-value">
                      <span className={`status-badge ${subscription?.status}`}>
                        {subscription?.status === 'active' ? 'Active' : subscription?.status}
                      </span>
                    </p>
                  </div>

                  {subscription?.current_period_end && (
                    <div className="setting-item">
                      <label>
                        {subscription?.status === 'cancelled' ? 'Access Until' : 'Renews On'}
                      </label>
                      <p className="setting-value">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="setting-actions">
                    <button
                      className="action-button secondary"
                      onClick={handleManagePayment}
                      disabled={portalLoading}
                    >
                      {portalLoading ? 'Loading...' : 'Update Payment Method'}
                    </button>

                    {subscription?.status === 'active' && (
                      <button
                        className="action-button danger"
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {subscription?.tier === 'free' && (
                <div className="upgrade-prompt">
                  <p>Upgrade to a paid plan for unlimited access and no expiration on reports.</p>
                  <button
                    className="action-button primary"
                    onClick={handleUpgrade}
                  >
                    View Plans
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
