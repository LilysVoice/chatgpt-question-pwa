import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ConfirmEmailForm from './ConfirmEmailForm'
import EmailVerificationHandler from './EmailVerificationHandler'

const AuthLayout = () => {
    const { authStep, pendingUsername, setAuthStep, resendConfirmationCode } = useAuth()

    // Check for email verification link on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const hasVerificationParams = urlParams.get('confirmation_code') && urlParams.get('username')

        if (hasVerificationParams) {
            console.log('🔗 Email verification link detected')
            setAuthStep('email-verify')
        }
    }, [setAuthStep])

    const handleSignUpSuccess = (username) => {
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
            case 'email-verify':
                return <EmailVerificationHandler />
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
            case 'email-verify':
                return 'Verifying your email address'
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

                {/* Only show tabs for login/signup, not during confirmation or verification */}
                {authStep !== 'confirm' && authStep !== 'email-verify' && (
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
