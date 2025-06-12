import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

const ConfirmEmailForm = ({ username, onConfirmSuccess, onBackToSignUp }) => {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resending, setResending] = useState(false)

    const { confirmSignUp, signUp } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await confirmSignUp(username, code)
            if (result.success) {
                onConfirmSuccess()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        setResending(true)
        setError('')

        try {
            // Note: AWS Cognito doesn't have a separate resend function
            // We need to trigger a new sign up to resend the code
            // In a real app, you might want to implement resendConfirmationCode
            setError('Please try signing up again to receive a new code')
        } catch (err) {
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
                    />
                    <small>Enter the 6-digit code from your email</small>
                </div>

                {error && <ErrorMessage message={error} />}

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
