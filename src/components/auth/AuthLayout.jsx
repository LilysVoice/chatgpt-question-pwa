import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ConfirmEmailForm from './ConfirmEmailForm'

const AuthLayout = () => {
    const [currentView, setCurrentView] = useState('login') // 'login', 'signup', 'confirm'
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
            case 'signup':
                return (
                    <SignUpForm
                        onSignUpSuccess={handleSignUpSuccess}
                        onSwitchToLogin={() => setCurrentView('login')}
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
            default:
                return (
                    <LoginForm
                        onSwitchToSignUp={() => setCurrentView('signup')}
                    />
                )
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>ChatGPT Question App</h1>
                    <p>Sign in to start asking questions</p>
                </div>
                {renderCurrentView()}
            </div>
        </div>
    )
}

export default AuthLayout
