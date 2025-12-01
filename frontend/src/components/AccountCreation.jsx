import { SignUp, SignIn } from '@clerk/clerk-react';
import './AccountCreation.css';

export default function AccountCreation({ mode = 'signup', onSuccess }) {
  const isSignUp = mode === 'signup';

  return (
    <div className="account-creation">
      <div className="account-creation-container">
        <div className="account-creation-header">
          <h2>{isSignUp ? 'Create your account to continue' : 'Welcome back!'}</h2>
          <p className="account-creation-subheading">
            {isSignUp
              ? "We'll save your progress and generate your personalized report"
              : 'Sign in to access your reports and continue your journey'}
          </p>
        </div>

        <div className="clerk-form-wrapper">
          {isSignUp ? (
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'clerk-root-box',
                  card: 'clerk-card',
                  headerTitle: 'clerk-header-title',
                  headerSubtitle: 'clerk-header-subtitle',
                  socialButtonsBlockButton: 'clerk-social-button',
                  formButtonPrimary: 'clerk-primary-button',
                  formFieldInput: 'clerk-input',
                  footerActionLink: 'clerk-link',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                },
              }}
              routing="hash"
              afterSignUpUrl="/chat"
              signInUrl="#/signin"
            />
          ) : (
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'clerk-root-box',
                  card: 'clerk-card',
                  headerTitle: 'clerk-header-title',
                  headerSubtitle: 'clerk-header-subtitle',
                  socialButtonsBlockButton: 'clerk-social-button',
                  formButtonPrimary: 'clerk-primary-button',
                  formFieldInput: 'clerk-input',
                  footerActionLink: 'clerk-link',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                },
              }}
              routing="hash"
              afterSignInUrl="/chat"
              signUpUrl="#/signup"
            />
          )}
        </div>
      </div>
    </div>
  );
}
