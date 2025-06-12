import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ConfirmEmailForm from './ConfirmEmailForm'

const AuthLayout = () => {
    const [currentView, setCurrentView] = useState('signup') // Changed default to 'signup'
    const [pendingUsername, setPendingUsername] = useState('')

    const handleSignUpSuccess = (username) => {
        setPendingUsername(username)
        setCurrentView('confirm')
    }

    const handleConfirmSuccess = () => {
        setCurrentView('login')
        setPendingUsername('')
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'login':
                return (
                    <LoginForm
                        onSwitchToSignUp={() => setCurrentView('signup')}
                    />
                )
            case 'confirm':
                return (
                    <ConfirmEmailForm
                        username={pendingUsername}
                        onConfirmSuccess={handleConfirmSuccess}
                        onBackToSignUp={() => setCurrentView('signup')}
                    />
                )
            default: // 'signup'
                return (
                    <SignUpForm
                        onSignUpSuccess={handleSignUpSuccess}
                        onSwitchToLogin={() => setCurrentView('login')}
                    />
                )
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>ChatGPT Question App</h1>
                    {currentView === 'signup' ? (
                        <p>Create your account to start asking questions</p>
                    ) : currentView === 'login' ? (
                        <p>Welcome back! Sign in to continue</p>
                    ) : (
                        <p>Check your email for verification</p>
                    )}
                </div>

                <div className="auth-tabs">
                    <button
                        className={`tab-button ${currentView === 'signup' ? 'active' : ''}`}
                        onClick={() => setCurrentView('signup')}
                    >
                        Create Account
                    </button>
                    <button
                        className={`tab-button ${currentView === 'login' ? 'active' : ''}`}
                        onClick={() => setCurrentView('login')}
                    >
                        Sign In
                    </button>
                </div>

                {renderCurrentView()}
            </div>
        </div>
    )
}

export default AuthLayout
