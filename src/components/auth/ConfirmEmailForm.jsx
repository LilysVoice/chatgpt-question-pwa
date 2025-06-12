import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

const ConfirmEmailForm = ({ username, onConfirmSuccess, onBackToSignUp, onResendCode }) => {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resending, setResending] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const { confirmSignUp } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccessMessage('')

        try {
            console.log('📧 Attempting to confirm with code:', code)
            const result = await confirmSignUp(username, code)
            if (result.success) {
                console.log('✅ Confirmation successful!')
                setSuccessMessage('Email confirmed successfully! You can now sign in.')
                setTimeout(() => {
                    onConfirmSuccess()
                }, 1500)
            } else {
                setError(result.error || 'Failed to confirm email')
            }
        } catch (err) {
            console.error('❌ Confirmation error:', err)
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        setResending(true)
        setError('')
        setSuccessMessage('')

        try {
            console.log('📧 Resending confirmation code to:', username)
            const result = await onResendCode()
            if (result.success) {
                setSuccessMessage('Confirmation code sent! Check your email.')
            } else {
                setError(result.error || 'Failed to resend code')
            }
        } catch (err) {
            console.error('❌ Resend error:', err)
            setError('Failed to resend code')
        } finally {
            setResending(false)
        }
    }

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '') // Only allow numbers
        if (value.length <= 6) {
            setCode(value)
        }
        // Clear messages when user starts typing
        if (error) setError('')
        if (successMessage) setSuccessMessage('')
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="confirm-form">
            <div className="confirm-header">
                <h2>Confirm Your Email</h2>
                <p>We've sent a verification code to <strong>{username}</strong></p>
                <p className="confirm-subtitle">Check your email and enter the 6-digit code below</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="code">Verification Code</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={handleCodeChange}
                        required
                        placeholder="000000"
                        maxLength="6"
                        className="code-input"
                        autoComplete="one-time-code"
                        style={{
                            fontSize: '1.2em',
                            textAlign: 'center',
                            letterSpacing: '0.1em'
                        }}
                    />
                    <small>Enter the 6-digit code from your email</small>
                </div>

                {error && <ErrorMessage message={error} />}
                {successMessage && (
                    <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>
                        {successMessage}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || code.length !== 6}
                >
                    {loading ? 'Confirming...' : 'Confirm Email'}
                </button>

                <div className="auth-footer">
                    <p>
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={handleResendCode}
                            disabled={resending}
                        >
                            {resending ? 'Resending...' : 'Resend code'}
                        </button>
                    </p>
                    <p>
                        <button type="button" className="link-button" onClick={onBackToSignUp}>
                            Back to Sign Up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default ConfirmEmailForm
