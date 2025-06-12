// EmailVerificationHandler.jsx - Handle email verification from links
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

const EmailVerificationHandler = () => {
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('')
    const { setAuthStep } = useAuth()

    useEffect(() => {
        const handleEmailVerification = async () => {
            try {
                // Get URL parameters
                const urlParams = new URLSearchParams(window.location.search)
                const code = urlParams.get('confirmation_code')
                const username = urlParams.get('username')

                if (!code || !username) {
                    throw new Error('Missing verification parameters')
                }

                console.log('🔗 Processing email verification link for:', username)

                // Import Amplify Auth to confirm the signup
                const { confirmSignUp } = await import('aws-amplify/auth')

                await confirmSignUp({
                    username: decodeURIComponent(username),
                    confirmationCode: code
                })

                console.log('✅ Email verification successful via link!')
                setStatus('success')
                setMessage('Your email has been verified successfully! You can now sign in.')

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    setAuthStep('login')
                    // Clear the URL parameters
                    window.history.replaceState({}, document.title, window.location.pathname)
                }, 3000)

            } catch (error) {
                console.error('❌ Email verification failed:', error)
                setStatus('error')
                setMessage(error.message || 'Failed to verify email. Please try again.')
            }
        }

        handleEmailVerification()
    }, [setAuthStep])

    const handleBackToLogin = () => {
        setAuthStep('login')
        window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (status === 'verifying') {
        return (
            <div className="verification-container">
                <LoadingSpinner />
                <h2>Verifying your email...</h2>
                <p>Please wait while we confirm your email address.</p>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="verification-container">
                <div className="success-icon">✅</div>
                <h2>Email Verified!</h2>
                <p>{message}</p>
                <p>Redirecting to login in 3 seconds...</p>
                <button
                    className="btn btn-primary"
                    onClick={handleBackToLogin}
                >
                    Sign In Now
                </button>
            </div>
        )
    }

    return (
        <div className="verification-container">
            <div className="error-icon">❌</div>
            <h2>Verification Failed</h2>
            <ErrorMessage message={message} />
            <button
                className="btn btn-primary"
                onClick={handleBackToLogin}
            >
                Back to Login
            </button>
        </div>
    )
}

export default EmailVerificationHandler
