import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ConfirmEmailForm from './ConfirmEmailForm'

const AuthLayout = () => {
    const { authStep, pendingUsername, setAuthStep, resendConfirmationCode } = useAuth()

    const handleSignUpSuccess = (username) => {
        // No need to set state here - AuthContext handles it
        console.log('📝 Sign up success in AuthLayout for:', username)
    }

    const handleConfirmSuccess = () => {
        console.log('✅ Confirmation success in AuthLayout')
        setAuthStep('login')
    }

    const handleResendCode = async () => {
        if (pendingUsername) {
            return await resendConfirmationCode(pendingUsername)
        }
        return { success: false, error: 'No username found' }
    }

    const renderCurrentView = () => {
        switch (authStep) {
            case 'login':
                return (
                    <LoginForm
                        onSwitchToSignUp={() => setAuthStep('signup')}
                    />
                )
            case 'confirm':
                return (
                    <ConfirmEmailForm
                        username={pendingUsername}
                        onConfirmSuccess={handleConfirmSuccess}
                        onBackToSignUp={() => setAuthStep('signup')}
                        onResendCode={handleResendCode}
                    />
                )
            case 'signup':
            default:
                return (
                    <SignUpForm
                        onSignUpSuccess={handleSignUpSuccess}
                        onSwitchToLogin={() => setAuthStep('login')}
                    />
                )
        }
    }

    const getHeaderText = () => {
        switch (authStep) {
            case 'signup':
                return 'Create your account to start asking questions'
            case 'login':
                return 'Welcome back! Sign in to continue'
            case 'confirm':
                return 'Check your email for verification'
            default:
                return 'Welcome to ChatGPT Question App'
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>ChatGPT Question App</h1>
                    <p>{getHeaderText()}</p>
                </div>

                {/* Only show tabs for login/signup, not during confirmation */}
                {authStep !== 'confirm' && (
                    <div className="auth-tabs">
                        <button
                            className={`tab-button ${authStep === 'signup' ? 'active' : ''}`}
                            onClick={() => setAuthStep('signup')}
                        >
                            Create Account
                        </button>
                        <button
                            className={`tab-button ${authStep === 'login' ? 'active' : ''}`}
                            onClick={() => setAuthStep('login')}
                        >
                            Sign In
                        </button>
                    </div>
                )}

                {renderCurrentView()}
            </div>
        </div>
    )
}

export default AuthLayout
